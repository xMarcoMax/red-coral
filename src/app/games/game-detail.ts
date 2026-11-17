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
        <header>
          <img [src]="g.icon" alt="" width="160" height="160" />
          <div>
            <h1>{{ 'games.items.' + g.slug + '.title' | transloco }}</h1>
            <p class="genre">{{ 'games.items.' + g.slug + '.genre' | transloco }}</p>
            <p>{{ 'games.items.' + g.slug + '.description' | transloco }}</p>
          </div>
        </header>
        <dl>
          <dt>{{ 'games.detail.status' | transloco }}</dt>
          <dd>{{ 'games.items.' + g.slug + '.status' | transloco }}</dd>
          <dt>{{ 'games.detail.platforms' | transloco }}</dt>
          <dd>{{ 'games.items.' + g.slug + '.platforms' | transloco }}</dd>
        </dl>
        <div class="text">
          <p>{{ 'games.items.' + g.slug + '.about' | transloco }}</p>
          @for (s of g.screenshots; track s) {
            <figure>
              <img [src]="s" [alt]="'games.detail.screenshotAlt' | transloco" width="1280" height="720" />
              <figcaption>{{ 'games.detail.screenshotCaption' | transloco }}</figcaption>
            </figure>
          }
          <p>{{ 'games.items.' + g.slug + '.p2' | transloco }}</p>
          <p>{{ 'games.items.' + g.slug + '.p3' | transloco }}</p>
        </div>
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
      } @else {
        <h1>{{ 'games.notFound' | transloco }}</h1>
      }
      <p>
        <a routerLink="/giochi">{{ 'games.back' | transloco }}</a>
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
    }
    .genre {
      margin: 0;
      color: var(--color-muted);
    }
    /* flow-root: il testo scorre attorno all'immagine e il titolo Download parte sotto di essa */
    .text {
      display: flow-root;
    }
    /* immagine nel testo, a destra, come in un articolo; a tutta larghezza su schermi stretti */
    figure {
      float: right;
      width: min(45%, 24rem);
      margin: var(--space-1) 0 var(--space-3) var(--space-4);
    }
    @media (max-width: 40rem) {
      figure {
        float: none;
        width: 100%;
        margin-inline: 0;
      }
    }
    figure img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      padding: 0;
      background: none;
      border-radius: var(--radius);
    }
    figcaption {
      margin-top: var(--space-1);
      font-size: 0.85rem;
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
  protected readonly game = computed(() => GAMES.find((g) => g.slug === this.slug()));
}
