import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { buildIndex, excerptOf } from './blog-index.mjs';

function blog(files) {
  const dir = mkdtempSync(join(tmpdir(), 'blog-'));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(dir, path.split('/')[0]), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  return dir;
}
const md = (title, date, body) => `---\ntitle: ${title}\ndate: ${date}\n---\n${body}\n`;

test("ordina dal più recente e prende l'estratto dal testo", () => {
  const dir = blog({
    'vecchio/it.md': md('Vecchio', '2026-01-01', 'Ciao **mondo**'),
    'nuovo/it.md': md('Nuovo', '2026-05-02', '# Titolo\n\n![didascalia](a.png)\n\nParliamo di [un gioco](x).'),
    'nuovo/en.md': md('New', '2026-05-02', 'We talk.'),
  });
  const posts = buildIndex(dir);
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

test('errori chiari su front matter e date sbagliati', () => {
  assert.throws(() => buildIndex(blog({ 'a/it.md': 'solo testo' })), /front matter/);
  assert.throws(() => buildIndex(blog({ 'a/it.md': md('T', '1/2/2026', 'x') })), /AAAA-MM-GG/);
  assert.throws(
    () => buildIndex(blog({ 'a/it.md': md('T', '2026-01-01', 'x'), 'a/en.md': md('T', '2026-01-02', 'x') })),
    /data è diversa/,
  );
});
