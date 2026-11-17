# Guida al blog: come aggiungere e modificare i post

Questa guida serve a chi scrive i post (l'autore o Claude). Il blog non richiede di toccare il codice: ogni post è una cartella con uno o due file Markdown.

## Come funziona

- Pagina elenco `/blog`: una riga per post con il **titolo** e l'**inizio del testo** (tagliato con "…"). Si ordina dal più recente.
- Pagina del post `/blog/<nome-cartella>`: titolo, data e testo. È sempre lo stesso componente (`src/app/blog/blog-post.ts`): non si crea mai una pagina Angular per un nuovo post.
- Il testo viene da `public/blog/<nome-cartella>/<lingua>.md`. L'elenco viene da `public/blog/index.json`, che **non si scrive a mano**: lo genera `scripts/blog-index.mjs` leggendo l'inizio di ogni file. Parte da solo con `npm start` e `npm run build`, ed è ignorato da git.
- Il modello da copiare è `public/blog/post-template/`.

## Aggiungere un post

1. Copia la cartella `public/blog/post-template/` e dai alla copia il nome del post. Il nome finisce nell'indirizzo: minuscolo, parole separate da trattini, niente accenti (esempio `primo-devlog`).
2. Modifica `it.md` e, se vuoi la versione inglese, `en.md` (vedi sotto per le lingue).
3. Metti le immagini nella stessa cartella e scrivile nel testo con il solo nome del file.
4. Cancella le immagini del modello (`immagine-1.svg`, `immagine-2.svg`) se non le usi.
5. Prova in locale con `npm start` e apri `/blog`.
6. Commit e push, solo quando lo decide l'autore (il push pubblica il sito).

## Il file `.md`

Ogni file inizia con un'intestazione tra due righe `---`, poi il testo:

```
---
title: Titolo del post
date: 2026-11-17
---
In questo post parleremo di... (prima frase: finisce nell'anteprima dell'elenco)
```

- `title`: obbligatorio.
- `date`: obbligatoria, formato `AAAA-MM-GG`. Deve essere uguale in `it.md` e `en.md`. Decide l'ordine nell'elenco.
- Scrivi il primo paragrafo pensando che sarà l'anteprima: l'elenco mostra le prime due righe del testo, senza titoli, immagini e link, tagliate con i puntini.
- Se manca il titolo, la data o l'intestazione, `npm run blog` si ferma con un messaggio che dice quale file correggere.

## Scrivere il testo (Markdown)

| Per ottenere | Si scrive |
|---|---|
| Titolo di sezione | `## Titolo` |
| Grassetto, corsivo | `**grassetto**`, `*corsivo*` |
| Link | `[testo](https://...)` |
| Elenco puntato | una riga per voce, con `- ` davanti |
| Immagine | `![didascalia](file.png)` su una riga da sola |

Non si scrive HTML. Il `#` (titolo grande) non serve: il titolo del post viene dall'intestazione.

## Immagini e didascalie

L'immagine va su una riga da sola. Il testo tra parentesi quadre è la **didascalia** (e il testo alternativo per chi non vede l'immagine). Se è vuoto non c'è didascalia, ma meglio scriverlo sempre. Il titolo tra virgolette dopo il nome del file sceglie la posizione:

| Si scrive | Risultato |
|---|---|
| `![Didascalia](foto.png "right")` | a destra, con il testo che scorre attorno |
| `![Didascalia](foto.png "left")` | a sinistra, con il testo che scorre attorno |
| `![Didascalia](foto.png)` | a tutta larghezza del testo |

Su telefono le immagini a destra e a sinistra diventano a tutta larghezza. Il nome del file è relativo alla cartella del post; un indirizzo che inizia con `https://` si usa così com'è. Preferisci PNG o JPG leggeri (sotto circa 500 KB) o SVG.

## Lingue

- `it.md` e `en.md`: un file per lingua. Il sito mostra quello della lingua attiva.
- Se esiste un solo file, il post compare in quella lingua anche a chi usa l'altra.
- Convenzione: l'autore scrive in italiano e Claude traduce l'inglese quando gli viene chiesto.

## Per Claude: checklist quando l'autore dà un testo

1. Crea la cartella da copia di `post-template`, con un nome in minuscolo e trattini.
2. Scrivi `it.md` con il testo dell'autore (senza cambiarlo, solo formattazione Markdown) e `en.md` con la traduzione. Stesse data e stesse immagini.
3. Copia le immagini indicate dall'autore nella cartella e scrivi una didascalia sensata.
4. Esegui `npm run blog`: deve stampare il numero di post senza errori. Poi `npm run test:blog` e `npx ng test --watch=false` se hai toccato il codice.
5. **Non fare commit né push** senza una richiesta esplicita dell'autore.
6. Se serve un tipo di contenuto che il Markdown non copre (galleria, video, riquadro), non scrivere HTML dentro il testo: aggiungi il supporto in `src/app/blog/markdown.ts` e documentalo qui.

## Dove sta il codice

| File | Cosa fa |
|---|---|
| `scripts/blog-index.mjs` | legge i post e genera `public/blog/index.json` (con i test in `scripts/blog-index.test.mjs`) |
| `src/app/blog/blog.service.ts` | carica l'indice e sceglie la lingua di ogni post |
| `src/app/blog/blog.ts` | pagina elenco |
| `src/app/blog/blog-post.ts` | pagina del singolo post (stili di testo e immagini) |
| `src/app/blog/markdown.ts` | da Markdown a HTML, con figura e didascalia |
