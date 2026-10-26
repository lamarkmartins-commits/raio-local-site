# Publicação no blog

O blog é estático e usa `../styles.css`, `../theme.css` e `../assets/css/blog.css`. O índice está em `blog/blog.html`; cada artigo fica em `blog/<slug>/index.html`. O arquivo `blog/index.html` encaminha os visitantes do endereço antigo para a página atual.

Para publicar outro artigo:

1. Crie uma pasta com um slug curto e copie a estrutura de `seo-local-por-onde-comecar/index.html`.
2. Atualize título, descrição, URL canônica, Open Graph, dados estruturados, breadcrumb e conteúdo. Acrescente data de publicação apenas quando houver uma data real de publicação.
3. Adicione o artigo ao índice `blog/blog.html`, com um link que leve à nova pasta. Evite cards sem artigo publicado.
4. Inclua a URL em `../sitemap.xml` e confira todos os links relativos.

O menu principal e o rodapé das páginas atuais têm HTML próprio. Ao criar novas páginas fora do blog, inclua o link para `blog/blog.html` na navegação dessas páginas também.

Na hospedagem atual, `/blog/` é atendido por uma instalação WordPress e retorna 404. Por isso, use sempre o caminho explícito `blog/blog.html` nos links para a página inicial do blog e na URL canônica e no sitemap. Os links para os artigos podem continuar usando suas pastas, que respondem normalmente.
