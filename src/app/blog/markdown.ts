import { Marked, Tokens } from 'marked';

/** Toglie il blocco --- ... --- in testa al file. */
export function stripFrontMatter(raw: string): string {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Markdown -> HTML. Le immagini scritte da sole su una riga diventano una figura con didascalia:
 * `![didascalia](file.png "right")`. Il titolo tra virgolette sceglie la posizione:
 * "right" e "left" fanno scorrere il testo attorno, altrimenti l'immagine sta a tutta larghezza.
 * I percorsi relativi partono da public/blog/<slug>/.
 */
export function renderPost(markdown: string, slug: string): string {
  const marked = new Marked({
    renderer: {
      image({ href, title, text }: Tokens.Image) {
        const src = /^(https?:|data:|\/)/.test(href) ? href : `blog/${slug}/${href}`;
        const side = title === 'right' || title === 'left' ? title : 'full';
        const caption = text ? `<figcaption>${escape(text)}</figcaption>` : '';
        return `<figure class="${side}"><img src="${escape(src)}" alt="${escape(text)}" loading="lazy" />${caption}</figure>`;
      },
      paragraph({ tokens }: Tokens.Paragraph) {
        const inline = this.parser.parseInline(tokens);
        // una figura dentro un <p> non è HTML valido: se il paragrafo è solo l'immagine la lasciamo sola
        return tokens.length === 1 && tokens[0].type === 'image' ? inline : `<p>${inline}</p>\n`;
      },
    },
  });
  return marked.parse(stripFrontMatter(markdown), { async: false });
}
