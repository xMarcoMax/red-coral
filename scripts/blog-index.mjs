// Genera public/blog/index.json leggendo i post in public/blog/<slug>/<lingua>.md.
// Parte da sola con `npm start` e `npm run build` (vedi docs/BLOG.md).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const LANGS = ['it', 'en'];
const EXCERPT_LENGTH = 300;

// shortcut: front matter = righe "chiave: valore" tra due "---", niente YAML completo; si cambia se servono liste o testi su più righe
function parse(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: manca il front matter (--- ... --- in testa al file)`);
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: m[2] };
}

/** Testo semplice dall'inizio del post: niente immagini, link, titoli o simboli Markdown. */
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

export function buildIndex(dir) {
  const posts = [];
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const post = { slug: d.name };
    for (const lang of LANGS) {
      const file = join(dir, d.name, `${lang}.md`);
      if (!existsSync(file)) continue;
      const { meta, body } = parse(readFileSync(file, 'utf8'), file);
      if (!meta.title) throw new Error(`${file}: manca "title" nel front matter`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? '')) throw new Error(`${file}: "date" deve essere AAAA-MM-GG`);
      if (post.date && post.date !== meta.date) throw new Error(`${d.name}: la data è diversa tra le lingue`);
      post.date = meta.date;
      post[lang] = { title: meta.title, excerpt: excerptOf(body) };
    }
    if (!post.date) throw new Error(`${join(dir, d.name)}: nessun file ${LANGS.map((l) => l + '.md').join(' o ')}`);
    posts.push(post);
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const posts = buildIndex('public/blog');
    writeFileSync('public/blog/index.json', JSON.stringify(posts, null, 2) + '\n');
    console.log(`blog: ${posts.length} post nell'indice`);
  } catch (e) {
    console.error(`blog: ${e.message}`);
    process.exit(1);
  }
}
