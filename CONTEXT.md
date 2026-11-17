# Red Coral — Contesto di progetto

> File vivo. Descrive lo **stato attuale** del progetto, non la sua storia.
> Regola: quando un punto aperto viene risolto, si sposta nella sezione giusta (o si cancella). Niente cronologia: per quella c'è git.

## 1. Cos'è

Sito personale di **Red Coral**, nome (non registrato, non ufficiale) con cui uno sviluppatore indipendente di videogiochi pubblica i propri lavori. Il nome richiama il corallo rosso, simbolo di Alghero, la città dell'autore.

Il sito serve a:
- presentare i giochi;
- rendere scaricabili i giochi e le build alfa/beta, con le varie versioni;
- pubblicare aggiornamenti in stile blog (devlog, novità, note di rilascio).

Lingua del sito: italiano (da decidere se aggiungere l'inglese, vedi punti aperti).

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

| Route | Contenuto |
|---|---|
| `/` | Home: presentazione, gioco in evidenza, ultimi post |
| `/giochi` | Elenco dei giochi |
| `/giochi/:slug` | Scheda gioco: descrizione, screenshot, stato, download con tutte le versioni |
| `/blog` | Elenco post |
| `/blog/:slug` | Singolo post |
| `/chi-sono` | Chi c'è dietro Red Coral, contatti, link social |

## 4. Modello dei contenuti

Tutto statico, tenuto nel repo come file (nessun CMS).

- **Gioco**: slug, titolo, descrizione breve e lunga, stato (`in sviluppo` / `alfa` / `beta` / `rilasciato`), immagini, piattaforme, elenco versioni.
- **Versione**: numero, data, canale (alfa/beta/stabile), note di rilascio, link di download (Release GitHub) per piattaforma.
- **Post**: slug, titolo, data, riassunto, corpo, gioco collegato (opzionale).

Formato proposto: dati dei giochi in JSON, post in Markdown con front matter. Da confermare (punti aperti).

## 5. Direzione visiva

Ispirata al corallo rosso e al mare di Alghero.

- **Tono**: indie, personale, curato. Scuro e sobrio, con il rosso corallo come unico accento forte.
- **Palette iniziale (provvisoria)**:
  - corallo `#E8473F`
  - blu notte / mare profondo per gli sfondi
  - bianco sporco per il testo
  - tinta mare secondaria per i dettagli
- **Tipografia**: da scegliere (un titolo con carattere + un testo molto leggibile).
- **Logo**: da disegnare, idea di partenza un ramo di corallo stilizzato.
- **Responsive**: mobile first, il sito deve funzionare bene da telefono.
- **Accessibilità**: contrasto sufficiente, navigazione da tastiera, testo alternativo alle immagini.

I colori e i font vanno definiti una sola volta come variabili CSS in `src/styles.scss` e riusati ovunque.

## 6. Stato attuale

Fatto:
- Progetto Angular creato in questa cartella (nome `red-coral`, SCSS, routing, standalone, no SSR).
- Pages attivo con deploy automatico via Actions.
- Repo git inizializzato e pubblicato su GitHub (`xMarcoMax/red-coral`, pubblico).
- Boilerplate di default rimosso: `app.html` contiene solo `<router-outlet />`.
- Build e test passano.

Non c'è ancora: nessuna pagina, nessun contenuto, nessuno stile, il sito pubblicato mostra una pagina vuota.

## 7. Prossimi passi (in ordine)

1. Impostare il design system minimo: variabili CSS, font, reset, layout (header, footer).
2. Scrivere i modelli e un servizio che legge i contenuti (giochi, post).
3. Costruire le pagine: home, giochi, scheda gioco, blog, chi sono.
4. Collegare i download alle GitHub Releases.
5. Rifinire: SEO di base (title, meta, Open Graph), favicon, RSS per il blog.

## 8. Punti aperti

- Dominio personale al posto di `github.io`? Per ora no.
- Lingua: solo italiano o anche inglese?
- Formato dei post: Markdown con libreria di rendering, oppure HTML/componenti scritti a mano?
- Come gestire gli aggiornamenti dei download: la lista versioni si scrive a mano nel JSON, o si legge dall'API delle GitHub Releases a runtime?
- Quali giochi ci sono già da mostrare, e quali screenshot/materiali esistono.
- Social e contatti da mostrare (itch.io, Discord, YouTube, mail…).
- Logo e identità grafica: li disegni tu o servono indicazioni?
- Analytics e cookie: nessuno per ora, da rivalutare.

## 9. Convenzioni di lavoro

- Componenti standalone, con `signal` per lo stato locale. Un componente per cartella.
- Nomi di file e route in italiano o inglese in modo coerente (route in italiano come in §3, codice in inglese).
- Stili SCSS per componente; i valori comuni vengono sempre da variabili CSS globali.
- Comandi: `npm start` (sviluppo), `npm run build`, `npm test`.
- Questo file va aggiornato **nello stesso momento** in cui cambia qualcosa che descrive.
