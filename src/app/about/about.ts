import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-about',
  imports: [TranslocoPipe],
  template: `
    <main class="container">
      <h1>{{ 'nav.about' | transloco }}</h1>
      <p>{{ 'about.wip' | transloco }}</p>
    </main>
  `,
})
export class About {}
