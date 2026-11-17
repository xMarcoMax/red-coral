import { Component, computed, effect, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContentItem } from '../content/content-collection';

/** Quanti contenuti mostra al massimo, e quanti posti ci sono (i mancanti sono schede vuote) */
const SLOTS = 3;
const INTERVAL_MS = 5500;

/**
 * Showreel: mostra gli ultimi contenuti uno alla volta e passa al successivo con una dissolvenza
 * verso sinistra. Si ferma con il mouse, il tocco o il focus; frecce e puntini scorrono a mano.
 */
@Component({
  selector: 'app-showreel',
  imports: [RouterLink, TranslocoPipe],
  template: `
    <section
      class="showreel"
      aria-roledescription="carousel"
      [attr.aria-labelledby]="headingId()"
      (pointerenter)="hovered.set(true)"
      (pointerleave)="hovered.set(false)"
      (focusin)="focused.set(true)"
      (focusout)="focused.set(false)"
    >
      <h2 [id]="headingId()">{{ heading() }}</h2>
      <div class="stage">
        @for (slot of slots(); track $index) {
          @if (slot) {
            <a class="card" [class]="state($index)" [attr.inert]="inert($index)" [routerLink]="[basePath(), slot.slug]">
              @if (slot.icon) {
                <img class="icon" [src]="slot.icon" alt="" width="112" height="112" />
              }
              <div class="text">
                <h3>{{ slot.title }}</h3>
                @if (slot.genre) {
                  <p class="genre">{{ slot.genre }}</p>
                }
                <p class="excerpt">{{ slot.excerpt }}</p>
              </div>
            </a>
          } @else {
            <div class="card placeholder" [class]="state($index)" [attr.inert]="inert($index)" aria-hidden="true">
              <img src="images/placeholder.svg" alt="" width="1280" height="720" />
            </div>
          }
        }
      </div>
      <div class="controls">
        <button type="button" (click)="step(-1)" [attr.aria-label]="'home.prev' | transloco">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div class="dots">
          @for (slot of slots(); track $index) {
            <button
              type="button"
              class="dot"
              [class.on]="$index === active()"
              [attr.aria-label]="('home.goTo' | transloco) + ' ' + ($index + 1)"
              [attr.aria-current]="$index === active() ? 'true' : null"
              (click)="go($index)"
            ></button>
          }
        </div>
        <button type="button" (click)="step(1)" [attr.aria-label]="'home.next' | transloco">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  `,
  styles: `
    .showreel {
      margin-block: var(--space-5);
    }
    h2 {
      margin: 0 0 var(--space-3);
    }
    /* tutte le schede nella stessa cella: l'altezza è quella della più alta; overflow nasconde lo scorrimento laterale */
    .stage {
      display: grid;
      overflow: hidden;
    }
    .card {
      grid-area: 1 / 1;
      display: flex;
      align-items: center;
      gap: var(--space-4);
      min-height: 9rem;
      padding: var(--space-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      color: var(--color-text);
      text-decoration: none;
      opacity: 0;
      visibility: hidden;
      transform: translateX(3rem);
      transition:
        opacity 0.6s ease,
        transform 0.6s ease,
        visibility 0s 0.6s;
      &.before {
        transform: translateX(-3rem);
      }
      &.active {
        opacity: 1;
        visibility: visible;
        transform: none;
        transition-delay: 0s;
      }
    }
    a.card:hover {
      border-color: var(--color-coral);
    }
    a.card:focus-visible {
      outline-offset: -3px;
    }
    .placeholder {
      justify-content: center;
    }
    .placeholder img {
      width: auto;
      max-width: 100%;
      height: 9rem;
      border-radius: var(--radius);
    }
    .icon {
      flex: none;
      width: clamp(4.5rem, 18vw, 7rem);
      height: auto;
      aspect-ratio: 1;
      object-fit: contain;
      padding: var(--space-2);
      background: var(--color-bg);
      border-radius: var(--radius);
    }
    .text {
      min-width: 0;
    }
    h3 {
      margin: 0 0 var(--space-1);
      font-size: 1.25rem;
    }
    p {
      margin: 0;
      color: var(--color-muted);
    }
    .genre {
      margin-bottom: var(--space-1);
    }
    .excerpt {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      overflow: hidden;
    }
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      margin-top: var(--space-3);
    }
    button {
      display: grid;
      place-items: center;
      padding: 0;
      background: none;
      border: 0;
      color: var(--color-muted);
      cursor: pointer;
      &:hover {
        color: var(--color-coral);
      }
    }
    .controls > button {
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 1.5rem;
      height: 1.5rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .dots {
      display: flex;
      gap: var(--space-2);
    }
    .dot {
      width: 0.75rem;
      height: 0.75rem;
      background: var(--color-border);
      border-radius: 50%;
      &.on {
        background: var(--color-coral);
      }
    }
    @media (max-width: 40rem) {
      .card:not(.placeholder) {
        gap: var(--space-3);
        padding: var(--space-3);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none;
      }
    }
  `,
})
export class Showreel {
  readonly heading = input.required<string>();
  /** Pagina di ogni contenuto: '/games' o '/blog' */
  readonly basePath = input.required<string>();
  /** Dal più recente; ne servono al massimo SLOTS */
  readonly items = input.required<ContentItem[]>();

  protected readonly slots = computed<(ContentItem | null)[]>(() =>
    Array.from({ length: SLOTS }, (_, i) => this.items()[i] ?? null),
  );
  protected readonly active = signal(0);
  protected readonly hovered = signal(false);
  protected readonly focused = signal(false);
  protected readonly headingId = computed(() => `showreel-${this.basePath().replace(/\W/g, '')}`);

  // shortcut: letto una volta sola; chi cambia l'impostazione di sistema a pagina aperta se ne accorge al ricaricamento
  private readonly reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  constructor() {
    // un solo timer alla volta: ogni cambio di scheda, mouse o focus lo azzera e lo riarma
    effect((onCleanup) => {
      this.active();
      if (this.reducedMotion || this.hovered() || this.focused()) return;
      const timer = setTimeout(() => this.step(1), INTERVAL_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected step(by: number) {
    this.active.update((a) => (a + by + SLOTS) % SLOTS);
  }

  protected go(i: number) {
    this.active.set(i);
  }

  /** La scheda attiva è al centro; quella appena lasciata sta a sinistra, le altre a destra. */
  protected state(i: number): string {
    const offset = (i - this.active() + SLOTS) % SLOTS;
    return offset === 0 ? 'active' : offset === SLOTS - 1 ? 'before' : 'after';
  }

  /** Le schede nascoste non si raggiungono con la tastiera né con i lettori di schermo. */
  protected inert(i: number): string | null {
    return i === this.active() ? null : '';
  }
}
