import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-home',
  imports: [TranslocoPipe],
  template: `
    <main class="container">
      <h1>Red Coral</h1>
      <p>{{ 'home.soon' | transloco }}</p>
    </main>
  `,
  styles: `
    main {
      padding-block: var(--space-5);
    }
    h1 {
      font-family: var(--font-brand);
      font-weight: 400;
      color: var(--color-coral);
    }
  `,
})
export class Home {}
