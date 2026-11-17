import { HttpClient } from '@angular/common/http';
import { computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, of } from 'rxjs';
import { Lang } from '../i18n/language.service';

export interface Download {
  label: string;
  /** Percorso relativo a public/ (rispetta il base href) o indirizzo https:// (es. una GitHub Release) */
  file: string;
}

interface ItemText {
  title: string;
  excerpt: string;
  genre?: string;
  status?: string;
  platforms?: string;
}

/** Riga di public/<raccolta>/index.json, generato da scripts/content-index.mjs */
interface ItemMeta {
  slug: string;
  date?: string;
  icon?: string;
  downloads?: Download[];
  it?: ItemText;
  en?: ItemText;
}

/** Post o gioco nella lingua attiva; se manca, nell'altra. */
export interface ContentItem extends ItemText {
  slug: string;
  date?: string;
  lang: Lang;
  /** già completo: public/<raccolta>/<slug>/<icona> */
  icon?: string;
  downloads: Download[];
}

/** Elenco dei contenuti di una cartella di public/ ("posts", "games"): stessa logica per blog e giochi. */
export abstract class ContentCollection {
  /** null finché l'indice non è caricato; [] se non c'è o non si legge. */
  private readonly index: Signal<ItemMeta[] | null>;
  private readonly activeLang: Signal<string>;
  readonly loaded: Signal<boolean>;
  readonly items: Signal<ContentItem[]>;

  // tutto nel costruttore: serve il nome della cartella, e i campi di classe partono prima dei suoi parametri
  constructor(readonly folder: string) {
    const transloco = inject(TranslocoService);
    this.activeLang = toSignal(transloco.langChanges$, { initialValue: transloco.getActiveLang() });
    this.index = toSignal(
      inject(HttpClient)
        .get<ItemMeta[]>(`${folder}/index.json`, { cache: 'no-cache' })
        .pipe(catchError(() => of([] as ItemMeta[]))),
      { initialValue: null },
    );
    this.loaded = computed(() => this.index() !== null);
    this.items = computed(() => {
      const first: Lang = this.activeLang() === 'it' ? 'it' : 'en';
      const second: Lang = first === 'it' ? 'en' : 'it';
      return (this.index() ?? []).flatMap((m) => {
        const lang = m[first] ? first : second;
        const text = m[lang];
        if (!text) return [];
        const icon = m.icon && (/^(https?:|data:|\/)/.test(m.icon) ? m.icon : `${folder}/${m.slug}/${m.icon}`);
        return [{ ...text, slug: m.slug, date: m.date, lang, icon, downloads: m.downloads ?? [] }];
      });
    });
  }
}
