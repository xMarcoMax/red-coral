import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { BlogService } from './blog.service';
import { renderPost } from './markdown';

// Pagina modello di tutti i post: il testo viene da public/blog/<slug>/<lingua>.md (vedi docs/BLOG.md).
// ViewEncapsulation.None: l'HTML generato dal Markdown non porta gli attributi di stile del componente.
@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, TranslocoPipe],
  encapsulation: ViewEncapsulation.None,
  template: `
    <main class="container">
      @if (post(); as p) {
        <h1>{{ p.title }}</h1>
        <p class="post-date">{{ dateText() }}</p>
        <div class="post-body" [innerHTML]="html()"></div>
      } @else if (blog.loaded()) {
        <h1>{{ 'blog.notFound' | transloco }}</h1>
      }
      <p>
        <a routerLink="/blog">{{ 'blog.back' | transloco }}</a>
      </p>
    </main>
  `,
  styles: `
    .post-date {
      margin: 0 0 var(--space-4);
      color: var(--color-muted);
    }
    /* flow-root: il testo scorre attorno alle immagini e non le lascia uscire dal contenitore */
    .post-body {
      display: flow-root;
      max-width: 48rem;
    }
    .post-body h2 {
      margin-top: var(--space-5);
    }
    .post-body figure {
      margin: var(--space-4) 0;
    }
    .post-body figure.right,
    .post-body figure.left {
      width: min(45%, 24rem);
      margin-block: var(--space-1) var(--space-3);
    }
    .post-body figure.right {
      float: right;
      margin-left: var(--space-4);
    }
    .post-body figure.left {
      float: left;
      margin-right: var(--space-4);
    }
    @media (max-width: 40rem) {
      .post-body figure.right,
      .post-body figure.left {
        float: none;
        width: 100%;
        margin-inline: 0;
      }
    }
    .post-body img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: var(--radius);
    }
    .post-body figcaption {
      margin-top: var(--space-1);
      font-size: 0.85rem;
      color: var(--color-muted);
    }
  `,
})
export class BlogPost {
  readonly slug = input.required<string>();
  protected readonly blog = inject(BlogService);

  protected readonly post = computed(() => this.blog.posts().find((p) => p.slug === this.slug()));

  private readonly markdown = httpResource.text(() => {
    const p = this.post();
    return p ? { url: `blog/${p.slug}/${p.lang}.md`, cache: 'no-cache' } : undefined;
  });

  protected readonly dateText = computed(() => {
    const p = this.post();
    return p ? new Date(`${p.date}T00:00`).toLocaleDateString(p.lang, { dateStyle: 'long' }) : '';
  });

  protected readonly html = computed(() => {
    const md = this.markdown.value();
    return md ? renderPost(md, this.slug()) : '';
  });
}
