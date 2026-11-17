import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

// URL relativo: rispetta il base href (/red-coral/ su GitHub Pages).
// cache 'no-cache': Pages serve i file con max-age=600, senza rivalidare si vedrebbero
// traduzioni vecchie dopo un deploy (serve withFetch).
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`i18n/${lang}.json`, { cache: 'no-cache' });
  }
}
