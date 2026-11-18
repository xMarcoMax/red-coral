# Modelli per nuovi contenuti

Questa cartella **non viene pubblicata** con il sito: contiene i modelli da copiare per creare un nuovo gioco o un nuovo post. Guida completa ai campi e al Markdown: `docs/CONTENUTI.md`.

| Per creare | Copia | In |
|---|---|---|
| un gioco | `templates/games/template/` | `public/content/games/<nome>/` |
| un post | `templates/posts/template/` | `public/content/posts/<nome>/` |

Poi, nella copia:
- sostituisci tutti i testi segnaposto in `it.md` e `en.md`, e `date` con la data di oggi (`AAAA-MM-GG`);
- sostituisci le immagini segnaposto (`icon.svg`, `screenshot-1.svg`, `immagine-*.svg`) con quelle vere e aggiorna i nomi nei file; cancella quelle che non usi;
- nei giochi, togli le righe `status`, `platforms` e `download` che non servono, e metti il link vero della GitHub Release;
- cancella le sezioni di esempio che non servono: i modelli mostrano ogni elemento possibile (sezione, grassetto, link, elenco, immagine a destra e a tutta larghezza; `"left"` per l'immagine a sinistra).

Per vedere i modelli nel sito: `npm run preview` li copia come `anteprima-modello` (cartelle ignorate da git, non vanno online) e avvia il sito. Apri `/games/anteprima-modello` e `/blog/anteprima-modello`. Dopo modifiche ai modelli, rilancia il comando.

I modelli sono controllati da `npm run test:scripts`: se cambia il formato dei contenuti, il test si rompe finché non li aggiorni.
