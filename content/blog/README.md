# Blog članci (Markdown)

Svaki članak je jedan `.md` fajl u ovom folderu.

## Frontmatter (YAML na vrhu)

Obavezno: `title`, `date` (YYYY-MM-DD), `excerpt`.

Preporučeno: `slug` (ako ga izostavite, koristi se ime fajla), `category` ili `categories`, `image`, `thumbnail`, `author`.

## Slike

- **Hero / OG slika:** polje `image` u frontmatteru — koristite pun URL (`https://...`) ili putanju sa sajta npr. `/blog/moja-slika.webp` ako ste fajl stavili u `client/public/blog/`.
- **Thumbnail na listi bloga:** polje `thumbnail` (opciono). Ako ga ne postavite, sistem automatski uzima **prvu sliku iz sadržaja članka**, a ako ni nje nema koristi `image`.
- **Slike u tekstu:** u Markdownu `![opis](/blog/naziv.webp)`.

Nakon dodavanja fajla uradite commit i deploy (build učitava fajlove sa diska na serveru).

## Šta je migrirano

Inicijalni članci su preuzeti iz postojećeg koda i Notion seed skripti u repou (UI fallback, `add-notion-content.js`, `setup-notion.ts`). Ako ste u živom Notion-u imali dodatne objave koje nisu u repou, trebate ih ručno prenijeti u novi `.md` fajl.
