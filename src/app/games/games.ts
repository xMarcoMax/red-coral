import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { GAMES } from './games.data';

@Component({
  selector: 'app-games',
  imports: [RouterLink, TranslocoPipe],
  template: `
    <main class="container">
      <h1>{{ 'games.title' | transloco }}</h1>
      <ul>
        @for (game of games; track game.slug) {
          <li>
            <a [routerLink]="['/giochi', game.slug]">
              {{ 'games.items.' + game.slug + '.title' | transloco }}
            </a>
          </li>
        }
      </ul>
    </main>
  `,
})
export class Games {
  protected readonly games = GAMES;
}
