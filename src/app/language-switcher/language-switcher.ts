import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Lang, LanguageService } from '../i18n/language.service';

// Nomi nella loro lingua: chi non capisce la lingua attiva riconosce comunque la propria
const NAMES: Record<Lang, string> = { en: 'English', it: 'Italiano' };

@Component({
  selector: 'app-language-switcher',
  imports: [TranslocoPipe],
  template: `
    <button
      type="button"
      class="toggle"
      aria-haspopup="true"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="'lang.label' | transloco"
      (click)="open.set(!open())"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M4.5 7.5h15M4.5 16.5h15" />
      </svg>
    </button>
    @if (open()) {
      <ul>
        @for (l of lang.langs; track l) {
          <li>
            <button type="button" [attr.aria-current]="l === active() ? 'true' : null" (click)="choose(l)">
              {{ names[l] }}
            </button>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    :host {
      position: relative;
    }
    button {
      font: inherit;
      color: var(--color-muted);
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      cursor: pointer;
      &:hover {
        color: var(--color-text);
      }
    }
    .toggle {
      display: flex;
      padding: var(--space-2);
    }
    ul {
      position: absolute;
      right: 0;
      top: calc(100% + var(--space-1));
      z-index: 10;
      margin: 0;
      padding: var(--space-1);
      list-style: none;
      min-width: 8rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
    }
    li button {
      width: 100%;
      text-align: left;
      border: 0;
      padding: var(--space-2) var(--space-3);
    }
    li button[aria-current='true'] {
      color: var(--color-text);
      box-shadow: inset 2px 0 var(--color-coral);
    }
  `,
})
export class LanguageSwitcher {
  protected readonly lang = inject(LanguageService);
  private readonly transloco = inject(TranslocoService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly names = NAMES;
  protected readonly open = signal(false);
  protected readonly active = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected choose(l: Lang) {
    this.lang.set(l);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(e: Event) {
    if (!this.host.nativeElement.contains(e.target as Node)) this.open.set(false);
  }

  @HostListener('keydown.escape')
  protected onEscape() {
    this.open.set(false);
  }
}
