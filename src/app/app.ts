import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguageSwitcher } from './language-switcher/language-switcher';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LanguageSwitcher, TranslocoPipe],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly year = new Date().getFullYear();
}
