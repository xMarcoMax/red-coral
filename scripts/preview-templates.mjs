// Copia i modelli di templates/ in public/content/<raccolta>/anteprima-modello/ per vederli nel sito con `npm run preview`.
// Quelle cartelle sono ignorate da git, quindi non arrivano mai online.
import { cpSync, rmSync } from 'node:fs';

for (const collection of ['games', 'posts']) {
  const to = `public/content/${collection}/anteprima-modello`;
  rmSync(to, { recursive: true, force: true });
  cpSync(`templates/${collection}/template`, to, { recursive: true });
}
console.log('modelli copiati: /games/anteprima-modello e /blog/anteprima-modello');
