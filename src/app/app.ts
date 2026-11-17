import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from './language-switcher/language-switcher';

@Component({
  imports: [RouterOutlet, RouterLink, LanguageSwitcher],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly year = new Date().getFullYear();
}
