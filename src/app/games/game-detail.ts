import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContentBody } from '../content/content-body';
import { GamesService } from './games.service';

// Modello di base delle pagine dei giochi: ogni gioco futuro parte da qui
// e potrà avere il proprio stile.
@Component({
  selector: 'app-game-detail',
  imports: [RouterLink, TranslocoPipe, ContentBody],
  template: `
    <main class="container">
      @if (game(); as g) {
        <header>
          @if (g.icon) {
            <img [src]="g.icon" alt="" width="160" height="160" />
          }
          <div>
            <h1>{{ g.title }}</h1>
            <p class="genre">{{ g.genre }}</p>
            <p>{{ g.excerpt }}</p>
          </div>
        </header>
        @if (g.status || g.platforms) {
          <dl>
            @if (g.status) {
              <dt>{{ 'games.detail.status' | transloco }}</dt>
              <dd>{{ g.status }}</dd>
            }
            @if (g.platforms) {
              <dt>{{ 'games.detail.platforms' | transloco }}</dt>
              <dd>{{ g.platforms }}</dd>
            }
          </dl>
        }
        <app-content-body [folder]="games.folder" [slug]="g.slug" [lang]="g.lang" />
        <h2>{{ 'games.detail.downloads' | transloco }}</h2>
        @if (g.downloads.length) {
          <ul>
            @for (d of g.downloads; track d.file) {
              <li>
                <a [href]="d.file" download>{{ d.label }}</a>
              </li>
            }
          </ul>
        } @else {
          <p>{{ 'games.detail.noDownloads' | transloco }}</p>
        }
      } @else if (games.loaded()) {
        <h1>{{ 'games.notFound' | transloco }}</h1>
      }
      <p>
        <a routerLink="/games">{{ 'games.back' | transloco }}</a>
      </p>
    </main>
  `,
  styles: `
    header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-4);
    }
    img {
      width: clamp(6rem, 25vw, 10rem);
      height: auto;
      aspect-ratio: 1;
      object-fit: contain;
      padding: var(--space-3);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
    }
    h1 {
      margin: 0;
      font-family: var(--font-brand);
      font-weight: 400; /* Caprasimo ha un solo peso: senza questo il grassetto è finto */
    }
    .genre {
      margin: 0;
      color: var(--color-muted);
    }
    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: var(--space-1) var(--space-4);
    }
    dt {
      color: var(--color-muted);
    }
    dd {
      margin: 0;
    }
  `,
})
export class GameDetail {
  readonly slug = input.required<string>();
  protected readonly games = inject(GamesService);
  protected readonly game = computed(() => this.games.items().find((g) => g.slug === this.slug()));
}
