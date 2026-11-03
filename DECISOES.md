# Registro de decisões — Raio Local

Registro cronológico de decisões que afetam padrões, conteúdo, URLs, identidade ou operação do site. Não apague entradas antigas: mudanças posteriores devem referenciá-las.

## Como registrar

Para cada decisão, preencher:

- **Data:** YYYY-MM-DD
- **Estado:** proposta, aprovada, substituída ou concluída
- **Contexto:** problema ou necessidade
- **Decisão:** escolha feita
- **Impacto:** páginas, arquivos ou processos afetados
- **Referências:** SDD, issue, commit ou decisão relacionada

## 2026-10-26 — Criar padrão SDD para o site

- **Estado:** aprovado
- **Contexto:** estabelecer consistência visual, técnica e editorial, além de preservar o histórico de mudanças.
- **Decisão:** adotar `SDD.md` como referência para navegação, botão WhatsApp, branding, SEO técnico, URLs, preservação de decisões e tom de voz. Usar este arquivo para registrar decisões futuras.
- **Impacto:** novas páginas e alterações devem seguir o checklist em `SDD.md`; o processo de publicação de artigos continua descrito em `blog/README.md`.
- **Referências:** estado existente em `styles.css`, `theme.css`, `.htaccess`, `sitemap.xml` e `blog/README.md`.
- **Observação:** cores listadas no SDD foram extraídas dos tokens implementados; aprovação como especificação oficial de marca permanece pendente.

## 2026-10-26 — Preparar artigo local sobre Google Sites

- **Estado:** concluído localmente; não publicado
- **Contexto:** criar um tutorial simples e didático sobre como montar um site com Google Sites, disponível para revisão em localhost.
- **Decisão:** criar o artigo em `blog/criar-site-no-google-sites/index.html`, com três ilustrações SVG próprias em largura total e proporção 16:9, texto alternativo e legendas. Marcar a página como `noindex, nofollow` e não inserir no índice público nem no sitemap enquanto estiver em avaliação local.
- **Impacto:** novo artigo e estilos específicos em `assets/css/artigo-google-sites.css`; imagens em `assets/img/google-sites/`. O tutorial instrui a revisar permissões e publicar apenas quando a pessoa estiver pronta.
- **Referências:** `SDD.md`; documentação oficial do Google Sites consultada em 2026-10-26: https://support.google.com/sites/answer/6372878?hl=pt-BR e https://support.google.com/sites/answer/98081?hl=pt-BR.

## 2026-10-26 — Configurar a medição GA4 no site

- **Estado:** implementado localmente; aguardando publicação e verificação no Google Analytics
- **Contexto:** o stream GA4 (ID `G-7MY09NFVG7`) informava que não recebia dados. A página inicial tinha somente snippets de exemplo com IDs fictícios dentro de comentário HTML; as demais páginas não carregavam a tag.
- **Decisão:** adicionar a configuração GA4 às 12 páginas de conteúdo HTML. O carregamento fica condicionado aos hosts `raiolocal.com` e `www.raiolocal.com`, para que testes em localhost não enviem pageviews à propriedade. Não adicionar à página de redirecionamento legado nem combinar com Google Tag Manager.
- **Impacto:** páginas locais passam a ter a tag para a próxima publicação do site. O artigo em avaliação mantém `noindex, nofollow` e segue fora do índice e sitemap.
- **Referências:** ID de medição fornecido pelo responsável da conta GA4; artigo local `blog/criar-site-no-google-sites/index.html`.
- **Verificação pendente:** após publicar, abrir o site no domínio canônico e confirmar a chegada de eventos/atividade em tempo real no GA4. Até lá, o aviso de coleta inativa é esperado.

## 2026-10-27 — Preparar artigo local sobre domínio em sites feitos com IA

- **Estado:** concluído localmente; não publicado
- **Contexto:** explicar por que o endereço usado por um site feito com IA merece atenção, com linguagem didática para pequenos negócios.
- **Decisão:** criar `blog/dominio-site-com-ia/index.html` com distinção entre domínio próprio e subdomínio de uma plataforma, recomendações de controle do endereço e verificação de HTTPS. Usar três fotografias servidas pelo Unsplash, cada uma com `alt`, legenda e crédito/link de origem.
- **Precisão editorial:** deixar claro que subdomínio não é inseguro por definição, HTTPS não atesta a legitimidade do negócio, e domínio próprio não garante tráfego ou ranking. Endereço sem TLD, como `cliente.apptal`, é apenas exemplo incompleto.
- **Impacto:** página em avaliação local, com `noindex, nofollow`, tag GA4 restrita ao domínio de produção e estilo próprio em `assets/css/artigo-dominio.css`. Não adicionar ao índice do blog nem ao sitemap antes da aprovação para publicação.
- **Referências:** `SDD.md`; [Registro.br — Sobre domínios](https://registro.br/dominio/); [Registro.br — Registro de novos domínios](https://registro.br/ajuda/registro-de-novos-dominios/); [Cloudflare — Criar registros de subdomínio](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-subdomain/); [The HTTPS-Only Standard](https://https.cio.gov/).
- **Imagens:** Unsplash CDN; páginas/coleções de origem ligadas nas legendas do artigo.

## 2026-10-27 — Incluir recomendação comercial da Hostinger no artigo de domínio

- **Estado:** concluído localmente; artigo ainda não publicado
- **Contexto:** apresentar a Hostinger como opção de domínio e hospedagem, conforme parceria comercial informada pela Raio Local.
- **Decisão:** inserir parágrafo identificado como recomendação da Raio Local, informando a parceria comercial, o uso e a confiança baseada na experiência da empresa. Incluir links oficiais para domínio e hospedagem e orientar o leitor a comparar recursos, renovação e condições.
- **Impacto:** `blog/dominio-site-com-ia/index.html`; sem inclusão no índice do blog ou sitemap.
- **Referências:** páginas oficiais da [Hostinger sobre domínios](https://www.hostinger.com/br/registro-de-dominio) e [hospedagem de sites](https://www.hostinger.com/br/hospedagem-de-sites).

## 2026-10-27 — Preparar artigo de domínio para publicação

- **Estado:** preparado no repositório; publicação no domínio ainda depende do deploy
- **Contexto:** solicitação para publicar o artigo sobre domínios em sites feitos com IA.
- **Decisão:** tornar a página indexável, definir canonical e Open Graph, incluir BlogPosting e BreadcrumbList, adicionar cartão ao índice do blog e URL ao sitemap. Corrigir texto alternativo e legenda da imagem local da Frigomaster para identificar corretamente o case.
- **Impacto:** `blog/dominio-site-com-ia/index.html`, `blog/blog.html` e `sitemap.xml`.
- **Observação:** o repositório não contém fluxo de deploy nem credenciais de hospedagem. As alterações estão prontas localmente, mas não foram enviadas ao site ao vivo.

## 2026-11-03 - Remover artigo local sobre Google Sites

- **Estado:** concluído
- **Contexto:** solicitação para retirar `criar-site-no-google-sites` do projeto.
- **Decisão:** excluir o artigo, sua folha de estilo exclusiva e as três ilustrações usadas apenas nele. Esta decisão substitui a preparação registrada em 2026-10-26.
- **Impacto:** `blog/criar-site-no-google-sites/`, `assets/css/artigo-google-sites.css` e `assets/img/google-sites/`. O artigo já não constava do índice público nem do sitemap.

## 2026-11-03 - Versionar a geração estática do blog (v1.1.0)

- **Estado:** concluída localmente; publicação depende do deploy.
- **Contexto:** cabeçalho, rodapé, metadados e cards eram mantidos manualmente em HTML. O índice podia ficar fora de ordem ou omitir uma URL do sitemap.
- **Decisão:** usar um gerador Node sem dependências. `content/posts.json` é a fonte da listagem; `content/site-pages.json` reúne URLs fora dos artigos; `content/o-que-e-trafego-pago.json` e `content/o-que-e-trafego-pago.html` são as fontes do piloto. Templates e partes de cabeçalho e rodapé ficam em `templates/`. `npm run build` atualiza os HTMLs publicados e o sitemap; `npm run check` verifica se estão sincronizados.
- **Impacto:** `blog/blog.html`, `blog/o-que-e-trafego-pago/index.html` e `sitemap.xml` passam a ser saídas geradas. Os demais artigos permanecem editados diretamente até serem migrados. URLs públicas, canonical e visual do piloto são preservados.
- **Exceção de URL:** o índice está fisicamente em `blog/blog.html`; a regra de URL limpa de `.htaccess` transforma esse nome em `/blog/blog`. O caminho `/blog/` conflita com uma instalação WordPress na hospedagem atual, conforme `blog/README.md`. Uma troca para `/blog/` exige verificar ou remover essa rota no servidor, implantar um redirecionamento 301 de `/blog/blog` e atualizar links, canonical, dados estruturados e sitemap.
- **Referências:** `SDD.md`, `blog/README.md`, `CHANGELOG.md` e `.htaccess`.

## 2026-11-03 - Adotar /blog/ como URL do índice (v1.1.1)

- **Estado:** concluída localmente; validação no domínio após deploy.
- **Contexto:** o responsável informou que a instalação WordPress associada ao caminho antigo foi removida. A exceção de hospedagem registrada na versão 1.1.0 deixou de ser necessária.
- **Decisão:** gerar o índice em `blog/index.html`, usar `https://www.raiolocal.com/blog/` como URL canônica e configurar redirecionamento 301 de `/blog/blog` e `/blog/blog.html`. Manter `blog/blog.html` como fallback de redirecionamento caso a regra Apache não seja aplicada.
- **Impacto:** links internos, canonical, Open Graph, dados estruturados e sitemap passam a apontar para `/blog/`. A decisão anterior sobre manter `/blog/blog` fica substituída.
- **Referências:** informação do responsável, `.htaccess`, `scripts/build-blog.mjs`, `blog/README.md` e `CHANGELOG.md`.
