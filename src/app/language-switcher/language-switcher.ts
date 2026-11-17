import { Component, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '../i18n/language.service';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslocoPipe],
  template: `
    <div role="group" [attr.aria-label]="'lang.label' | transloco">
      @for (l of lang.langs; track l) {
        <button type="button" [attr.aria-pressed]="l === transloco.getActiveLang()" (click)="lang.set(l)">
          {{ l.toUpperCase() }}
        </button>
      }
    </div>
  `,
  styles: `
    div {
      display: flex;
      gap: var(--space-1);
    }
    button {
      font: inherit;
      color: var(--color-muted);
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--space-1) var(--space-2);
      cursor: pointer;
    }
    button:hover {
      color: var(--color-text);
    }
    button[aria-pressed='true'] {
      color: var(--color-text);
      border-color: var(--color-coral);
    }
  `,
})
export class LanguageSwitcher {
  protected readonly lang = inject(LanguageService);
  protected readonly transloco = inject(TranslocoService);
}
