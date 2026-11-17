import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, TranslocoPipe],
  template: `
    <main class="container">
      <h1>{{ 'blog.title' | transloco }}</h1>
      @if (blog.loaded() && !blog.items().length) {
        <p>{{ 'blog.empty' | transloco }}</p>
      }
      <ul>
        @for (post of blog.items(); track post.slug) {
          <li>
            <a class="row" [routerLink]="['/blog', post.slug]">
              <h2>{{ post.title }}</h2>
              <p>{{ post.excerpt }}</p>
            </a>
          </li>
        }
      </ul>
    </main>
  `,
  styles: `
    ul {
      display: grid;
      gap: var(--space-3);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .row {
      display: block;
      padding: var(--space-3);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      color: var(--color-text);
      text-decoration: none;
      &:hover {
        border-color: var(--color-coral);
      }
    }
    h2 {
      margin: 0 0 var(--space-1);
      font-size: 1.15rem;
    }
    /* l'inizio del testo, tagliato con i puntini dopo due righe */
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
      margin: 0;
      color: var(--color-muted);
    }
  `,
})
export class Blog {
  protected readonly blog = inject(BlogService);
}
