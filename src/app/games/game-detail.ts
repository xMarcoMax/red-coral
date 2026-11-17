import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { GAMES } from './games.data';

// Modello di base delle pagine dei giochi: ogni gioco futuro parte da qui
// e potrà avere il proprio stile.
@Component({
  selector: 'app-game-detail',
  imports: [RouterLink, TranslocoPipe],
  template: `
    <main class="container">
      @if (game(); as g) {
        <h1>{{ 'games.items.' + g.slug + '.title' | transloco }}</h1>
        <p class="genre">{{ 'games.items.' + g.slug + '.genre' | transloco }}</p>
        <p>{{ 'games.items.' + g.slug + '.description' | transloco }}</p>
        <h2>{{ 'games.detail.downloads' | transloco }}</h2>
        <p>{{ 'games.detail.noDownloads' | transloco }}</p>
      } @else {
        <h1>{{ 'games.notFound' | transloco }}</h1>
      }
      <a routerLink="/giochi">{{ 'games.back' | transloco }}</a>
    </main>
  `,
  styles: `
    .genre {
      color: var(--color-muted);
    }
  `,
})
export class GameDetail {
  readonly slug = input.required<string>();
  protected readonly game = computed(() => GAMES.find((g) => g.slug === this.slug()));
}
