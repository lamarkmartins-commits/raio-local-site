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
