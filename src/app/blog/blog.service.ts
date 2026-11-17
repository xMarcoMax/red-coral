import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, of } from 'rxjs';
import { Lang } from '../i18n/language.service';

interface PostText {
  title: string;
  excerpt: string;
}

/** Riga di public/blog/index.json, generato da scripts/blog-index.mjs */
export interface PostMeta {
  slug: string;
  date: string;
  it?: PostText;
  en?: PostText;
}

/** Testo del post nella lingua attiva; se manca, nell'altra. */
export interface LocalizedPost extends PostText {
  slug: string;
  date: string;
  lang: Lang;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  /** null finché l'indice non è caricato; [] se non c'è o non si legge. */
  private readonly index = toSignal(
    this.http.get<PostMeta[]>('blog/index.json', { cache: 'no-cache' }).pipe(catchError(() => of([] as PostMeta[]))),
    { initialValue: null },
  );

  readonly loaded = computed(() => this.index() !== null);

  readonly posts = computed<LocalizedPost[]>(() => {
    const first: Lang = this.activeLang() === 'it' ? 'it' : 'en';
    const second: Lang = first === 'it' ? 'en' : 'it';
    return (this.index() ?? []).flatMap((p) => {
      const lang = p[first] ? first : second;
      const text = p[lang];
      return text ? [{ slug: p.slug, date: p.date, lang, ...text }] : [];
    });
  });
}
