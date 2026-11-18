import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { buildIndex, excerptOf } from './content-index.mjs';

function folder(files) {
  const dir = mkdtempSync(join(tmpdir(), 'content-'));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(dir, path.split('/')[0]), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  return dir;
}
const md = (title, date, body) => `---\ntitle: ${title}\ndate: ${date}\n---\n${body}\n`;

test("post: ordina dal più recente e prende l'estratto dal testo", () => {
  const dir = folder({
    'vecchio/it.md': md('Vecchio', '2026-01-01', 'Ciao **mondo**'),
    'nuovo/it.md': md('Nuovo', '2026-05-02', '# Titolo\n\n![didascalia](a.png)\n\nParliamo di [un gioco](x).'),
    'nuovo/en.md': md('New', '2026-05-02', 'We talk.'),
  });
  const posts = buildIndex(dir, 'posts');
  assert.deepEqual(posts.map((p) => p.slug), ['nuovo', 'vecchio']);
  assert.equal(posts[0].it.excerpt, 'Titolo Parliamo di un gioco.');
  assert.equal(posts[0].en.title, 'New');
  assert.equal(posts[1].en, undefined);
});

test('taglia gli estratti lunghi a fine parola, con i puntini', () => {
  const e = excerptOf('parola '.repeat(100));
  assert.equal(e.endsWith('parola…'), true);
  assert.equal(e.length <= 301, true);
});

const game = (title, extra = '') =>
  `---\ntitle: ${title}\nicon: icon.png\ndate: 2026-01-01\ngenre: G\nstatus: S\nplatforms: P\ndescription: Breve ${title}\n${extra}---\nTesto\n`;

test('gioco: campi, descrizione al posto dell\'estratto, download ripetuti', () => {
  const dl = 'download: Windows | https://x.it/a.zip\ndownload: Test | downloads/t.txt\n';
  const [g] = buildIndex(folder({ 'g/it.md': game('Titolo', dl), 'g/en.md': game('Title', dl) }), 'games');
  assert.equal(g.icon, 'icon.png');
  assert.deepEqual(g.downloads, [
    { label: 'Windows', file: 'https://x.it/a.zip' },
    { label: 'Test', file: 'downloads/t.txt' },
  ]);
  assert.equal(g.date, "2026-01-01");
  assert.deepEqual(g.it, { excerpt: 'Breve Titolo', title: 'Titolo', genre: 'G', status: 'S', platforms: 'P' });
});

test('errori chiari su front matter, date e campi sbagliati', () => {
  assert.throws(() => buildIndex(folder({ 'a/it.md': 'solo testo' }), 'posts'), /front matter/);
  assert.throws(() => buildIndex(folder({ 'a/it.md': md('T', '1/2/2026', 'x') }), 'posts'), /AAAA-MM-GG/);
  assert.throws(() => buildIndex(folder({ 'a/it.md': '---\ntitle: T\n---\nx' }), 'posts'), /manca "date"/);
  assert.throws(() => buildIndex(folder({ 'a/it.md': '---\ntitle: T\nicon: i.png\n---\nx' }), 'games'), /manca "genre"/);
  assert.throws(() => buildIndex(folder({ 'a/it.md': game('T', 'download: solo-etichetta\n') }), 'games'), /Etichetta \| indirizzo/);
  assert.throws(
    () => buildIndex(folder({ 'a/it.md': md('T', '2026-01-01', 'x'), 'a/en.md': md('T', '2026-01-02', 'x') }), 'posts'),
    /"date" è diverso/,
  );
  assert.throws(
    () => buildIndex(folder({ 'a/it.md': game('T'), 'a/en.md': game('T', 'download: A | b\n') }), 'games'),
    /"downloads" è diverso/,
  );
});

test('gioco: stato e piattaforme sono facoltativi', () => {
  const md = '---\ntitle: T\nicon: i.png\ndate: 2026-01-01\ngenre: G\n---\n';
  const [g] = buildIndex(folder({ 'g/it.md': md }), 'games');
  assert.deepEqual(g.it, { excerpt: '', title: 'T', genre: 'G' });
});

test('i modelli in templates/ sono validi', () => {
  assert.equal(buildIndex('templates/posts', 'posts').length, 1);
  assert.equal(buildIndex('templates/games', 'games').length, 1);
});
