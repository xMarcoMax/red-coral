# Guida ai contenuti: come aggiungere e modificare post e giochi

Questa guida serve a chi scrive i contenuti del sito (l'autore o Claude). Post del blog e pagine dei giochi funzionano allo stesso modo: **non serve toccare il codice**. Ogni contenuto è una cartella con uno o due file Markdown (uno per lingua) e le sue immagini. I giochi hanno in più qualche dato (genere, stato, download).

## Come funziona

| | Post del blog | Gioco |
|---|---|---|
| Cartella | `public/content/posts/<nome>/` | `public/content/games/<nome>/` |
| Modello da copiare | `public/content/posts/post-template/` | `public/content/games/game-template/` |
| Elenco | `/blog` | `/games` |
| Pagina | `/blog/<nome>` | `/games/<nome>` |

- Ogni cartella contiene `it.md` e/o `en.md` e le immagini. Il testo della pagina è il Markdown; i dati stanno in cima al file, nel front matter (vedi sotto).
- Le pagine sono sempre gli stessi componenti: non si crea mai una pagina Angular per un nuovo contenuto.
- L'elenco viene da `public/content/<posts|games>/index.json`, che **non si scrive a mano**: lo genera `scripts/content-index.mjs` leggendo l'intestazione di ogni file. Parte da solo con `npm start` e `npm run build`, ed è ignorato da git. Se usi `ng serve` direttamente, lancia prima `npm run content`.
- Le cartelle stanno sotto `content` apposta: su GitHub Pages un indirizzo come `/games/` aprirebbe la cartella invece della pagina del sito. Non creare in `public/` cartelle con lo stesso nome di una pagina (`blog`, `games`, `about-us`).

## Aggiungere un post o un gioco

1. Copia la cartella modello e dai alla copia il nome del contenuto. Il nome finisce nell'indirizzo: minuscolo, parole separate da trattini, niente accenti (esempi `primo-devlog`, `pax-historia`).
2. Modifica `it.md` e, se vuoi la versione inglese, `en.md` (vedi "Lingue").
3. Metti le immagini nella stessa cartella e scrivile nel testo con il solo nome del file. Cancella quelle del modello se non le usi.
4. Prova in locale con `npm start` e apri `/blog` o `/games`.
5. Commit e push, solo quando lo decide l'autore (il push pubblica il sito).

## L'intestazione dei file `.md`

Ogni file inizia con un'intestazione tra due righe `---`, poi il testo. Una riga per campo, nella forma `chiave: valore`.

Un post:

```
---
title: Titolo del post
date: 2026-11-17
---
In questo post parleremo di... (il primo paragrafo finisce nell'anteprima dell'elenco)
```

Un gioco:

```
---
title: Nome del gioco
icon: icon.png
genre: Avventura
status: Alfa
platforms: Windows
description: Una riga sola, breve: compare nell'elenco.
download: Windows 0.3 alfa | https://github.com/xMarcoMax/red-coral/releases/download/v0.3/gioco.zip
download: Manuale | downloads/manuale.pdf
---
Testo della pagina del gioco...
```

| Campo | Per chi | Significato |
|---|---|---|
| `title` | tutti, obbligatorio | titolo |
| `date` | post obbligatoria, giochi facoltativa | formato `AAAA-MM-GG`. Decide l'ordine dell'elenco (dal più recente) |
| `description` | facoltativo | testo dell'anteprima nell'elenco. Se manca, si usano le prime righe del testo |
| `icon` | giochi obbligatorio, post facoltativo | file dell'icona nella cartella (quadrata, PNG o SVG) |
| `genre`, `status`, `platforms` | giochi, obbligatori | genere, stato (alfa, beta, in sviluppo, rilasciato) e piattaforme, scritti come devono comparire |
| `download` | giochi, si può ripetere | `Etichetta \| indirizzo`: l'etichetta è il testo del link e non si traduce. L'indirizzo è un link `https://` (la GitHub Release) oppure un percorso relativo a `public/` |

- `date`, `icon` e `download` devono essere **uguali** in `it.md` e in `en.md`: se sono diversi `npm run content` si ferma. `title`, `genre`, `status`, `platforms` e `description` si scrivono nella lingua del file.
- **I file grandi non vanno nel repo**: caricali come GitHub Release e usa il link (vedi `CONTEXT.md` §2).
- Se manca un campo o l'intestazione, `npm run content` si ferma con un messaggio che dice quale file correggere.

## Scrivere il testo (Markdown)

| Per ottenere | Si scrive |
|---|---|
| Titolo di sezione | `## Titolo` |
| Grassetto, corsivo | `**grassetto**`, `*corsivo*` |
| Link | `[testo](https://...)` |
| Elenco puntato | una riga per voce, con `- ` davanti |
| Immagine | `![didascalia](file.png)` su una riga da sola |

Non si scrive HTML. Il `#` (titolo grande) non serve: il titolo viene dall'intestazione.

## Immagini e didascalie

L'immagine va su una riga da sola. Il testo tra parentesi quadre è la **didascalia** (e il testo alternativo per chi non vede l'immagine). Se è vuoto non c'è didascalia, ma meglio scriverlo sempre. Il titolo tra virgolette dopo il nome del file sceglie la posizione:

| Si scrive | Risultato |
|---|---|
| `![Didascalia](foto.png "right")` | a destra, con il testo che scorre attorno |
| `![Didascalia](foto.png "left")` | a sinistra, con il testo che scorre attorno |
| `![Didascalia](foto.png)` | a tutta larghezza del testo |

Su telefono le immagini a destra e a sinistra diventano a tutta larghezza. Il nome del file è relativo alla cartella del contenuto; un indirizzo che inizia con `https://` si usa così com'è. Per gli screenshot di un gioco: formato 16:9, a destra dopo il primo paragrafo. Preferisci PNG o JPG leggeri (sotto circa 500 KB) o SVG.

## Lingue

- `it.md` e `en.md`: un file per lingua. Il sito mostra quello della lingua attiva e cambia testo subito quando si cambia lingua.
- Se esiste un solo file, il contenuto compare in quella lingua anche a chi usa l'altra.
- Convenzione: l'autore scrive in italiano e Claude traduce l'inglese quando gli viene chiesto.

## Per Claude: checklist quando l'autore dà un testo

1. Crea la cartella da copia del modello giusto (`post-template` o `game-template`), con un nome in minuscolo e trattini.
2. Scrivi `it.md` con il testo dell'autore (senza cambiarlo, solo formattazione Markdown) e `en.md` con la traduzione. Stessi `date`, `icon` e `download`, stesse immagini.
3. Copia le immagini indicate dall'autore nella cartella e scrivi una didascalia sensata, nella lingua di ogni file.
4. Esegui `npm run content`: deve stampare il numero di elementi per raccolta senza errori. Poi `npm run test:scripts` e `npx ng test --watch=false` se hai toccato il codice.
5. **Non fare commit né push** senza una richiesta esplicita dell'autore.
6. Se serve un tipo di contenuto che il Markdown non copre (galleria, video, riquadro), non scrivere HTML dentro il testo: aggiungi il supporto in `src/app/content/markdown.ts` e documentalo qui. Se un gioco ha bisogno di una pagina con layout o stile propri, si lavora su `src/app/games/game-detail.ts`.

## Dove sta il codice

| File | Cosa fa |
|---|---|
| `scripts/content-index.mjs` | legge i `.md` e genera i due `index.json` (test in `scripts/content-index.test.mjs`) |
| `src/app/content/content-collection.ts` | carica l'indice, sceglie la lingua di ogni contenuto e completa i percorsi delle immagini: è la parte comune a blog e giochi |
| `src/app/content/content-body.ts` | carica il `.md` e lo mostra con immagini e didascalie (stili del testo) |
| `src/app/content/markdown.ts` | da Markdown a HTML, con figura e didascalia |
| `src/app/blog/` | pagine `/blog` (elenco) e `/blog/<nome>` (titolo e data) |
| `src/app/games/` | pagine `/games` (elenco) e `/games/<nome>` (icona, dati, download) |
