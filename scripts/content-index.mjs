// Genera public/content/<raccolta>/index.json leggendo public/content/<raccolta>/<slug>/<lingua>.md (vedi docs/CONTENUTI.md).
// Le raccolte sono "posts" (blog) e "games". Parte da sola con `npm start` e `npm run build`.
// Stanno sotto "content" perché su GitHub Pages una cartella con lo stesso nome di una route (es. /games/)
// aprirebbe la cartella e non la pagina Angular.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const LANGS = ['it', 'en'];
const EXCERPT_LENGTH = 300;
// campi obbligatori oltre a "title", per raccolta
const REQUIRED = { posts: ['date'], games: ['icon', 'genre', 'status', 'platforms'] };
// campi di testo, diversi per lingua
const TEXTS = ['title', 'genre', 'status', 'platforms'];

// shortcut: front matter = righe "chiave: valore" tra due "---", niente YAML completo; solo "download" si può ripetere; si cambia se servono altre liste o testi su più righe
function parse(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: manca il front matter (--- ... --- in testa al file)`);
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i <= 0) continue;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (key === 'download') (meta.download ??= []).push(value);
    else meta[key] = value;
  }
  return { meta, body: m[2] };
}

/** "Etichetta | indirizzo" -> { label, file } */
function parseDownload(value, file) {
  const i = value.indexOf('|');
  const label = value.slice(0, i).trim();
  const target = value.slice(i + 1).trim();
  if (i < 0 || !label || !target) throw new Error(`${file}: "download" deve essere "Etichetta | indirizzo"`);
  return { label, file: target };
}

/** Testo semplice dall'inizio del testo: niente immagini, link, titoli o simboli Markdown. */
export function excerptOf(body) {
  const text = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= EXCERPT_LENGTH) return text;
  const cut = text.slice(0, EXCERPT_LENGTH);
  return cut.slice(0, cut.lastIndexOf(' ')).trimEnd() + '…'; // taglia a fine parola e lo dice
}

export function buildIndex(dir, collection) {
  const items = [];
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const item = { slug: d.name };
    let shared; // data, icona e download: devono essere uguali nelle due lingue
    for (const lang of LANGS) {
      const file = join(dir, d.name, `${lang}.md`);
      if (!existsSync(file)) continue;
      const { meta, body } = parse(readFileSync(file, 'utf8'), file);
      for (const k of ['title', ...(REQUIRED[collection] ?? [])]) {
        if (!meta[k]) throw new Error(`${file}: manca "${k}" nel front matter`);
      }
      if (meta.date && !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: "date" deve essere AAAA-MM-GG`);
      const now = { date: meta.date, icon: meta.icon, downloads: meta.download?.map((v) => parseDownload(v, file)) };
      if (!shared) Object.assign(item, (shared = now));
      else for (const k of Object.keys(now)) {
        if (JSON.stringify(now[k]) !== JSON.stringify(shared[k])) throw new Error(`${d.name}: "${k}" è diverso tra le lingue`);
      }
      item[lang] = { excerpt: meta.description || excerptOf(body) };
      for (const k of TEXTS) if (meta[k]) item[lang][k] = meta[k];
    }
    if (!shared) throw new Error(`${join(dir, d.name)}: nessun file ${LANGS.map((l) => l + '.md').join(' o ')}`);
    items.push(item);
  }
  return items.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.slug.localeCompare(b.slug));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    for (const collection of Object.keys(REQUIRED)) {
      const dir = join('public', 'content', collection);
      const items = buildIndex(dir, collection);
      writeFileSync(join(dir, 'index.json'), JSON.stringify(items, null, 2) + '\n');
      console.log(`${collection}: ${items.length} nell'indice`);
    }
  } catch (e) {
    console.error(`contenuti: ${e.message}`);
    process.exit(1);
  }
}
