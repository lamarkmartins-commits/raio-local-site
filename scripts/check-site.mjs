import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const host = 'https://www.raiolocal.com';
const errors = [];
const warnings = [];

async function* htmlFiles(directory) {
  for (const entry of await readdir(resolve(root, directory), { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html') && !entry.name.startsWith('.')) yield path;
  }
}

function publicUrl(file) {
  const path = file.replaceAll('\\', '/');
  if (path === 'index.html') return '/';
  if (path === 'blog/index.html') return '/blog/';
  if (path.endsWith('/index.html')) return '/' + path.slice(0, -'index.html'.length);
  return '/' + path.slice(0, -'.html'.length);
}

function targetFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  if (decoded === '/' || decoded === '/inicio' || decoded === '/inicio/' || decoded === '/index' || decoded === '/index/' || decoded === '/index.html') return 'index.html';
  if (/^\/servicos\/(criacao-de-sites|seo-local-google-mapas|consultoria-google-perfil-da-empresa|consultoria-em-usabilidade|site-de-pagina-unica)\/?$/.test(decoded)) return `servicos/${decoded.split('/')[2]}.html`;
  if (decoded === '/servicos/criacao-de-sites.html') return 'servicos/criacao-de-sites.html';
  if (decoded === '/servicos/seo-local-google-mapas.html') return 'servicos/seo-local-google-mapas.html';
  if (decoded === '/servicos/consultoria-google-perfil-da-empresa.html') return 'servicos/consultoria-google-perfil-da-empresa.html';
  if (decoded === '/servicos/consultoria-em-usabilidade.html') return 'servicos/consultoria-em-usabilidade.html';
  if (decoded === '/servicos/site-de-pagina-unica.html') return 'servicos/site-de-pagina-unica.html';
  if (/^\/blog\/[a-z0-9-]+\/?$/.test(decoded)) return `blog/${decoded.split('/')[2]}/index.html`;
  if (decoded.endsWith('/')) return decoded.slice(1) + 'index.html';
  if (decoded === '/blog/blog') return 'blog/blog.html';
  return decoded.slice(1) + (decoded.endsWith('.html') || decoded.includes('.', decoded.lastIndexOf('/')) ? '' : '.html');
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]));
}

const pages = new Map();
for (const directory of ['blog', 'servicos']) {
  for await (const file of htmlFiles(directory)) pages.set(file, await readFile(resolve(root, file), 'utf8'));
}
pages.set('index.html', await readFile(resolve(root, 'index.html'), 'utf8'));

for (const [file, html] of pages) {
  const base = new URL(publicUrl(file), host);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  const redirect = file.replaceAll('\\', '/') === 'blog/blog.html';
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  const ogUrl = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/)?.[1];
  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/)?.[1];
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  if (!/<html[^>]*\blang="pt-BR"/i.test(html)) errors.push(`${file}: html lang não é pt-BR`);
  if (/meta[^>]+name=["'](?:geo\.|ICBM)/i.test(html)) errors.push(`${file}: meta geo/ICBM presente`);
  if (/(?:^|\s)git(?:\s|$|<)/i.test(html)) errors.push(`${file}: texto solto "git" encontrado`);
  if (!redirect && !title) errors.push(`${file}: title ausente`);
  if (!redirect && !description) errors.push(`${file}: meta description ausente`);
  if (!redirect && h1Count !== 1) warnings.push(`${file}: ${h1Count} elementos H1`);
  if (!redirect && /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) {
    errors.push(`${file}: página pública marcada como noindex`);
  }
  if (/(?:href=["'](?:\.\/)?blog\/?|href=["']\/blog\/blog(?:\.html)?\/?)["']/i.test(html)) {
    errors.push(`${file}: link gera ou aponta para /blog/blog`);
  }
  if (/\/(?:index(?:\.html)?|inicio)(?:[/?#"'<]|$)|href=["']#servicos["']/i.test(html)) {
    errors.push(`${file}: link interno não padronizado`);
  }
  if (!canonical) errors.push(`${file}: canonical ausente`);
  else if (!redirect && canonical !== base.href) errors.push(`${file}: canonical ${canonical} difere de ${base.href}`);
  if (!redirect && ogUrl !== canonical) errors.push(`${file}: og:url difere do canonical`);
  if (!redirect && ogImage) {
    const imageUrl = new URL(ogImage, base);
    if (imageUrl.origin === host) {
      try { await stat(resolve(root, targetFile(imageUrl.pathname))); }
      catch { errors.push(`${file}: og:image ausente: ${ogImage}`); }
    }
  }
  if (html.includes('\uFFFD')) errors.push(`${file}: caractere de substituição Unicode encontrado`);
  for (const imageTag of html.matchAll(/<img\b[^>]*>/gi)) {
    const attrs = attributes(imageTag[0]);
    if (!attrs.width || !attrs.height) warnings.push(`${file}: imagem sem width/height: ${attrs.src || '?'}`);
  }
  if (/"aggregateRating"\s*:/.test(html)) {
    errors.push(`${file}: aggregateRating presente em dados estruturados`);
  }

  for (const script of html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(script[1]);
      const nodes = data['@graph'] || [data];
      for (const node of nodes) {
        if (node['@type'] === 'Organization' && node.aggregateRating) {
          errors.push(`${file}: dados estruturados contêm aggregateRating sem avaliações verificáveis`);
        }
        if (node['@type'] === 'BlogPosting' && node.mainEntityOfPage !== canonical) {
          errors.push(`${file}: BlogPosting aponta para URL diferente do canonical`);
        }
        if (node['@type'] === 'BlogPosting') {
          for (const field of ['headline', 'datePublished', 'dateModified', 'author', 'publisher', 'image', 'mainEntityOfPage']) {
            if (!node[field]) errors.push(`${file}: BlogPosting sem ${field}`);
          }
        }
        if (file.startsWith('servicos/') && node['@type'] === 'BreadcrumbList') {
          const items = node.itemListElement;
          if (!Array.isArray(items) || items.length < 3) errors.push(`${file}: BreadcrumbList incompleto`);
        }
      }
    }
    catch (error) { errors.push(`${file}: JSON-LD inválido: ${error.message}`); }
  }

  for (const tag of html.matchAll(/<(a|img|script|link|use|source)\b[^>]*>/g)) {
    const attrs = attributes(tag[0]);
    if (tag[1] === 'img' && !Object.hasOwn(attrs, 'alt')) errors.push(`${file}: imagem sem alt: ${attrs.src || '?'}`);
    const value = attrs.href || attrs.src;
    if (!value || /^(mailto:|tel:|data:|javascript:)/i.test(value)) continue;
    let url;
    try { url = new URL(value.replaceAll('&amp;', '&'), base); }
    catch { errors.push(`${file}: URL inválida: ${value}`); continue; }
    if (url.origin !== host) continue;
    const path = targetFile(url.pathname);
    try {
      const info = await stat(resolve(root, path));
      if (!info.isFile()) errors.push(`${file}: destino não é arquivo: ${value}`);
    } catch { errors.push(`${file}: link ou recurso ausente: ${value} → ${path}`); continue; }
    if (url.hash && path === file.replaceAll('\\', '/') && !ids.has(decodeURIComponent(url.hash.slice(1)))) {
      errors.push(`${file}: âncora ausente: ${value}`);
    }
  }
}

const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
if (!/^User-agent:\s*\*/m.test(robots) || !/^Allow:\s*\//m.test(robots)) {
  errors.push('robots.txt: diretivas User-agent/Allow incorretas');
}
if (!/^Sitemap:\s*https:\/\/www\.raiolocal\.com\/sitemap\.xml$/m.test(robots)) {
  errors.push('robots.txt: sitemap incorreto');
}
const sitemapLocations = new Set();
for (const [, value] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = new URL(value);
  if (sitemapLocations.has(value)) errors.push(`sitemap: URL repetida: ${value}`);
  sitemapLocations.add(value);
  if (url.origin !== host) errors.push(`sitemap: host inesperado: ${value}`);
  else {
    try { await stat(resolve(root, targetFile(url.pathname))); }
    catch { errors.push(`sitemap: página ausente: ${value}`); }
  }
}
for (const [file, html] of pages) {
  if (file.replaceAll('\\', '/') === 'blog/blog.html') continue;
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  if (canonical && !sitemapLocations.has(canonical)) errors.push(`${file}: canonical ausente do sitemap`);
}

for (const issue of errors) console.error('ERRO', issue);
for (const issue of warnings) console.warn('AVISO', issue);
console.log(`Auditoria: ${pages.size} páginas, ${errors.length} erros, ${warnings.length} avisos.`);
if (errors.length) process.exitCode = 1;
