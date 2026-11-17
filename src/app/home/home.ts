import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <main>
      <h1>Red Coral</h1>
      <p>Sito in costruzione.</p>
    </main>
  `,
  styles: `
    main {
      min-height: 100vh;
      display: grid;
      place-content: center;
      text-align: center;
      font-family: system-ui, sans-serif;
    }
    h1 {
      color: #e8473f;
    }
  `,
})
export class Home {}
