import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BlogService } from '../blog/blog.service';
import { GamesService } from '../games/games.service';
import { Showreel } from './showreel';

@Component({
  selector: 'app-home',
  imports: [TranslocoPipe, Showreel],
  template: `
    <main class="container">
      <h1>Red Coral</h1>
      <p class="tagline">{{ 'home.tagline' | transloco }}</p>
      <app-showreel [heading]="'home.latestGames' | transloco" basePath="/games" [items]="games()" />
      <app-showreel [heading]="'home.latestPosts' | transloco" basePath="/blog" [items]="posts()" />
    </main>
  `,
  styles: `
    h1 {
      margin-bottom: var(--space-2);
      font-family: var(--font-brand);
      font-weight: 400;
      color: var(--color-coral);
    }
    .tagline {
      margin: 0;
      color: var(--color-muted);
    }
  `,
})
export class Home {
  // gli indici sono già ordinati dal più recente (campo date)
  protected readonly games = inject(GamesService).items;
  protected readonly posts = inject(BlogService).items;
}
