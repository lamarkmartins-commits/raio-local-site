# SDD — Padrões do site Raio Local

**Status:** versão inicial, baseada no site existente  
**Escopo:** site institucional, páginas de serviços e blog estático  
**Atualizado em:** 2026-10-30

Este documento define critérios para novas páginas e alterações. Quando o estado atual do site divergir do padrão descrito, registrar a divergência no [registro de decisões](DECISOES.md) e planejar a correção; este documento não implica uma migração automática de todas as páginas.

## 1. Navegação: navbar e rodapé

- Manter os destinos e os rótulos dos links de navegação coerentes em todas as páginas institucionais, de serviço e do blog.
- Navbar desktop, menu mobile e rodapé devem oferecer acesso aos destinos principais: início, serviços, blog e seções institucionais relevantes (cases, processo e dúvidas, quando disponíveis).
- Menus de serviço devem apontar para as páginas publicadas em `servicos/`. Evitar links para páginas inexistentes ou rascunhos.
- O rodapé deve manter links para páginas de serviço, blog e canais de contato. A página atual pode ser indicada com `aria-current` na navegação.
- Como cada página é HTML próprio, conferir os três pontos de navegação ao criar página ou alterar destinos. Revisar links relativos conforme a profundidade da página.

## 2. Botão flutuante do WhatsApp

- Usar um único padrão visual e de interação em todo o projeto: link circular verde, fixo no canto inferior direito, ícone reconhecível, rótulo acessível e alvo adequado a toque.
- Manter a classe compartilhada `.wa-float` e tokens existentes (`--wa`), salvo decisão documentada em contrário. Não criar variações por página sem justificativa registrada.
- O destino deve usar `https://wa.me/5583987823761`; mensagens específicas podem ser passadas por `data-wa-msg` e codificadas pelo comportamento compartilhado em `script.js`.
- Links que abrem nova aba incluem `target="_blank"` e `rel="noopener"`. O controle precisa de nome acessível (`aria-label`) mesmo que o ícone seja decorativo.
- Preservar espaço em telas pequenas para não cobrir controles, conteúdo essencial ou avisos de consentimento.

## 3. Identidade visual, cores e logotipo

### Direção visual observada

- Marca de presença local com linguagem direta, contemporânea, acessível e orientada a negócios.
- Laranja é a cor de destaque; superfícies escuras e claras são usadas conforme o contexto e tema da página.
- Tipografia declarada no CSS global: **Familjen Grotesk** para títulos e **Archivo** para corpo, com fallbacks do sistema.

### Tokens encontrados

| Uso | Token / valor atual |
| --- | --- |
| Destaque laranja | `--accent: #FF5A1F` |
| Destaque secundário | `--accent-2: #FF7A45` |
| Texto sobre destaque | `--ink: #160B02` |
| WhatsApp | `--wa: #25D366` |
| Tema escuro — fundo/texto | `#0B0C0E` / `#F4F3EE` |
| Tema claro — fundo/texto | `#F7F5F0` / `#1C242B` |

Os valores acima são os tokens atualmente implementados em `styles.css` e `theme.css`; devem ser tratados como referência do produto digital, não como especificação oficial de impressão. Ao alterar cor, atualizar tokens e validar contraste e estados (hover, foco, desabilitado) nos dois temas.

### Arquivos de marca

- `logo-raio-local-branca.svg` — versão clara para fundos escuros.
- `logo-raio-local-preta.svg` — versão escura para fundos claros.
- `raio-local-simbolo.svg` — símbolo isolado.
- `favicon.svg` e `favicon.png` — ícones de navegador.

Usar os SVGs oficiais sem distorcer proporção, redesenhar, recolorir ou aplicar efeitos. Escolher a versão com contraste suficiente para o fundo. Imagens de logo devem ter texto alternativo apropriado; quando o link já tem `aria-label` equivalente, evitar redundância.

## 4. SEO técnico por página e fluxo

Cada página indexável nova ou alterada deve receber revisão própria:

- `<title>` específico e descritivo, `meta name="description"` exclusivo, idioma `pt-BR`, viewport e canonical absoluto para a URL pública final.
- Open Graph coerente (ao menos título, descrição, URL e imagem quando aplicável); imagem deve existir e carregar.
- Uma hierarquia clara de títulos, um H1 principal, conteúdo útil, links internos funcionais, imagens com `alt` e HTML semântico.
- Dados estruturados JSON-LD somente quando representarem o conteúdo real. Validar URLs e evitar datas, avaliações, preços ou fatos inventados.
- Manter sitemap e `robots.txt` alinhados com páginas canônicas e indexáveis. Páginas de redirecionamento/duplicadas não devem ser adicionadas como conteúdo independente.
- Conferir status/redirect, canonical, metadados e recursos relativos no endereço final de produção.

### Google Analytics 4 (GA4)

- Nas páginas reais de conteúdo, carregar uma única configuração GA4 com o ID de medição vigente da propriedade Raio Local (`G-7MY09NFVG7` no momento desta revisão). Não instalar duas tags Google na mesma página.
- Restringir o carregamento ao domínio de produção (`raiolocal.com` e `www.raiolocal.com`), para evitar enviar pageviews de localhost, prévias e ambientes de desenvolvimento à propriedade de produção.
- Não adicionar a tag a páginas técnicas de verificação, redirecionamentos legados ou documentos que não representem uma visita de conteúdo.
- Antes de inserir ou alterar a tag, procurar configurações existentes de `gtag.js`, `GTM-*`, `dataLayer` e plugins para evitar contagem duplicada. Usar GA4 diretamente ou via GTM conforme decisão registrada; não manter os dois caminhos ativos para o mesmo ID sem plano explícito de deduplicação.
- Após publicar, validar atividade no GA4 em tempo real e confirmar que a coleta funciona no domínio canônico. O aviso de stream inativo antes da publicação ou validação é esperado.
- Se o ID da propriedade mudar, atualizar as páginas afetadas, este SDD e registrar a mudança em `DECISOES.md`.

### Fluxo de publicação de artigo

Seguir também `blog/README.md`: criar pasta com slug, preencher metadados e conteúdo, adicionar ao índice `blog/blog.html`, atualizar `sitemap.xml` e conferir links relativos. Na hospedagem atual, `/blog/` tem comportamento legado/404 descrito no README; usar o endereço explícito `blog/blog.html` para o índice até que uma decisão e uma alteração de hospedagem mudem essa regra.

### Largura e responsividade dos artigos

- Manter o artigo dentro da largura do container compartilhado, sem scroll horizontal na página, especialmente em telas de 320 px a 390 px.
- Em artigos com tabelas, imagens ou outros elementos largos, garantir que a coluna de conteúdo do grid possa encolher (`min-width: 0` e, quando necessário, `minmax(0, 1fr)`). Não definir largura mínima maior que a área de leitura disponível no mobile.
- Tabelas de poucas colunas devem ocupar a largura disponível, com texto quebrável e células legíveis. Conferir o resultado em telas estreitas, em vez de depender de `overflow-x: auto` para a leitura normal.
- Imagens e figuras devem respeitar `max-width: 100%` do conteúdo, sem ampliar a página além da viewport.
- Antes de publicar um artigo, verificar no desktop e no mobile que a largura rolável do documento não ultrapassa a viewport e que o layout segue o padrão dos demais artigos.

## 5. Padrão técnico de URLs

- URL pública canônica usa HTTPS e host `www.raiolocal.com` conforme `.htaccess`.
- Preferir caminhos curtos, descritivos, em minúsculas, sem acentos, com palavras separadas por hífen e sem parâmetros desnecessários.
- Novas páginas de serviço ficam em `servicos/<slug>.html` no disco e devem ser acessíveis pela URL limpa `/servicos/<slug>`; o `.htaccess` já redireciona `.html` e resolve caminhos limpos para arquivos existentes.
- Artigos ficam em `blog/<slug>/index.html` e usam URL de diretório `/blog/<slug>/`, conforme padrão publicado.
- A página inicial tem URL pública `/inicio`; não criar canonical apontando para `/` sem rever o comportamento de redirecionamento atual.
- Atualizar links internos, canonical, sitemap, dados estruturados e compartilhamento social quando uma URL for criada ou alterada. URL já publicada não deve ser renomeada sem redirecionamento 301 e revisão de referências.
- Atenção: o endereço do índice do blog tem exceção documentada em `blog/README.md`; respeitá-la até alteração deliberada da hospedagem.

## 6. Registro e preservação de decisões

Registrar decisões duradouras em [DECISOES.md](DECISOES.md), com data, contexto, decisão, impacto/arquivos e estado. Registrar também revisões de padrões, exceções temporárias e migrações de URL.

- Uma entrada por decisão, em ordem cronológica; não apagar decisões antigas. Se uma decisão mudar, criar entrada nova que a substitua e referenciar a anterior.
- Manter este SDD, o registro, código e assets sob controle de versão Git. Commits devem descrever mudanças de forma objetiva.
- Para recuperação, consultar `git log`, comparar alterações e restaurar arquivos/commits apropriados. Git no mesmo dispositivo não substitui backup remoto ou cópia independente; manter backup do repositório e dos assets fora do ambiente de trabalho.

## 7. Tom de voz e conteúdo

- Escrever em português brasileiro, com clareza, proximidade e segurança profissional.
- Priorizar frases diretas, exemplos concretos e benefícios compreensíveis para pequenos negócios e negócios locais.
- Manter tom consultivo e humano. Explicar termos técnicos na primeira ocorrência; evitar jargão, promessas absolutas, urgência artificial e resultados garantidos.
- CTAs devem dizer qual é o próximo passo e combinar com o contexto da página. Mensagens do WhatsApp podem ser personalizadas sem mudar o tom da marca.
- Manter consistência de nomes de serviços, grafia da marca “Raio Local”, uso de maiúsculas e pontuação. Revisar texto, links e acentuação antes de publicar.

## Checklist de criação/revisão

- [ ] Navbar desktop, menu mobile e rodapé com destinos coerentes e funcionando.
- [ ] Botão flutuante WhatsApp presente, acessível e consistente.
- [ ] Logo e cores corretos para o fundo; contraste e foco revisados.
- [ ] Title, description, canonical, Open Graph e headings próprios da página.
- [ ] Dados estruturados, sitemap e robots revisados quando aplicável.
- [ ] GA4 presente uma única vez nas páginas de conteúdo, restrito ao domínio de produção e validado após publicação.
- [ ] URL segue padrão; links relativos funcionam na profundidade publicada.
- [ ] Texto segue tom de voz e fatos verificáveis.
- [ ] Artigo sem scroll horizontal em telas mobile; tabelas, imagens e coluna de conteúdo cabem na viewport.
- [ ] Decisão relevante registrada em `DECISOES.md`.
