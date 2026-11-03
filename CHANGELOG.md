# Histórico de versões

## 1.1.2 — 2026-11-03

- Adiciona auditoria repetível de links e recursos locais, canonical, sitemap, JSON-LD, H1, títulos, descrições, imagens e indexação.
- Completa os metadados Open Graph da página “Crie seu site”.

## 1.1.1 — 2026-11-03

- Publica o índice do blog em `/blog/` por meio de `blog/index.html`.
- Redireciona `/blog/blog` e `/blog/blog.html` permanentemente para o novo endereço.
- Atualiza links, canonical, Open Graph, dados estruturados, sitemap e gerador.

## 1.1.0 — 2026-11-03

- Introduz geração estática sem dependências para o índice do blog, sitemap e artigo piloto `o-que-e-trafego-pago`.
- Separa os dados e o conteúdo do piloto dos templates de página, cabeçalho e rodapé.
- Centraliza a listagem dos artigos em `content/posts.json`, ordenada por data de publicação.
- Mantém as URLs públicas e o HTML visual do piloto. A URL `/blog/blog` continua até resolver o conflito de `/blog/` na hospedagem.
