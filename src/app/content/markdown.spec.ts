import { renderMarkdown, stripFrontMatter } from './markdown';

describe('renderMarkdown', () => {
  it('toglie il front matter', () => {
    expect(stripFrontMatter('---\ntitle: T\ndate: 2026-01-01\n---\nTesto')).toBe('Testo');
  });

  it('trasforma un\'immagine sola in una figura con didascalia e percorso del post', () => {
    const html = renderMarkdown('Prima\n\n![Una didascalia](a.png "right")\n\nDopo', 'posts/mio-post');
    expect(html).toContain('<figure class="right"><img src="posts/mio-post/a.png" alt="Una didascalia"');
    expect(html).toContain('<figcaption>Una didascalia</figcaption>');
    expect(html).not.toContain('<p><figure');
    expect(html).toContain('<p>Prima</p>');
  });

  it("senza titolo l'immagine è a tutta larghezza; gli indirizzi assoluti restano com'è", () => {
    const html = renderMarkdown('![](https://esempio.it/x.png)', 'p');
    expect(html).toContain('<figure class="full"><img src="https://esempio.it/x.png"');
    expect(html).not.toContain('figcaption');
  });

  it('non lascia passare HTML nella didascalia', () => {
    expect(renderMarkdown('![<b>x</b>](a.png)', 'p')).not.toContain('<b>');
  });
});
