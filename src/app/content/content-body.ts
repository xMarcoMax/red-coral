import { httpResource } from '@angular/common/http';
import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { Lang } from '../i18n/language.service';
import { renderMarkdown } from './markdown';

/** Testo di un post o di un gioco: carica <cartella>/<slug>/<lingua>.md e lo mostra con le sue immagini. */
// ViewEncapsulation.None: l'HTML generato dal Markdown non porta gli attributi di stile del componente.
@Component({
  selector: 'app-content-body',
  encapsulation: ViewEncapsulation.None,
  template: `<div class="content-body" [innerHTML]="html()"></div>`,
  styles: `
    /* flow-root: il testo scorre attorno alle immagini e non le lascia uscire dal contenitore */
    .content-body {
      display: flow-root;
      max-width: 48rem;
    }
    .content-body h2 {
      margin-top: var(--space-5);
    }
    .content-body figure {
      margin: var(--space-4) 0;
    }
    .content-body figure.right,
    .content-body figure.left {
      width: min(45%, 24rem);
      margin-block: var(--space-1) var(--space-3);
    }
    .content-body figure.right {
      float: right;
      margin-left: var(--space-4);
    }
    .content-body figure.left {
      float: left;
      margin-right: var(--space-4);
    }
    @media (max-width: 40rem) {
      .content-body figure.right,
      .content-body figure.left {
        float: none;
        width: 100%;
        margin-inline: 0;
      }
    }
    .content-body img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: var(--radius);
    }
    .content-body figcaption {
      margin-top: var(--space-1);
      font-size: 0.85rem;
      color: var(--color-muted);
    }
  `,
})
export class ContentBody {
  readonly folder = input.required<string>();
  readonly slug = input.required<string>();
  readonly lang = input.required<Lang>();

  private readonly markdown = httpResource.text(() => ({
    url: `${this.folder()}/${this.slug()}/${this.lang()}.md`,
    cache: 'no-cache',
  }));

  protected readonly html = computed(() => {
    const md = this.markdown.value();
    return md ? renderMarkdown(md, `${this.folder()}/${this.slug()}`) : '';
  });
}
