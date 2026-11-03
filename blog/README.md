# Publicação no blog

O site publica HTML estático. A versão 1.1.1 gera o índice `blog/index.html`, o sitemap e o artigo piloto `blog/o-que-e-trafego-pago/index.html` com `npm run build`. Os demais artigos continuam com edição direta.

## Editar o piloto

1. Edite `content/o-que-e-trafego-pago.html` para alterar o corpo, imagens, legendas, assinatura e chamada final. O conteúdo é HTML e usa o CSS atual.
2. Edite `content/o-que-e-trafego-pago.json` para título SEO, descrições, dados estruturados e `dateModified`. A etiqueta “Última atualização” é gerada a partir dessa data.
3. Edite `templates/article.html` para a estrutura comum do artigo. O cabeçalho e o rodapé estão em `templates/partials/`.
4. Execute `npm run build` e depois `npm run check`. Publique também as saídas geradas.

Execute `npm run audit` antes de publicar para conferir links e recursos locais, canonical, sitemap, JSON-LD e sinais básicos de indexação.

## Listagem e novos artigos

`content/posts.json` contém os artigos publicados, com `slug`, `title`, `summary`, `category`, `datePublished`, `order` e `published`. O gerador ordena por data decrescente; `order` desempata artigos do mesmo dia. O primeiro é o destaque. `featureArt` é opcional e configura a arte do destaque. O gerador exige que cada artigo marcado como publicado tenha `blog/<slug>/index.html`.

Ao criar um artigo novo, faça primeiro a página em `blog/<slug>/index.html` seguindo o padrão existente. Depois registre o post em `content/posts.json`, execute `npm run build` e confira o índice, sitemap, links, canonical, Open Graph e dados estruturados. A migração dos demais artigos para template é gradual; até lá, cada HTML continua sendo sua fonte editorial.

`content/site-pages.json` contém as URLs institucionais usadas no sitemap. Edite esse arquivo quando uma página institucional for criada ou removida.

## Endereço do índice

O índice está em `blog/index.html` e seu endereço público é `/blog/`. O `.htaccess` redireciona permanentemente `/blog/blog` e `/blog/blog.html` para `/blog/`; o arquivo `blog/blog.html` oferece um fallback de navegação. Após o deploy, confirme o código 301 e a resposta 200 de `/blog/` no domínio.
