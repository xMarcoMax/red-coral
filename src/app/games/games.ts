import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { GamesService } from './games.service';

@Component({
  selector: 'app-games',
  imports: [RouterLink, TranslocoPipe],
  template: `
    <main class="container">
      <h1>{{ 'games.title' | transloco }}</h1>
      <ul>
        @for (game of games(); track game.slug) {
          <li>
            <a class="row" [routerLink]="['/games', game.slug]">
              @if (game.icon) {
                <img [src]="game.icon" alt="" width="96" height="96" />
              }
              <div class="text">
                <h2>{{ game.title }}</h2>
                <p>
                  <span class="description">{{ game.excerpt }}</span>
                  <span class="genre">&nbsp;– {{ game.genre }}</span>
                </p>
              </div>
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
      display: flex;
      align-items: center;
      gap: var(--space-4);
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
    img {
      flex: none;
      width: clamp(4rem, 15vw, 6rem);
      height: auto;
      aspect-ratio: 1;
      object-fit: contain;
      padding: var(--space-2);
      background: var(--color-bg);
      border-radius: var(--radius);
    }
    .text {
      min-width: 0;
      flex: 1;
    }
    h2 {
      margin: 0 0 var(--space-1);
      font-size: 1.25rem;
    }
    p {
      display: flex;
      margin: 0;
      color: var(--color-muted);
    }
    .description {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .genre {
      flex: none;
    }
  `,
})
export class Games {
  protected readonly games = inject(GamesService).items;
}
