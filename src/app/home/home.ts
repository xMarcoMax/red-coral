import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <main class="container">
      <h1>Red Coral</h1>
      <p>Sito in costruzione.</p>
    </main>
  `,
  styles: `
    main {
      padding-block: var(--space-5);
    }
    h1 {
      color: var(--color-coral);
    }
  `,
})
export class Home {}
