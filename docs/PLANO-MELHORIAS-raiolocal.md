# Plano de melhorias: raiolocal.com

> Atualizado em 22/11/2026 · Baseado em: leitura do site, dados do Google Search Console (24/10 a 20/11/2026) e análise de posicionamento.
> **Fora do escopo deste arquivo:** configuração e estudo do Google Analytics (será feito à parte).

---

## 0. Como usar este arquivo no VS Code

Este documento serve para **você** e para um **agente de código** (GitHub Copilot Agent, Claude Code, Cursor etc.). Cada tarefa tem um ID (`TEC-01`, `ONP-02`…), prioridade, onde mexer e um **critério de aceite**.

**Fluxo sugerido**
1. Abra a pasta do projeto no VS Code e este arquivo na raiz (ou em `/docs`).
2. Cole no agente o prompt da fase atual (Apêndice D).
3. Revise o `git diff` de cada tarefa, teste e só então faça commit (1 commit por tarefa: `fix(TEC-01): ...`).
4. Marque o checkbox `[x]` aqui quando passar no critério de aceite.

**Prioridades:** `P0` = faça primeiro (bloqueia tudo) · `P1` = alto impacto · `P2` = melhoria/otimização.

### 0.1 Regras para o agente (guardrails)

- **Primeiro, descubra a stack:** liste a estrutura do projeto, identifique se é HTML estático, gerador (Astro, Eleventy, Hugo, Next.js…) ou CMS, e **onde o site é hospedado** (Netlify, Vercel, Cloudflare Pages, Apache/cPanel, Nginx…). Isso define como fazer redirecionamentos (Apêndice A).
- **Nunca invente dados.** Preços, números de clientes, resultados de cases, depoimentos, avaliações, nome do autor e endereço completo devem vir do dono do site. Onde faltar, use o marcador `{{PREENCHER: descrição}}` e liste todos os marcadores ao final.
- **Não remova nem renomeie URLs sem 301** para a nova versão.
- **Não toque em nada de analytics/tag manager** nesta rodada.
- **Preserve o design atual** (identidade, tema claro/escuro, acessibilidade), salvo onde a tarefa pedir mudança.
- Escreva em **português do Brasil**, sem exagero de palavras-chave: "João Pessoa" aparece quando faz sentido natural, não em toda frase.
- Ao terminar cada tarefa, informe: arquivos alterados, como testar e o que ficou pendente do dono.

### 0.2 Decisões que dependem de você (o agente não decide sozinho)

- [ ] Preços de partida de cada tipo de site (página única, institucional, landing page) e o que está incluso (domínio, hospedagem, treinamento, manutenção).
- [ ] Resultados reais de cada case (nº de contatos, posições, antes e depois) e autorização dos clientes para citá-los.
- [ ] Qual artigo manter e quais consolidar (CNT-01, seção 4).
- [ ] Nichos prioritários para as páginas por segmento (ONP-08).
- [ ] Nome, foto e mini-bio de quem assina o conteúdo (página Sobre e autor dos artigos).
- [ ] Endereço público: mostrar rua/bairro ou atuar como negócio de área de atendimento (sem endereço visível).
- [ ] Hospedagem atual e quem tem acesso ao painel/DNS.
- [ ] Manter ou não "Consultoria em Usabilidade" na home (ver COP-06).

---

## 1. Resumo do diagnóstico (por que estas tarefas)

| Dado (Search Console, 28 dias) | Leitura |
|---|---|
| 6 cliques, 134 impressões, posição média ~58 | Site quase invisível; a prioridade é resolver duplicações e construir autoridade |
| 5 dos 6 cliques vieram da home (posição ~7,6) | Só a home ranqueia bem; páginas de serviço e artigos não |
| Páginas `.html` duplicadas indexadas (criação de sites, SEO local, perfil, usabilidade, página única) | Sinais de ranqueamento divididos entre 2 URLs do mesmo conteúdo |
| Só a versão `.html` de SEO Local e Perfil da Empresa aparece | O Google escolheu a URL errada como principal |
| Home espalhada em `/`, `/` e canonical em `/` | Canonical ignorado pelo Google |
| `/blog/blog` indexada | Provável link relativo quebrado |
| ~59 impressões em termos de SEO contra ~28 em criação de sites | Você aparece para quem não compra seu serviço |
| Artigos em posição 5 a 10 têm 1 a 3 impressões | Ranqueiam para buscas que ninguém faz |
| 92% das impressões em computador | Oferecer alternativa ao WhatsApp (formulário) |

---

## 2. SEO técnico

### TEC-01 · Home canônica única · P0
- [ ] **Decisão:** a home oficial é `https://www.raiolocal.com/`.
- **O que fazer**
  - Servir o conteúdo da home em `/`.
  - Redirecionar com **301**: `/` → `/`, `/index` → `/`, `/` → `/`.
  - Atualizar na home: `<link rel="canonical" href="https://www.raiolocal.com/">` e `<meta property="og:url" content="https://www.raiolocal.com/">`.
  - Corrigir todos os links internos que apontam para `/` ou `/index` (inclusive `#cases`, `#processo`, `#faq`, `#topo`): `grep -rniE "(/|/index)" .`
- **Aceite:** `curl -sI https://www.raiolocal.com/` retorna `301` com `location: https://www.raiolocal.com/`; o canonical da home aponta para `/`.

### TEC-02 · Eliminar duplicatas `.html` · P0
- [ ] URLs afetadas (todas com 301 para a versão limpa):
  - `/servicos/criacao-de-sites.html` → `/servicos/criacao-de-sites`
  - `/servicos/seo-local-google-mapas.html` → `/servicos/seo-local-google-mapas`
  - `/servicos/consultoria-google-perfil-da-empresa.html` → `/servicos/consultoria-google-perfil-da-empresa`
  - `/servicos/consultoria-em-usabilidade.html` → `/servicos/consultoria-em-usabilidade`
  - `/servicos/site-de-pagina-unica.html` → `/servicos/site-de-pagina-unica`
- **Também:** garantir que nenhum link interno, sitemap ou canonical use `.html`: `grep -rn "\.html" --include="*.html" --include="*.xml" .`
- **Aceite:** todas as URLs acima respondem `301` para a versão limpa e a versão limpa responde `200`.

### TEC-03 · Corrigir `/blog/blog` · P0
- [ ] Hipótese: link relativo `href="blog/"` dentro de uma página que já está em `/blog/`, que resolve para `/blog/blog/`.
- **O que fazer**
  - Procurar: `grep -rnE 'href="(\./)?blog/?"' .`
  - Trocar por link absoluto na raiz: `href="/blog/"`.
  - Adicionar 301 de `/blog/blog` → `/blog/`.
- **Aceite:** nenhum link gera `/blog/blog`; a URL redireciona para `/blog/`.

### TEC-04 · Canonical autorreferente em todas as páginas · P0
- [ ] Cada página tem `<link rel="canonical">` apontando para **ela mesma**, em URL absoluta com `https://www.raiolocal.com/...`, igual ao `og:url`.
- **Regra de barra final:** blog **com** barra (`/blog/slug/`), serviços **sem** barra (`/servicos/slug`). Redirecionar a variante contrária.
- **Aceite:** rodar o script do Apêndice C e não haver página sem canonical ou com canonical diferente da própria URL.

### TEC-05 · Redirecionamento em um único salto · P0
- [ ] `http://raiolocal.com`, `https://raiolocal.com` e `http://www.raiolocal.com` devem ir direto para `https://www.raiolocal.com/` (**um** 301, sem cadeia).
- **Onde:** painel de DNS/hospedagem ou arquivo de configuração (ver Apêndice A).
- **Aceite:** `curl -sIL -o /dev/null -w "%{num_redirects}\n" http://raiolocal.com/` retorna `1`.

### TEC-06 · Padronizar links internos · P0
- [ ] Usar links na raiz (`/servicos/criacao-de-sites`) ou absolutos com `https://www.raiolocal.com`. Nunca `/index#…`, `/#…` ou relativos sem barra.
- [ ] Rodapé: "Criação de sites com SEO", "Google Perfil da Empresa", "Consultoria em SEO local" e "Landing pages" hoje apontam para `#servicos`. Apontar para as páginas reais.
- [ ] Card "Landing Pages" da home aponta para `/servicos/criacao-de-sites`; criar página própria (ONP-08) e apontar para ela.
- **Aceite:** `grep` não encontra mais `/index#`, `/` nem `#servicos` no rodapé.

### TEC-07 · `sitemap.xml` e `robots.txt` · P1
- [ ] `sitemap.xml` com **apenas** URLs canônicas (sem `.html`, sem `/`), `<lastmod>` com a data real da última alteração.
- [ ] `robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://www.raiolocal.com/sitemap.xml
  ```
- [ ] **Manual (você):** reenviar o sitemap no Search Console e, em "Inspeção de URL", solicitar indexação de `/`, das páginas de serviço e do artigo "Quanto custa".
- **Aceite:** sitemap lista só URLs que respondem `200`, sem redirecionamentos.

### TEC-08 · Dados estruturados (JSON-LD) · P1
- [ ] **Home:** `ProfessionalService` (modelo no Apêndice B). **Sem** `aggregateRating` enquanto não houver avaliações reais e verificáveis.
- [ ] **Artigos:** `Article` com `headline`, `datePublished`, `dateModified`, `author`, `publisher`, `image`.
- [ ] **Blog e serviços:** `BreadcrumbList`.
- [ ] **FAQ:** `FAQPage` é opcional. O Google restringiu os rich results de FAQ a poucos tipos de site, então é baixa prioridade.
- **Aceite:** páginas sem erros no [Teste de Resultados Ricos](https://search.google.com/test/rich-results) e no [validator.schema.org](https://validator.schema.org/). O texto do JSON-LD deve bater com o que aparece na página.

### TEC-09 · Performance e Core Web Vitals · P1
- [ ] Converter as capturas dos cases (`site-bfgames-raio-local.png`, `site-frigomaster-raio-local.png`, `site-frikfrippb-raio-local.png`, `varal-de-axe-raio-local.png`) para **WebP ou AVIF**, em tamanhos adequados (máx. ~1200 px de largura), mantendo o PNG apenas como fallback.
- [ ] Todo `<img>`/`<source>` com `width` e `height` (evita salto de layout).
- [ ] `loading="lazy"` nas imagens abaixo da dobra; imagem principal da primeira dobra com `fetchpriority="high"`.
- [ ] Fontes: `font-display: swap`, apenas os pesos usados, `preconnect` se vier de Google Fonts.
- [ ] CSS/JS minificados e com `defer` nos scripts não críticos; cache longo para `/assets` (`Cache-Control: public, max-age=31536000, immutable`).
- **Aceite:** PageSpeed Insights (mobile) para `/`, `/servicos/criacao-de-sites` e um artigo. **Só mantenha no site a promessa "nota alta no PageSpeed" se o resultado confirmar.** Caso contrário, retire a frase (COP-03).

### TEC-10 · Higiene de HTML e conteúdo técnico · P1
- [ ] `<html lang="pt-BR">` em todas as páginas.
- [ ] **Um único `<h1>`** por página.
- [ ] **Bug no artigo "Quanto custa"**: a palavra solta `git` aparece sob o título "Quantidade de páginas e organização dos serviços". Remover.
- [ ] Rodapé da home com "© 2025": atualizar para o ano atual (gerar com JS ou no build) em todas as páginas.
- [ ] "Última atualização" nos artigos só muda quando o conteúdo realmente mudar.
- **Aceite:** script do Apêndice C sem alertas de H1; busca por `git` solto no HTML do artigo retorna vazio.

### TEC-11 · Página 404 · P1
- [ ] Página 404 personalizada com **status HTTP 404** (não 200), menu e links para home, serviços e blog.

### TEC-12 · Meta tags sem efeito · P2
- [ ] Remover `meta geo.*` e `ICBM` (o Google não as usa). O sinal local vem do Perfil da Empresa, de dados consistentes e do conteúdo.

### TEC-13 · Imagens de compartilhamento · P2
- [ ] Artigo "Quanto custa" usa a captura do BF Games como `og:image`. Criar uma imagem `og` própria por artigo (1200×630) com título legível.

### TEC-14 · Cabeçalhos de segurança · P2
- [ ] Ativar HSTS e `X-Content-Type-Options: nosniff` na hospedagem (se o provedor permitir).

---

## 3. SEO on-page

### ONP-01 · Mapa de palavras-chave (uma palavra principal por página) · P0
Regra: **cada palavra principal em uma única página**, para as páginas não disputarem entre si.

| URL | Palavra principal | Secundárias | Intenção |
|---|---|---|---|
| `/` | criação de sites em joão pessoa | site profissional, agência de sites, site com SEO | Comercial |
| `/servicos/criacao-de-sites` | criação de sites para empresas | site institucional, site com WhatsApp | Comercial |
| `/servicos/site-de-pagina-unica` | site de página única | landing page, site simples para empresa | Comercial |
| `/servicos/seo-local-google-mapas` | seo local joão pessoa | google maps, aparecer no maps | Comercial |
| `/servicos/consultoria-google-perfil-da-empresa` | otimização google perfil da empresa | google meu negócio, ficha no google | Comercial |
| `/servicos/consultoria-em-usabilidade` | consultoria em usabilidade | auditoria de usabilidade | Secundária |
| `/blog/quanto-custa-um-site-em-joao-pessoa/` | quanto custa um site em joão pessoa | preço de site, valor de site institucional | Comercial/pesquisa |

> **Parar de disputar** termos genéricos e nacionais como "seo local" e "como fazer seo local". Hoje você aparece nas posições 87 a 94, sem chance de clique.

### ONP-02 · Titles e meta descriptions · P0
Limites: title ≈ 60 caracteres, description 120 a 155. Os textos abaixo são **propostas**; ajuste para o tom da marca. Em títulos longos, o sufixo `| Raio Local` pode ser omitido.

| Página | Title | Description |
|---|---|---|
| `/` | Criação de Sites em João Pessoa com SEO Local \| Raio Local | Sites rápidos, otimizados para o Google e prontos para gerar orçamentos pelo WhatsApp. Entrega em 2 a 4 semanas. Peça sua proposta. |
| `/servicos/criacao-de-sites` | Criação de Sites para Empresas em João Pessoa \| Raio Local | Sites profissionais com SEO, WhatsApp integrado e entrega em 2 a 4 semanas. Veja o que está incluso e peça seu orçamento. |
| `/servicos/site-de-pagina-unica` | Site de Página Única em João Pessoa \| Raio Local | Um site enxuto para apresentar seus serviços e receber pedidos pelo WhatsApp. Ideal para quem quer começar rápido. |
| `/servicos/seo-local-google-mapas` | SEO Local em João Pessoa: Apareça no Google Maps \| Raio Local | Otimização do Perfil da Empresa e do site para aparecer nas buscas da sua região. Diagnóstico e plano de ação. |
| `/servicos/consultoria-google-perfil-da-empresa` | Otimização do Google Perfil da Empresa \| Raio Local | Categorias, fotos, avaliações e dados corretos para sua empresa aparecer no Google Maps e receber mais ligações. |
| `/servicos/consultoria-em-usabilidade` | Consultoria em Usabilidade para Sites \| Raio Local | Auditoria que encontra o que atrapalha o visitante e prioriza melhorias para aumentar o contato. |
| `/blog/` | Blog: Sites e SEO Local para Negócios \| Raio Local | Guias práticos sobre sites, Google Maps e presença digital para empresas locais. |
| `/blog/quanto-custa-um-site-em-joao-pessoa/` | Quanto Custa um Site em João Pessoa? Guia de Preços | Faixas de preço, o que influencia o valor e como comparar propostas. Inclui as faixas de partida da Raio Local. |

- **Aceite:** script do Apêndice C sem alertas de tamanho; nenhum title/description repetido entre páginas.

### ONP-03 · Estrutura de títulos (H1/H2) · P1
- [ ] Um H1 por página, com a palavra principal da tabela ONP-01 de forma natural.
- [ ] H2 respondem a dúvidas reais ("Quanto custa", "Quanto tempo leva", "O que está incluso", "Como funciona").
- [ ] **Home:** H1 sugerido: `Criação de sites em João Pessoa que geram orçamentos`; o texto complementar vai no subtítulo (ver COP-02).

### ONP-04 · Revisão do artigo "Quanto custa um site em João Pessoa?" · P0
Esta é a sua página com maior potencial comercial.
- [ ] Remover `git` solto (TEC-10).
- [ ] **Trocar a tabela de preços** por faixas coerentes e sem sobreposição. As linhas "R$ 1.500 a R$ 7.000" e "pode ultrapassar R$ 5.000" se contradizem.
- [ ] **Adicionar as faixas de partida da Raio Local** com `{{PREENCHER: preço a partir de, por tipo de projeto}}`. O aviso atual ("não constitui tabela de preços da Raio Local") faz o leitor sair do funil exatamente quando quer saber seu preço.
- [ ] Manter o aviso de transparência (os valores de mercado são referência), mas separar claramente **"Faixas de mercado"** e **"Como a Raio Local trabalha"**.
- [ ] Inserir CTA no meio do artigo (após a tabela) e no final, com mensagem de WhatsApp específica (COP-05).
- [ ] Adicionar bloco "Quanto custa **o meu** site?" com 3 perguntas rápidas que levam ao formulário (UX-03).
- [ ] Linkar para `/servicos/criacao-de-sites`, `/servicos/site-de-pagina-unica` e `/precos` (quando existir).
- **Aceite:** tabela sem faixas conflitantes; CTA visível sem rolar até o fim; sem texto estranho.

### ONP-05 · Plano de links internos · P1
Use âncoras descritivas (nunca "clique aqui").

| De | Para | Âncora sugerida |
|---|---|---|
| Todos os artigos de site/preço | `/servicos/criacao-de-sites` | "criação de sites em João Pessoa" |
| Artigos de SEO local / Google Maps | `/servicos/seo-local-google-mapas` e `/servicos/consultoria-google-perfil-da-empresa` | "otimização do Google Perfil da Empresa" |
| Artigo "Quanto custa" | `/servicos/site-de-pagina-unica` | "site de página única" |
| Artigo sobre domínio / IA | `/servicos/criacao-de-sites` | "site com domínio próprio" |
| Home (seção de cases) | `/cases/{{slug}}` (ONP-08) | nome do cliente + resultado |
| Cada página de serviço | 2 a 3 artigos relacionados + 1 case | "Leia também…" |
| Cada artigo | 2 artigos relacionados no final | título do artigo |

- **Aceite:** nenhuma página de serviço ou artigo importante tem menos de 3 links internos de entrada.

### ONP-06 · Imagens e textos alternativos · P1
- [ ] `alt` descritivo em cada imagem de conteúdo (ex.: "Página inicial do site da FikFrio Climatização, projeto da Raio Local"). `alt=""` apenas em imagens decorativas.
- [ ] Nomes de arquivo descritivos, em minúsculas, com hífen.
- [ ] Legenda nas imagens dos cases, ligando ao case completo.

### ONP-07 · Autor e confiança (E-E-A-T) · P1
- [ ] Trocar "Equipe Raio Local" por **autor real** (nome, foto, mini-bio, link para `/sobre`) nos artigos: `{{PREENCHER: nome do autor}}`.
- [ ] Incluir `author` no JSON-LD de `Article`.
- [ ] Citar fontes quando houver dados externos ("dados brasileiros", estatísticas) com link.

### ONP-08 · Novas páginas a criar · P0/P1
Cada uma com título, description, H1, canonical, breadcrumbs, links internos e CTA próprios.

1. **`/sobre`** (P1): quem é você, foto, trajetória, método, números reais, 2 ou 3 cases em destaque, CTA. Fundamental para confiança.
2. **`/precos`** (P0): pacotes e valores de partida (COP-04).
3. **`/cases/` e uma página por case** (P1): `fikfrio`, `bf-games`, `frigomaster`, `varal-de-axe`. Estrutura no COP-07.
4. **`/servicos/landing-pages`** (P1): hoje o serviço só tem um card que aponta para a página de sites. Criar página própria (para quem roda anúncios, lançamentos e ofertas).
5. **`/contato`** (P1): formulário curto, WhatsApp, e-mail e endereço (se decidir exibir).
6. **`/politica-de-privacidade`** (P1): obrigatória assim que houver formulário coletando dados (LGPD).
7. **Páginas por segmento** (P0/P1), `/sites-para/{{segmento}}`:
   - Com case real hoje: **climatização/ar-condicionado** (FikFrio), **eletrônicos e assistência técnica / games** (BF Games).
   - Expansão de maior valor (sem case ainda): **clínicas e consultórios**, **advocacia e contabilidade**. Use um **site-modelo demonstrativo identificado como tal**, sem inventar cliente nem resultado.
   - Cada página deve ter **conteúdo único** (mín. ~600 a 800 palavras), não só trocar o nome do segmento, para não virar página "porta de entrada" duplicada.
   - **Estrutura:**
     1. H1: `Criação de sites para {{segmento}} em João Pessoa`
     2. O problema do segmento (como o cliente procura e decide)
     3. O que o site precisa ter (serviços, regiões atendidas, fotos, perguntas frequentes, WhatsApp)
     4. Como o site se conecta ao Google Maps
     5. Case ou site-modelo
     6. Preço de partida e prazo
     7. FAQ com objeções do segmento
     8. CTA

### ONP-09 · Breadcrumbs · P2
- [ ] Breadcrumb visível (`Início / Blog / Título`) com marcação `BreadcrumbList`. As páginas do blog já têm trilha visual; replicar nas páginas de serviço.

---

## 4. Arquitetura de conteúdo e blog

### CNT-01 · Consolidar artigos que repetem o mesmo assunto · P1
Hoje 4 artigos disputam o tema "por que ter um site" e quase nenhum recebe tráfego de busca.

| Ação | URL |
|---|---|
| **Criar/manter como artigo principal (evergreen, sem ano no endereço)** | `/blog/por-que-ter-um-site-para-negocio-local/` |
| Absorve e redireciona (301) | `/blog/importancia-site-negocios-locais-2026/` |
| Absorve e redireciona (301) | `/blog/como-site-ajuda-negocio-2027/` |
| Absorve e redireciona (301) | `/blog/site-alem-das-redes-sociais/` *(mantenha separado só se tiver um ângulo realmente distinto)* |
| Manter, com foco em IA | `/blog/site-encontrado-google-ia-generativa/` |
| Avaliar fusão | `/blog/google-maps-destacar-empresa/` → `/blog/seo-local-por-onde-comecar/` (o segundo tem mais impressões) |

- [ ] Passar o melhor conteúdo dos artigos absorvidos para o principal (sem copiar trechos repetidos).
- [ ] Atualizar o sitemap e todos os links internos para o novo endereço.
- **Decisão sua:** confirme antes de apagar qualquer artigo.

### CNT-02 · Artigo de tráfego pago · P1
- [ ] `/blog/o-que-e-trafego-pago/` atrai quem não compra seu serviço. Escolher uma das opções:
  - **(a)** reescrever como "Landing page para anúncios: o que preparar antes de investir em tráfego pago", ligando à página `/servicos/landing-pages`;
  - **(b)** 301 para essa nova página;
  - **(c)** deixar `noindex` se não houver conexão com sua oferta.

### CNT-03 · Reforçar o artigo mais próximo da página 1 · P1
- [ ] `/blog/dominio-site-com-ia/` (posição média ~12,6): ampliar com checklist prático, exemplos de subdomínio vs. domínio próprio, links internos e CTA para criação de sites.

### CNT-04 · Novos artigos com intenção de compra · P1
Publicar **no máximo 1 por semana**, cada um com palavra principal própria, CTA e link para a página de serviço correspondente.

| Título sugerido | Intenção | Liga para |
|---|---|---|
| Como escolher uma agência de criação de sites: 10 perguntas antes de contratar | Comparação | `/servicos/criacao-de-sites` |
| Site institucional ou landing page: qual escolher para o seu negócio? | Decisão | `/servicos/site-de-pagina-unica` |
| Quanto tempo leva para um site novo aparecer no Google? | Expectativa | `/servicos/seo-local-google-mapas` |
| O domínio ficou no nome do freelancer: como recuperar o controle do seu site | Dor | `/servicos/criacao-de-sites` |
| Site para clínica em João Pessoa: o que precisa ter | Nicho | página por segmento |
| Site para empresa de ar-condicionado: páginas, fotos e perguntas que vendem | Nicho | case FikFrio |
| O que pedir na proposta de um site: checklist de entregas | Comparação | `/precos` |

- [ ] Cada artigo: 1.200+ palavras úteis, autor real, data real, imagem própria, FAQ no final.

---

## 5. SEO local e autoridade (fora do site)

> Sem links e sinais locais, as páginas ficam presas nas posições 60 a 90. Isto é o que mais move os rankings no curto e médio prazo.

### OFF-01 · Perfil da Empresa da própria Raio Local · P0
- [ ] Criar/verificar o perfil, com a categoria principal mais próxima (confira a lista oficial no painel; ex.: web designer / agência de marketing digital).
- [ ] Decidir sobre o endereço: se atende de casa, configurar como **negócio de área de atendimento** (sem endereço visível).
- [ ] Preencher serviços, descrição, horários, WhatsApp, link do site (página `/`), fotos reais (equipe, trabalhos) e posts mensais.
- [ ] Pedir avaliações reais a clientes atuais, com o link direto de avaliação.

### OFF-02 · Dados consistentes (NAP) · P1
- [ ] Mesmo nome, telefone e endereço/área no site, Perfil da Empresa, Instagram, Facebook, LinkedIn, Bing Places e Apple Business Connect.
- [ ] Cadastrar em diretórios brasileiros confiáveis (ex.: Apontador, Telelistas, CNAE/guias locais).

### OFF-03 · Links dos sites dos clientes · P0
- [ ] No rodapé de cada site entregue (FikFrio, BF Games, FrigoMaster, Varal de Axé e os próximos): `Site por <a href="https://www.raiolocal.com/">Raio Local</a>`.
- Use âncora **de marca** ("Raio Local"), não a palavra-chave repetida, para parecer natural.
- [ ] Pedir ao cliente para citar a parceria no Perfil da Empresa/Instagram dele.

### OFF-04 · Presença local e menções · P2
- [ ] Parcerias e conteúdo com associações empresariais e entidades locais (CDL, Sebrae PB, grupos de empreendedores), podcasts e eventos de João Pessoa.
- [ ] Participação como fonte em matérias locais sobre presença digital.
- [ ] Perfis completos no LinkedIn, Instagram e Facebook, todos com link para a home.

---

## 6. Copywriting

> **Objetivo:** falar com o empreendedor que **já sabe** que precisa de um site e está escolhendo quem faz. A página precisa responder: *quem é, quanto custa, quanto tempo leva, o que recebo e que prova existe.*

### COP-01 · Posicionamento único · P0
- [ ] Escolher **uma** oferta principal para a home: **criação de sites que geram orçamentos pelo WhatsApp e aparecem no Google Maps**, para negócios locais.
- [ ] Hierarquia dos serviços:
  - **Principal:** Criação de sites (inclui SEO on-page e WhatsApp)
  - **Complementar:** SEO local e Perfil da Empresa (unificar em "Aparecer no Google Maps")
  - **Para campanhas:** Landing pages (página própria, ONP-08)
  - **Secundário:** Consultoria em usabilidade (ver COP-06)
- [ ] Frase de posicionamento (ajuste com suas palavras):
  > *"A Raio Local cria sites para negócios de João Pessoa que querem ser encontrados no Google e receber pedidos de orçamento no WhatsApp."*

### COP-02 · Reescrever a home (blueprint) · P0
Estrutura sugerida, na ordem. Os textos são rascunhos; tudo que for fato deve ser confirmado.

1. **Hero**
   - Eyebrow: `Agência digital em João Pessoa, PB, atendendo todo o Brasil`
   - **H1:** `Criação de sites em João Pessoa que geram orçamentos`
   - Subtítulo: `Sites rápidos, claros e preparados para o Google, com WhatsApp em cada etapa da página. Entrega em 2 a 4 semanas, a partir de R$ {{PREENCHER: preço}}.`
   - CTA primário: `Pedir orçamento` (WhatsApp). CTA secundário: `Ver preços e cases` (`/precos`).
   - Linha de confiança (só o que for verdade): `Domínio no seu nome · Você edita o conteúdo · Proposta com preço fechado` {{CONFIRMAR}}
2. **Barra de prova** (somente números reais): `{{N}} sites entregues · {{N}} cidades atendidas · prazo médio de 2 a 4 semanas`
3. **O problema, em 3 frases**
   `Você já sabe que precisa de um site. O difícil é saber quem entrega no prazo, o que está incluso e se o site vai de fato trazer clientes. É isso que resolvemos.`
4. **Serviços** (reduzir de 5 para 3 cards): Criação de sites · Aparecer no Google Maps · Landing pages para anúncios. Consultoria em usabilidade sai da home (COP-06).
5. **Cases com resultado** (COP-07), cada um linkando para sua página.
6. **Como funciona** (manter as 4 etapas, mais curtas, com prazo em cada uma).
7. **Preços de partida** (versão resumida da página `/precos`, COP-04).
8. **FAQ** (COP-09).
9. **CTA final:** `Conte o que sua empresa faz e receba uma proposta com preço fechado.` (só prometa "no mesmo dia" se for verdade.)

### COP-03 · Remover ou trocar afirmações sem prova · P0
| Hoje | Problema | Fazer |
|---|---|---|
| Mock "Seu Negócio Aqui, 5,0 (127 avaliações)" | Nota e avaliações que não existem. Mesmo identificado como simulação, enfraquece a credibilidade | Trocar por **captura real** de um cliente (com autorização) ou ilustração sem nota/avaliações |
| "Referência em criação de sites…" (rodapé) | Sem comprovação | Remover |
| "Projetos que geram resultados reais" | Nenhum número | Trocar por `Sites no ar e o que mudou para cada cliente` + números reais |
| "alta velocidade", "Performance nota alta no PageSpeed", "Core Web Vitals ultra-rápido" | Só vale se medido | Manter **apenas se** TEC-09 confirmar; senão, tirar |
| "Especialistas em criação de sites em João Pessoa da Capital ao Sertão" | Longa, repetitiva e vaga | `Atendemos de João Pessoa a Patos e todo o Brasil, de forma 100% remota.` |
| "sob medida", "sem surpresas", "presença digital" (repetidos) | Clichês que qualquer agência usa | Substituir por o que **de fato** está incluso, em linguagem direta |

### COP-04 · Preços e pacotes (página `/precos` + resumo na home) · P0
- [ ] Tabela com 3 pacotes, cada um com: para quem é, o que inclui, prazo, preço **a partir de**, o que **não** inclui.
  | | Página única | Site institucional | Landing page para anúncios |
  |---|---|---|---|
  | Para quem | `{{PREENCHER}}` | `{{PREENCHER}}` | `{{PREENCHER}}` |
  | Inclui | `{{PREENCHER}}` | `{{PREENCHER}}` | `{{PREENCHER}}` |
  | Prazo | `{{PREENCHER}}` | 2 a 4 semanas | `{{PREENCHER}}` |
  | A partir de | `R$ {{PREENCHER}}` | `R$ {{PREENCHER}}` | `R$ {{PREENCHER}}` |
- [ ] Bloco "Custos depois da publicação": domínio, hospedagem, manutenção, renovação. Diga claramente o que está incluído no primeiro ano. Isso ecoa o próprio artigo "Quanto custa", e quem lê precisa ver que você pratica o que ensina.
- [ ] Deixar explícito: domínio no nome do cliente, acessos entregues no final.
- [ ] CTA: `Pedir proposta com preço fechado`.

### COP-05 · Sistema de CTAs e mensagens de WhatsApp · P1
- [ ] **CTA principal único** em todo o site: `Pedir orçamento`. Secundário: `Ver preços`, `Ver cases`. Evitar mistura de rótulos ("Falar com especialista", "Solicitar orçamento", "Quero um orçamento", "Conversar…") na mesma página.
- [ ] **Mensagem de WhatsApp pré-preenchida por página**, para você saber de onde veio o contato direto na conversa (aplicar com `encodeURIComponent`):

| Página | Mensagem |
|---|---|
| Home | `Olá! Vi o site da Raio Local e quero um orçamento de site para minha empresa.` |
| Criação de sites | `Olá! Quero um orçamento de criação de site. Vi a página de Criação de Sites.` |
| Página única | `Olá! Quero um orçamento de site de página única.` |
| SEO local / Perfil | `Olá! Quero melhorar o Google Maps da minha empresa. Vi a página de SEO Local.` |
| Artigo "Quanto custa" | `Olá! Li o guia "Quanto custa um site" e quero uma proposta com preço fechado.` |
| Outros artigos | `Olá! Li o artigo "{{TÍTULO}}" e quero conversar sobre meu site.` |
| Case | `Olá! Vi o case {{CLIENTE}} e quero algo parecido para minha empresa.` |

### COP-06 · Reduzir dispersão da oferta · P1
- [ ] "Consultoria em Usabilidade" para sites, aplicativos e softwares é outro público e dilui a mensagem. Opções (decisão sua): **(a)** manter só no menu e rodapé, fora da home; **(b)** consolidar como "Auditoria do seu site" dentro de SEO/Criação de sites.
- [ ] Reduzir o dropdown "Serviços" para o essencial e dar destaque a "Criar site".

### COP-07 · Modelo de case (home + página própria) · P1
Hoje os cases mostram só print e uma linha. Cada um deve virar uma página `/cases/{{slug}}` com:
1. **Cliente** (nome, segmento, cidade)
2. **Situação antes** (o que existia, o problema)
3. **O que foi feito** (páginas, recursos, SEO, Google Maps)
4. **Resultado** com números reais: `{{PREENCHER: ex. contatos por mês, posições, tempo de resposta, vendas}}`. Se não houver número ainda, dizer o que mudou de forma verificável (ex.: "passou a aparecer no Maps para X").
5. **Depoimento** do cliente (com nome e autorização) {{PREENCHER}}
6. **Link para o site** e CTA `Quero um resultado parecido`
- [ ] Corrigir o card do **FrigoMaster**: não tem link, enquanto os outros têm.
- [ ] Mostrar na home o resultado em uma linha por case, não só o segmento.

### COP-08 · Página `/servicos/criacao-de-sites` (blueprint) · P0
Hoje é a mais fraca: promessas genéricas, sem preço, sem prova, sem objeções. Estrutura:
1. **H1:** `Criação de sites para empresas em João Pessoa`. Subtítulo com benefício + prazo.
2. **Para quem é** (e para quem não é)
3. **O que está incluso**, lista concreta e **igual à home** (domínio, hospedagem, SSL, treinamento, WhatsApp, SEO on-page… só o que for verdade)
4. **Quanto custa e quanto tempo leva** (preço a partir de + prazo)
5. **Como funciona** (etapas com prazo)
6. **Exemplos** (2 cases com link)
7. **O que preciso enviar** (logo, textos, fotos, acessos) e quantas rodadas de ajuste
8. **FAQ de objeções** (COP-09)
9. **CTA**

### COP-09 · FAQ voltado a objeções de compra · P1
Adicionar (com respostas reais) às FAQs da home e da página de serviço:
- O domínio e o site ficam no meu nome?
- Preciso pagar mensalidade? O que acontece depois do primeiro ano?
- Eu consigo editar o site sozinho? Como é o treinamento?
- Vocês escrevem os textos e tratam as fotos?
- Quantas revisões estão incluídas?
- Como é o pagamento (entrada/parcelas)?
- O que acontece se eu quiser trocar de fornecedor?
- Vocês garantem a primeira posição no Google? *(Resposta honesta: não; explique o que é possível, no mesmo espírito do seu artigo.)*

### COP-10 · Tom de voz · P2
- Frases curtas, voz ativa, benefício antes de característica.
- Dizer **o que a pessoa recebe** e **em quanto tempo**, em vez de adjetivos.
- "João Pessoa" aparece onde faz sentido (título, H1, um ou dois H2, texto natural), nunca forçado.
- Revisar acentuação e pontuação em todo o site. Padronizar `Perfil da Empresa` (antigo Google Meu Negócio).

---

## 7. UX e conversão (front-end)

### UX-01 · Botão de contato sempre acessível · P1
- [ ] Botão flutuante de WhatsApp no celular e CTA fixo no cabeçalho no desktop (ver Apêndice B.3). `aria-label` descritivo, área de toque de pelo menos 44×44 px, não cobrir conteúdo importante.

### UX-02 · Navegação · P1
- [ ] Rótulos diretos: **Criar site** · **Preços** · **Cases** · **Blog** · **Sobre** · **Orçamento**. O item "Crie seu site" já é o que as pessoas mais clicam; preserve o tom direto.
- [ ] Dropdown "Serviços" só com 3 itens principais (COP-06).

### UX-03 · Formulário curto como alternativa ao WhatsApp · P1
- [ ] Muitos visitantes chegam por computador e querem comparar antes de chamar. Criar formulário (Apêndice B.4) com 4 a 5 campos: nome, WhatsApp, tipo de negócio, site atual (opcional), o que precisa.
- [ ] Onde colocar: `/contato`, página `/precos`, final do artigo "Quanto custa" e home.
- [ ] Mensagem de sucesso clara, anti-spam (honeypot) e link para a política de privacidade.
- [ ] Backend conforme a hospedagem (Formspree, Netlify Forms, Cloudflare Worker, e-mail). Informe qual será usado: `{{PREENCHER}}`.

### UX-04 · Rodapé · P1
- [ ] Incluir links reais para `/sobre`, `/contato`, `/precos`, `/politica-de-privacidade`, serviços e blog. Corrigir os links `#servicos` (TEC-06).
- [ ] Manter dados de contato consistentes com o Perfil da Empresa (OFF-02).

### UX-05 · Acessibilidade e leitura · P2
- [ ] Contraste suficiente nos dois temas (claro/escuro), foco visível em links e botões, `aria-label` em links só com ícone (Instagram), ordem lógica de títulos.
- [ ] Tamanho de texto confortável no celular, parágrafos curtos, listas.

### UX-06 · Cards de case · P2
- [ ] Todos os cards clicáveis do mesmo jeito (imagem + título + "ver case"), levando à página interna do case e não direto ao site do cliente.

### UX-07 · Isca digital (opcional) · P2
- [ ] "Checklist: 12 itens que seu site precisa ter para gerar orçamentos" (PDF) em troca do WhatsApp ou e-mail. Útil para quem ainda está comparando.

---

## 8. Aquisição de curto prazo (enquanto o SEO amadurece)

> SEO em site novo leva meses. Para gerar conversas agora, use canais diretos, sempre apontando para a página com o CTA certo.

- **ACQ-01 · Instagram (@raio.local):** publicar os cases com antes/depois e o resultado, com link na bio para `/precos` ou `/cases`.
- **ACQ-02 · Abordagem direta:** lista de 30 negócios locais com site fraco ou sem site (Maps, Instagram). Mensagem curta com diagnóstico gratuito de 1 problema real do site/perfil deles.
- **ACQ-03 · Indicação dos clientes atuais:** pedir 1 indicação e 1 avaliação por cliente.
- **ACQ-04 · Teste pequeno de anúncios:** campanha de busca no Google para "criação de site para {{segmento}} João Pessoa", apontando para a página do segmento (não para a home).
- Medição dessas ações ficará para a etapa de estudo de analytics.

---

## 9. Roadmap por fases

### Fase 1 · Limpeza (semana 1) · `P0`
- [ ] TEC-01, TEC-02, TEC-03, TEC-04, TEC-05, TEC-06
- [ ] TEC-10 (remover `git`, ano do rodapé, H1), TEC-07 (sitemap/robots)
- [ ] ONP-02 (titles/descriptions), COP-03 (remover afirmações sem prova)
- [ ] **Manual:** reenviar sitemap no Search Console e solicitar indexação de `/`, serviços e artigo "Quanto custa"

### Fase 2 · Conversão (semanas 2 e 3)
- [ ] COP-01, COP-02 (home), COP-04 (`/precos`), COP-05, COP-08, COP-09
- [ ] ONP-04 (artigo "Quanto custa"), UX-01, UX-02, UX-03, UX-04
- [ ] ONP-08: `/sobre`, `/contato`, `/politica-de-privacidade`
- [ ] TEC-08 (schema), TEC-09 (performance), TEC-11 (404)

### Fase 3 · Prova e nichos (semanas 4 a 6)
- [ ] COP-07 + `/cases/*`, `/servicos/landing-pages`
- [ ] 2 páginas de segmento (climatização, eletrônicos/games) com conteúdo único
- [ ] CNT-01, CNT-02, CNT-03, ONP-05 (links internos), ONP-06, ONP-07
- [ ] OFF-01, OFF-02, OFF-03 (links dos sites dos clientes)

### Fase 4 · Escala (semanas 7 a 12)
- [ ] CNT-04: 1 artigo por semana com intenção de compra
- [ ] 1 ou 2 páginas de segmento adicionais (ex.: clínicas) com site-modelo
- [ ] OFF-04, ACQ-01 a ACQ-04, UX-05, UX-06, UX-07, TEC-12 a TEC-14

### Checklist de validação final
- [ ] `curl` confirma: `/`, `/index`, `*.html`, `/blog/blog` com `301`; `http://raiolocal.com` com apenas 1 redirecionamento
- [ ] Script do Apêndice C sem alertas
- [ ] Teste de Resultados Ricos sem erros
- [ ] PageSpeed Insights (mobile) conferido nas 3 páginas-chave
- [ ] Todos os `{{PREENCHER}}` resolvidos: `grep -rn "{{PREENCHER" .`
- [ ] Search Console: sitemap reenviado, URLs inspecionadas, cobertura sem duplicatas
- [ ] Acompanhar no Search Console nas semanas seguintes: impressões e posição das páginas limpas, novas consultas de nicho, queda das URLs `.html`

---

## Apêndice A · Redirecionamentos por hospedagem

> Use **apenas** o bloco da hospedagem real do site. Teste depois com `curl -sI`.

### A.1 Netlify / Cloudflare Pages (`_redirects` na raiz)
```
/                                          /        301
/index                                           /        301
/                                      /        301
/blog/blog                                       /blog/   301
/servicos/criacao-de-sites.html                  /servicos/criacao-de-sites                    301
/servicos/seo-local-google-mapas.html            /servicos/seo-local-google-mapas              301
/servicos/consultoria-google-perfil-da-empresa.html  /servicos/consultoria-google-perfil-da-empresa  301
/servicos/consultoria-em-usabilidade.html        /servicos/consultoria-em-usabilidade          301
/servicos/site-de-pagina-unica.html              /servicos/site-de-pagina-unica                301

# Consolidação de artigos (CNT-01), confirme antes de ativar
/blog/importancia-site-negocios-locais-2026/     /blog/por-que-ter-um-site-para-negocio-local/ 301
/blog/como-site-ajuda-negocio-2027/              /blog/por-que-ter-um-site-para-negocio-local/ 301
```
Redirecionamento apex → `www`: configurar no painel de domínio/DNS do provedor, em um único salto.

### A.2 Vercel (`vercel.json`)
```json
{
  "cleanUrls": true,
  "redirects": [
    { "source": "/", "destination": "/", "permanent": true },
    { "source": "/index", "destination": "/", "permanent": true },
    { "source": "/blog/blog", "destination": "/blog/", "permanent": true },
    { "source": "/blog/importancia-site-negocios-locais-2026/", "destination": "/blog/por-que-ter-um-site-para-negocio-local/", "permanent": true },
    { "source": "/blog/como-site-ajuda-negocio-2027/", "destination": "/blog/por-que-ter-um-site-para-negocio-local/", "permanent": true }
  ]
}
```
`cleanUrls: true` já redireciona `/pagina.html` para `/pagina`. Apex → `www` é configurado em Domains no painel.

### A.3 Apache / cPanel (`.htaccess` na raiz)
```apache
RewriteEngine On

# 1) http e apex → https://www (um único salto)
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} !^www\. [NC]
RewriteRule ^ https://www.raiolocal.com%{REQUEST_URI} [L,R=301]

# 2) home duplicada
RewriteRule ^(inicio|index)/?$ / [L,R=301]
RewriteRule ^index\.html$ / [L,R=301]

# 3) /blog/blog → /blog/
RewriteRule ^blog/blog/?$ /blog/ [L,R=301]

# 4) .html → URL limpa (301)
RewriteCond %{THE_REQUEST} \s/+(.+?)\.html[\s?] [NC]
RewriteRule ^ /%1 [R=301,L]

# 5) servir a URL limpa a partir do arquivo .html
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+?)/?$ $1.html [L]
```

### A.4 Nginx
```nginx
server {
  listen 80;
  server_name raiolocal.com www.raiolocal.com;
  return 301 https://www.raiolocal.com$request_uri;
}
server {
  listen 443 ssl;
  server_name raiolocal.com;
  # ssl_certificate ...
  return 301 https://www.raiolocal.com$request_uri;
}
server {
  listen 443 ssl;
  server_name www.raiolocal.com;
  # ssl_certificate ...
  location = /    { return 301 /; }
  location = /index     { return 301 /; }
  location = /blog/blog { return 301 /blog/; }
  location ~ ^/(.+)\.html$ { return 301 /$1; }
  location / { try_files $uri $uri.html $uri/ =404; }
}
```

### A.5 Verificação rápida
```bash
for u in \
  http://raiolocal.com/ \
  https://raiolocal.com/ \
  https://www.raiolocal.com/ \
  https://www.raiolocal.com/index \
  https://www.raiolocal.com/blog/blog \
  https://www.raiolocal.com/servicos/criacao-de-sites.html \
  https://www.raiolocal.com/servicos/seo-local-google-mapas.html ; do
  echo "== $u"
  curl -sIL -o /dev/null -w "%{http_code} -> %{url_effective} (redirecionamentos: %{num_redirects})\n" "$u"
done

# Canonical de uma página
curl -s https://www.raiolocal.com/ | grep -io '<link rel="canonical"[^>]*>'
```

---

## Apêndice B · Trechos de código

### B.1 JSON-LD da home (`ProfessionalService`)
Use o `logo` em versão **colorida/PNG** de pelo menos 112×112 px; o logo branco atual some em fundo claro. **Não adicione `aggregateRating`** sem avaliações reais.
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Raio Local",
  "url": "https://www.raiolocal.com/",
  "logo": "https://www.raiolocal.com/{{PREENCHER: logo-colorido.png}}",
  "image": "https://www.raiolocal.com/og_image.jpg",
  "description": "Criação de sites e SEO local para empresas em João Pessoa e todo o Brasil.",
  "telephone": "+55-83-98782-3761",
  "email": "raiolocalpb@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{PREENCHER: rua e número, ou remover o bloco inteiro se for negócio de área de atendimento}}",
    "addressLocality": "João Pessoa",
    "addressRegion": "PB",
    "postalCode": "{{PREENCHER}}",
    "addressCountry": "BR"
  },
  "areaServed": [
    { "@type": "City", "name": "João Pessoa" },
    { "@type": "Country", "name": "Brasil" }
  ],
  "sameAs": ["https://www.instagram.com/raio.local/"]
}
</script>
```

### B.2 JSON-LD de artigo e breadcrumb
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{TÍTULO DO ARTIGO}}",
  "description": "{{META DESCRIPTION}}",
  "image": "https://www.raiolocal.com/{{IMAGEM}}",
  "datePublished": "{{AAAA-MM-DD}}",
  "dateModified": "{{AAAA-MM-DD}}",
  "author": { "@type": "Person", "name": "{{PREENCHER: nome do autor}}", "url": "https://www.raiolocal.com/sobre" },
  "publisher": { "@type": "Organization", "name": "Raio Local", "url": "https://www.raiolocal.com/" },
  "mainEntityOfPage": "https://www.raiolocal.com/blog/{{slug}}/"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://www.raiolocal.com/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.raiolocal.com/blog/" },
    { "@type": "ListItem", "position": 3, "name": "{{TÍTULO}}" }
  ]
}
</script>
```

### B.3 Botão flutuante de WhatsApp
```html
<a class="wa-fab" href="https://wa.me/5583987823761?text={{MENSAGEM_CODIFICADA}}"
   aria-label="Pedir orçamento pelo WhatsApp" rel="noopener">
  <!-- ícone do WhatsApp (SVG inline) -->
  <span class="wa-fab__label">Pedir orçamento</span>
</a>
```
```css
.wa-fab {
  position: fixed;
  right: 16px;
  bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  z-index: 50;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  min-height: 48px;
  padding: 0 1rem;
  border-radius: 999px;
  background: #25d366;
  color: #062b14;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 6px 20px rgb(0 0 0 / .25);
}
.wa-fab:focus-visible { outline: 3px solid currentColor; outline-offset: 3px; }
@media (min-width: 900px) { .wa-fab { display: none; } } /* no desktop, usar CTA do cabeçalho */
```

### B.4 Formulário de orçamento
```html
<form class="lead-form" action="https://formspree.io/f/{{PREENCHER: ID do formulário}}" method="POST">
  <label>Seu nome
    <input type="text" name="nome" required autocomplete="name">
  </label>
  <label>WhatsApp
    <input type="tel" name="whatsapp" required autocomplete="tel" inputmode="tel">
  </label>
  <label>Tipo de negócio
    <input type="text" name="negocio" required>
  </label>
  <label>Site atual (se houver)
    <input type="url" name="site_atual" placeholder="https://">
  </label>
  <label>O que você precisa?
    <select name="interesse">
      <option>Site novo</option>
      <option>Refazer meu site</option>
      <option>Google Maps / Perfil da Empresa</option>
      <option>Landing page para anúncios</option>
    </select>
  </label>
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none">
  <button type="submit">Receber proposta</button>
  <p class="form-note">Respondo em até {{PREENCHER: prazo}}. Usamos seus dados só para o contato.
    <a href="/politica-de-privacidade">Política de privacidade</a>.</p>
</form>
```

---

## Apêndice C · Script de auditoria on-page (HTML local)

Salve como `scripts/seo_audit.py` e rode `python scripts/seo_audit.py .`. É uma checagem **heurística** (title, description, canonical, H1 e `alt`). Complemente com o Search Console e o PageSpeed.

```python
#!/usr/bin/env python3
"""Auditoria rápida de SEO on-page em arquivos HTML locais."""
import re
import sys
import pathlib

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".")
IGNORE = {"node_modules", ".git", "dist", "build"}


def first(pattern, text):
    m = re.search(pattern, text, re.I | re.S)
    return m.group(1).strip() if m else ""


titles, descs = {}, {}
for f in sorted(root.rglob("*.html")):
    if IGNORE & set(f.parts):
        continue
    h = f.read_text(encoding="utf-8", errors="ignore")
    title = first(r"<title>(.*?)</title>", h)
    desc = first(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', h)
    canon = first(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']', h)
    h1 = len(re.findall(r"<h1[\s>]", h, re.I))
    no_alt = len(re.findall(r"<img(?![^>]*\balt=)[^>]*>", h, re.I))
    flags = []
    if not title or len(title) > 62:
        flags.append(f"title({len(title)})")
    if not desc or not 70 <= len(desc) <= 160:
        flags.append(f"description({len(desc)})")
    if not canon:
        flags.append("sem canonical")
    elif canon.endswith((".html", "/", "/index")):
        flags.append("canonical suspeito")
    if h1 != 1:
        flags.append(f"h1={h1}")
    if no_alt:
        flags.append(f"{no_alt} img sem alt")
    if re.search(r"\bgit\b\s*<", h):
        flags.append("texto 'git' solto?")
    titles.setdefault(title, []).append(str(f))
    descs.setdefault(desc, []).append(str(f))
    print(f"{f}: {' | '.join(flags) or 'ok'}")

for label, d in (("TITLE repetido", titles), ("DESCRIPTION repetida", descs)):
    for text, files in d.items():
        if text and len(files) > 1:
            print(f"\n{label}: {text!r}\n  " + "\n  ".join(files))
```

---

## Apêndice D · Prompts prontos para o agente

> Cole um por vez. Peça sempre para o agente **mostrar o plano antes de editar**.

**Fase 1: limpeza técnica**
```
Leia PLANO-MELHORIAS-raiolocal.md (seções 0 a 3 e Apêndices A e C).
1) Descubra a stack e a hospedagem do projeto e me diga qual formato de redirecionamento usará.
2) Execute SOMENTE: TEC-01, TEC-02, TEC-03, TEC-04, TEC-05 (se for no código), TEC-06, TEC-07 e TEC-10.
3) Aplique os titles e descriptions da tabela ONP-02 e remova as afirmações sem prova listadas em COP-03.
Regras: não invente dados (use {{PREENCHER: ...}}), não toque em analytics, não apague páginas sem 301.
Ao final, liste: arquivos alterados, como testar (comandos curl do Apêndice A.5) e o que depende de mim.
```

**Fase 2: home, preços e conversão**
```
Leia PLANO-MELHORIAS-raiolocal.md (seções 3 a 7). Mostre primeiro um plano curto.
Execute: COP-01, COP-02, COP-04, COP-05, COP-08, COP-09, ONP-04, UX-01 a UX-04 e as páginas /sobre, /contato, /politica-de-privacidade e /precos (ONP-08).
Mantenha o design atual. Todo fato desconhecido (preço, número de clientes, nome do autor, prazo) vira {{PREENCHER: ...}} e deve ser listado no final.
```

**Fase 3: prova, nichos e conteúdo**
```
Leia PLANO-MELHORIAS-raiolocal.md (seções 3, 4 e 5).
Crie as páginas de case (COP-07) e a página /servicos/landing-pages. Crie 2 páginas de segmento (climatização e eletrônicos/games) com conteúdo ÚNICO cada, seguindo o modelo de ONP-08.
Execute CNT-01 a CNT-03 com redirecionamento 301 (me peça confirmação antes de apagar qualquer artigo), ONP-05 (links internos), ONP-06 e ONP-07.
```

**Validação final**
```
Rode scripts/seo_audit.py e os comandos do Apêndice A.5. Procure por {{PREENCHER no projeto e me entregue a lista consolidada do que falta preencher, agrupada por página.
```
