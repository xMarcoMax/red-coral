import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { Blog } from './blog';

const index = [
  { slug: 'nuovo', date: '2026-05-02', it: { title: 'Titolo IT', excerpt: 'Inizio del testo' }, en: { title: 'Title EN', excerpt: 'Start' } },
  { slug: 'solo-en', date: '2026-01-01', en: { title: 'Only English', excerpt: 'Hello' } },
];

describe('Blog', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        Blog,
        TranslocoTestingModule.forRoot({
          langs: { it: { blog: { empty: 'Vuoto' } }, en: {} },
          translocoConfig: { availableLangs: ['it', 'en'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter([]), provideHttpClient(withFetch()), provideHttpClientTesting()],
    }),
  );

  it("elenca i post con titolo e inizio del testo, e usa l'altra lingua se manca", () => {
    const f = TestBed.createComponent(Blog);
    f.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('blog/index.json').flush(index);
    f.detectChanges();

    const rows: HTMLElement[] = [...f.nativeElement.querySelectorAll('a.row')];
    expect(rows.map((r) => r.querySelector('h2')!.textContent)).toEqual(['Titolo IT', 'Only English']);
    expect(rows[0].getAttribute('href')).toBe('/blog/nuovo');
    expect(rows[0].querySelector('p')!.textContent).toBe('Inizio del testo');

    TestBed.inject(TranslocoService).setActiveLang('en');
    f.detectChanges();
    expect(f.nativeElement.querySelector('a.row h2').textContent).toBe('Title EN');
  });

  it("mostra un messaggio quando non c'è nessun post", () => {
    const f = TestBed.createComponent(Blog);
    f.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('blog/index.json').flush([]);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Vuoto');
  });
});
