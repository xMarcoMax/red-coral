# Red Coral — Contesto di progetto

> File vivo. Descrive lo **stato attuale** del progetto, non la sua storia.
> Regola: quando un punto aperto viene risolto, si sposta nella sezione giusta (o si cancella). Niente cronologia: per quella c'è git.

## 1. Cos'è

Sito personale di **Red Coral**, nome (non registrato, non ufficiale) con cui uno sviluppatore indipendente di videogiochi pubblica i propri lavori. Il nome richiama il corallo rosso, simbolo di Alghero, la città dell'autore.

Il sito serve a:
- presentare i giochi;
- rendere scaricabili i giochi e le build alfa/beta, con le varie versioni;
- pubblicare aggiornamenti in stile blog (devlog, novità, note di rilascio).

Lingue: **italiano e inglese**. Si sceglie in automatico dalla lingua del browser (`it` → italiano, `en` → inglese, qualsiasi altra lingua → inglese). Un selettore nel sito permette di cambiarla in tempo reale (senza ricaricare), e la scelta va ricordata. Tecnica: **Transloco** (`@jsverse/transloco`), traduzioni in `public/i18n/{en,it}.json`, caricate con URL relativo (rispetta il base href). Logica in `src/app/i18n/language.service.ts` (scelta salvata in `localStorage`, altrimenti lingua del browser) e selettore a tendina nell'header (icona del mondo; voci con il nome nella propria lingua e la bandierina a destra, `public/flags/`; la lingua attiva ha una mezzaluna corallo a sinistra alta quanto il testo). I testi nei template usano la pipe `transloco`; ogni testo nuovo va aggiunto in entrambi i file JSON.

## 2. Stack e hosting

- **Angular 22** (CLI 22.2.7), componenti standalone, signals, SCSS, routing. Niente SSR.
- Node 24, npm 11. Test con Vitest (default Angular).
- **Hosting: GitHub Pages**, quindi sito 100% statico. Nessun backend, nessun database.
- **Repo**: https://github.com/xMarcoMax/red-coral (pubblico, branch `main`). URL del sito previsto: `https://xmarcomax.github.io/red-coral/`.
- Build di produzione: `ng build` → `dist/red-coral/`.

Deploy: `.github/workflows/deploy.yml` builda a ogni push su `main` con `--base-href /red-coral/`, copia `index.html` in `404.html` (fallback per le route Angular) e pubblica su Pages (sorgente: GitHub Actions).

Vincoli di GitHub Pages:
- **base href**: il sito vive sotto `/red-coral/`; con un dominio personale andrà tolto `--base-href` dal workflow.
- **Deep link / refresh**: gestito dal `404.html` generato nel workflow.
- **File grandi**: i download dei giochi non vanno nel repo. Usare **GitHub Releases** (limite 2 GB per file) e linkarli dal sito.

## 3. Struttura del sito (pagine)

| Route | Contenuto | Stato |
|---|---|---|
| `/` | Home: presentazione, gioco in evidenza, ultimi post | segnaposto |
| `/games` | Elenco dei giochi: un link per gioco | fatta |
| `/games/:slug` | Scheda gioco: icona, dati, testo con screenshot, download. Parte da un **modello base** condiviso; ogni gioco potrà avere il proprio stile | modello segnaposto (`game-template`) |
| `/about-us` | Chi c'è dietro Red Coral, contatti, link social | solo "Work in progress" |
| `/blog`, `/blog/:slug` | Elenco post (titolo + inizio del testo troncato) e singolo post | fatta, con post modello `post-template` |

Gli indirizzi delle pagine sono in inglese, come il codice, anche se il sito è bilingue.

**Contenuti (post e giochi)**: blog e giochi funzionano allo stesso modo. Ogni contenuto è una cartella `public/content/posts/<slug>/` o `public/content/games/<slug>/` con `it.md` e/o `en.md` (Markdown con intestazione `title`, e per i post `date`, per i giochi `icon`, `genre`, `status`, `platforms`, `description` e uno o più `download: Etichetta | indirizzo`) più le sue immagini. Le cartelle stanno sotto `content` perché su Pages una cartella con lo stesso nome di una route (`/blog/`, `/games/`) aprirebbe la cartella e non la pagina. Gli indici `public/content/<raccolta>/index.json` sono generati da `scripts/content-index.mjs` (parte con `npm start` e `npm run build`, ignorati da git; con `ng serve` diretto va lanciato prima `npm run content`). Codice comune: `src/app/content/` (`ContentCollection` carica l'indice e sceglie la lingua; `ContentBody` mostra il testo; `markdown.ts` lo converte con `marked`). Le immagini su una riga da sola diventano figure con didascalia, con posizione `"right"`, `"left"` o a tutta larghezza. **Guida completa: `docs/CONTENUTI.md`** (da leggere prima di toccare blog o giochi).

**Layout dell'elenco `/games` (deciso)**: una riga rettangolare per gioco, tutta cliccabile (bordo corallo al passaggio del mouse). A sinistra l'icona del gioco (quadrata, bordi arrotondati, circa 96 px). A destra due testi uno sopra l'altro: sopra il titolo; sotto una brevissima descrizione, poi un trattino e il genere. La descrizione si tronca con "…" su una riga, il genere non si tronca. Su telefono la riga resta uguale con l'icona più piccola.

**Modello della pagina gioco** (`game-template`, testi inventati da sostituire): icona, titolo, genere, descrizione, stato, piattaforme, testo, elenco download. Il download di prova è `public/downloads/test-download.txt`; lo screenshot segnaposto (16:9, con il simbolo) è `public/content/games/game-template/screenshot-1.svg`, inserito nel testo con la sintassi delle immagini, a destra con il testo che scorre attorno (larghezza massima circa 24 rem, a tutta larghezza su telefono) e una didascalia, per mostrare come appaiono le immagini di gioco. Il nome del file nel link non si traduce.

Navigazione nell'header: Home, Giochi, Blog, Chi siamo. Ogni altra route torna alla home.

## 4. Modello dei contenuti

Tutto statico, tenuto nel repo come file (nessun CMS).

- **Gioco**: slug, titolo, descrizione breve e lunga, stato (`in sviluppo` / `alfa` / `beta` / `rilasciato`), immagini, piattaforme, elenco versioni.
- **Versione**: numero, data, canale (alfa/beta/stabile), note di rilascio, link di download (Release GitHub) per piattaforma.
- **Post**: slug, titolo, data, riassunto, corpo, gioco collegato (opzionale).

Giochi e post: file **Markdown** con front matter (vedi sopra), resi con una libreria dentro un contenitore stilizzato dal CSS del sito (stessi font e colori; il gioco può avere un proprio tema). I download di ogni gioco sono righe `download:` nell'intestazione, con i link alle GitHub Releases: a ogni release si aggiunge una riga. Per layout complessi (galleria, riquadro download) si useranno blocchi speciali che il sito mostra come componenti Angular. Un post con layout unico può essere una pagina Angular a parte.

## 5. Direzione visiva

Ispirata al corallo rosso e al mare di Alghero.

- **Tono**: indie, personale, curato. Scuro e sobrio, con il rosso corallo come unico accento forte.
- **Palette iniziale (provvisoria, già in `src/styles.scss`)**:
  - corallo `#E8473F`
  - blu notte / mare profondo per gli sfondi
  - bianco sporco per il testo
  - tinta mare secondaria per i dettagli
- **Tipografia**: da scegliere (un titolo con carattere + un testo molto leggibile).
- **Logo**: corallo rosso su roccia grigia, stile piatto (generato con Codex). Definitivo. File in `public/`: `logo.png` (simbolo senza scritta, sfondo trasparente, ripulito dalla polvere dei bordi), `favicon.ico`, `apple-touch-icon.png`. Versione con scritta (simbolo + "Red Coral" in Caprasimo con lettere alternate rosso e giallo come le bande aragonesi di Alghero, R rossa): `red-coral-vertical-logo.png` nella radice del progetto, fuori da `public/`, non ancora usata nel sito. Versioni vettoriali (SVG a colori piatti, un livello per colore, ottenute dai PNG con potrace): `red-coral.svg` (simbolo), `red-coral-text.svg` (scritta), `red-coral-vertical-logo.svg` (insieme). Non ancora usate nel sito, che usa il PNG `public/logo.png`: sono pronte per sostituirlo e per generare le icone. Sorgenti raster nella radice (ripulite, definitive): `red-coral.png` (simbolo approvato) e `red-coral-text.png` (testo).
- **Responsive**: mobile first, il sito deve funzionare bene da telefono.
- **Accessibilità**: contrasto sufficiente, navigazione da tastiera, testo alternativo alle immagini.

I colori, i font e le spaziature sono variabili CSS in `src/styles.scss` (`--color-*`, `--space-*`, `--font-*`), usate ovunque. Font del marchio (nome Red Coral): **Caprasimo** (licenza OFL), installato come pacchetto npm `@fontsource/caprasimo` e servito dal sito, variabile `--font-brand`. Usarlo per il nome della software house (anche sotto il logo) e per il titolo (`h1`) della pagina di un gioco e di un post del blog. Per titoli e testi per ora lo stack di sistema (nessun font di Google caricato da remoto, per la privacy); font per titoli e testi ancora da scegliere.

## 6. Stato attuale

Fatto:
- Progetto Angular creato in questa cartella (nome `red-coral`, SCSS, routing, standalone, no SSR).
- Pages attivo con deploy automatico via Actions.
- Repo git inizializzato e pubblicato su GitHub (`xMarcoMax/red-coral`, pubblico).
- Boilerplate di default rimosso: `app.html` contiene solo `<router-outlet />`.
- Build e test passano.

Il grafo della conoscenza (graphify) vive in `graphify-out/`, ignorato da git, e si rigenera da solo a ogni commit sul codice. I file di documentazione vanno aggiornati a mano con `/graphify . --update`.

Design system minimo fatto: variabili CSS, reset, classe `.container`, shell con header (solo il marchio) e footer. La navigazione comparirà man mano che esistono le pagine.

Internazionalizzazione it/en fatta (rilevamento browser, selettore, lingua ricordata). Verificata con build e test, non ancora aperta in un browser.

Navigazione con tre pagine (Home, Giochi, Chi siamo) e pagina modello del gioco.

Non c'è ancora: nessuna pagina, nessun contenuto, nessuno stile, il sito pubblicato mostra una pagina vuota.

## 7. Prossimi passi (in ordine)

1. Home e Chi siamo (contenuti veri).
2. Collegare i download alle GitHub Releases.
3. Rifinire: SEO di base (title, meta, Open Graph), RSS per il blog, logo SVG nell'header.

## 8. Punti aperti

- **Stile grafico del logo** e palette definitiva.
- Dominio personale al posto di `github.io`: per ora no.
- Analytics e cookie: nessuno per ora.
- Giochi, screenshot, social e contatti: non esiste ancora nulla di ufficiale, quindi per ora segnaposto.

## 9. Convenzioni di lavoro

- Componenti standalone, con `signal` per lo stato locale. Un componente per cartella.
- Nomi di file, route e codice in inglese.
- Stili SCSS per componente; i valori comuni vengono sempre da variabili CSS globali.
- Comandi: `npm start` (sviluppo), `npm run build`, `npm test`.
- Questo file va aggiornato **nello stesso momento** in cui cambia qualcosa che descrive.
