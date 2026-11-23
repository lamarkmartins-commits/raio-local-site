import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = path => readFile(resolve(root, path), 'utf8');
const check = process.argv.includes('--check');
let changed = false;

async function output(path, value) {
  const fullPath = resolve(root, path);
  const current = await readFile(fullPath, 'utf8');
  if (current === value) return;
  changed = true;
  if (check) {
    console.error(`Desatualizado: ${path}`);
    return;
  }
  await writeFile(fullPath, value, 'utf8');
  console.log(`Gerado: ${path}`);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function formatDate(value) {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) throw new Error(`Data inválida: ${value}`);
  return `${day}/${month}/${year}`;
}

function replaceOnce(source, token, replacement) {
  if (!source.includes(token)) throw new Error(`Marcador ausente: ${token}`);
  return source.replace(token, replacement);
}

function gitLastModified(path) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', path], {
      cwd: root,
      encoding: 'utf8'
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  } catch {
    return null;
  }
}

function pageLastModified(path) {
  if (path === '/') return gitLastModified('index.html');
  if (path === '/blog/') return gitLastModified('blog/index.html');

  if (path.startsWith('/blog/')) {
    const slug = path.replace(/^\/blog\/|\/$/g, '');
    try {
      const html = readFileSync(resolve(root, `blog/${slug}/index.html`), 'utf8');
      const date = html.match(/<meta[^>]+property=["']article:modified_time["'][^>]+content=["'](\d{4}-\d{2}-\d{2})/i)?.[1]
        || html.match(/<time[^>]+datetime=["'](\d{4}-\d{2}-\d{2})["']/i)?.[1];
      if (date) return date;
    } catch {}
    return gitLastModified(`blog/${slug}/index.html`);
  }

  const serviceSlug = path.replace(/^\/servicos\//, '');
  return gitLastModified(`servicos/${serviceSlug}.html`);
}

const posts = JSON.parse(await read('content/posts.json'));
const published = posts.filter(post => post.published);
const slugs = new Set();
for (const post of published) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || slugs.has(post.slug)) {
    throw new Error(`Slug inválido ou repetido: ${post.slug}`);
  }
  slugs.add(post.slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.datePublished)) {
    throw new Error(`Data de publicação inválida: ${post.slug}`);
  }
  await read(`blog/${post.slug}/index.html`);
}
published.sort((a, b) =>
  b.datePublished.localeCompare(a.datePublished) ||
  a.order - b.order ||
  a.slug.localeCompare(b.slug)
);

for (const post of published) {
  if (post.slug === 'o-que-e-trafego-pago') continue;
  const articlePath = `blog/${post.slug}/index.html`;
  let html = await read(articlePath);
  html = html.replace(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g, (match, jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      const nodes = data['@graph'] || [data];
      for (const node of nodes) {
        if (node['@type'] === 'BlogPosting') {
          node.datePublished = node.datePublished || post.datePublished;
          node.dateModified = node.dateModified || post.datePublished;
          node.image = node.image || (post.slug === 'quanto-custa-um-site-em-joao-pessoa'
            ? 'https://www.raiolocal.com/site-bfgames-raio-local.png'
            : 'https://www.raiolocal.com/og_image.jpg');
        }
      }
      return match.replace(jsonText, JSON.stringify(data));
    } catch {
      return match;
    }
  });
  await output(articlePath, html);
}

const featured = published[0];
const featureArt = featured.featureArt || {
  query: featured.category,
  caption: featured.title,
  note: 'Blog da Raio Local'
};
const featureHtml = `<a class="blog-feature" href="${featured.slug}/">
          <div class="blog-feature-copy"><div class="blog-feature-meta"><span>${escapeHtml(featured.category)}</span><span aria-hidden="true">·</span><time datetime="${featured.datePublished}">${formatDate(featured.datePublished)}</time></div><h3>${escapeHtml(featured.title)}</h3><p>${escapeHtml(featured.summary)}</p><span class="blog-feature-read">Ler artigo <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></span></div>
          <div class="blog-feature-art" aria-hidden="true"><div class="blog-search-card"><div class="blog-search-bar"><i></i><span>${escapeHtml(featureArt.query)}</span></div><div class="blog-search-map"><span>↗</span></div><strong class="blog-search-caption">${escapeHtml(featureArt.caption)}<small>${escapeHtml(featureArt.note)}</small></strong></div></div>
        </a>`;
const cardsHtml = published.slice(1).map(post => `<a class="blog-post-card" href="${post.slug}/">
          <span class="blog-post-card-meta">${escapeHtml(post.category)} · <time datetime="${post.datePublished}">${formatDate(post.datePublished)}</time></span>
          <span class="blog-post-card-content"><strong>${escapeHtml(post.title)}</strong><span>${escapeHtml(post.summary)}</span></span>
          <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg>
        </a>`).join('\n        ');
let listing = await read('templates/blog-list.html');
listing = replaceOnce(listing, '<!-- FEATURE -->', featureHtml);
listing = replaceOnce(listing, '<!-- CARDS -->', cardsHtml);
await output('blog/index.html', listing);

const sitePages = JSON.parse(await read('content/site-pages.json'));
const sitemapUrls = [...sitePages, ...published.map(post => `/blog/${post.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(path => {
  const lastmod = pageLastModified(path);
  return `  <url><loc>https://www.raiolocal.com${path}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}</url>`;
}).join('\n')}
</urlset>
`;
await output('sitemap.xml', sitemap);

const pilot = JSON.parse(await read('content/o-que-e-trafego-pago.json'));
if (pilot.slug !== 'o-que-e-trafego-pago') throw new Error('Slug do piloto inesperado');
let article = await read('templates/article.html');
let content = await read('content/o-que-e-trafego-pago.html');
const header = await read('templates/partials/header-article.html');
const footer = await read('templates/partials/footer-article.html');
content = replaceOnce(content, '{{DATE_MODIFIED}}', pilot.dateModified);
content = replaceOnce(content, '{{DATE_MODIFIED_DISPLAY}}', formatDate(pilot.dateModified));
const replacements = {
  '{{TITLE}}': escapeHtml(pilot.seoTitle),
  '{{DESCRIPTION}}': escapeHtml(pilot.description),
  '{{URL}}': `https://www.raiolocal.com/blog/${pilot.slug}/`,
  '{{OG_TITLE}}': escapeHtml(pilot.ogTitle),
  '{{OG_DESCRIPTION}}': escapeHtml(pilot.ogDescription),
  '{{HEADLINE_JSON}}': JSON.stringify(pilot.headline),
  '{{DESCRIPTION_JSON}}': JSON.stringify(pilot.structuredDescription),
  '{{DATE_PUBLISHED}}': pilot.datePublished || '2026-10-28',
  '{{DATE_MODIFIED}}': pilot.dateModified,
  '{{HEADER}}': header.trimEnd() + '\n',
  '{{CONTENT}}': content.trimEnd(),
  '{{FOOTER}}': footer.trimEnd()
};
for (const [token, value] of Object.entries(replacements)) {
  if (!article.includes(token)) throw new Error(`Marcador ausente: ${token}`);
  article = article.replaceAll(token, value);
}
if (/\{\{[A-Z_]+\}\}/.test(article)) throw new Error('Marcador não resolvido no artigo');
await output('blog/o-que-e-trafego-pago/index.html', article);

if (check && changed) process.exitCode = 1;
