import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContentBody } from '../content/content-body';
import { BlogService } from './blog.service';

// Pagina modello di tutti i post: il testo viene da public/content/posts/<slug>/<lingua>.md (vedi docs/CONTENUTI.md).
@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, TranslocoPipe, ContentBody],
  template: `
    <main class="container">
      @if (post(); as p) {
        <h1>{{ p.title }}</h1>
        <p class="post-date">{{ dateText() }}</p>
        <app-content-body [folder]="blog.folder" [slug]="p.slug" [lang]="p.lang" />
      } @else if (blog.loaded()) {
        <h1>{{ 'blog.notFound' | transloco }}</h1>
      }
      <p>
        <a routerLink="/blog">{{ 'blog.back' | transloco }}</a>
      </p>
    </main>
  `,
  styles: `
    h1 {
      font-family: var(--font-brand);
      font-weight: 400; /* Caprasimo ha un solo peso: senza questo il grassetto è finto */
    }
    .post-date {
      margin: 0 0 var(--space-4);
      color: var(--color-muted);
    }
  `,
})
export class BlogPost {
  readonly slug = input.required<string>();
  protected readonly blog = inject(BlogService);

  protected readonly post = computed(() => this.blog.items().find((p) => p.slug === this.slug()));

  protected readonly dateText = computed(() => {
    const p = this.post();
    return p?.date ? new Date(`${p.date}T00:00`).toLocaleDateString(p.lang, { dateStyle: 'long' }) : '';
  });
}
