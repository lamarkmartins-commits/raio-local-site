# Publicação no blog

O blog é estático e usa `../styles.css`, `../theme.css` e `../assets/css/blog.css`. O índice está em `blog/index.html`; cada artigo fica em `blog/<slug>/index.html`.

Para publicar outro artigo:

1. Crie uma pasta com um slug curto e copie a estrutura de `seo-local-por-onde-comecar/index.html`.
2. Atualize título, descrição, URL canônica, Open Graph, dados estruturados, breadcrumb e conteúdo. Acrescente data de publicação apenas quando houver uma data real de publicação.
3. Adicione o artigo ao índice `blog/index.html`, com um link que leve à nova pasta. Evite cards sem artigo publicado.
4. Inclua a URL em `../sitemap.xml` e confira todos os links relativos.

O menu principal e o rodapé das páginas atuais têm HTML próprio. Ao criar novas páginas fora do blog, inclua o link para `blog/` na navegação dessas páginas também.
