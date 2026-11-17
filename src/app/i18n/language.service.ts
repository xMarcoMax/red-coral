import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';

export const LANGS = ['en', 'it'] as const;
export type Lang = (typeof LANGS)[number];

const STORAGE_KEY = 'lang';

const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);

/** Scelta salvata, altrimenti lingua del browser se it/en, altrimenti inglese. */
export function pickLang(stored: string | null, browserLang: string | undefined): Lang {
  if (isLang(stored)) return stored;
  const code = browserLang?.slice(0, 2).toLowerCase();
  return isLang(code) ? code : 'en';
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  readonly langs = LANGS;

  /** Da chiamare all'avvio: carica la lingua prima del primo render. */
  init(): Promise<unknown> {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage bloccato (navigazione privata): si ripiega sulla lingua del browser
    }
    return this.apply(pickLang(stored, navigator.language));
  }

  set(lang: Lang): Promise<unknown> {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // la scelta vale solo per la sessione
    }
    return this.apply(lang);
  }

  private apply(lang: Lang) {
    this.transloco.setActiveLang(lang);
    document.documentElement.lang = lang;
    return firstValueFrom(this.transloco.load(lang));
  }
}
