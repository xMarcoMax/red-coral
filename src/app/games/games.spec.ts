import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { GameDetail } from './game-detail';
import { Games } from './games';

const text = (title: string) => ({
  title,
  excerpt: 'Desc ' + title,
  genre: 'Genre ' + title,
  status: 'Status',
  platforms: 'Windows',
});
const index = [
  {
    slug: 'g1',
    icon: 'icon.png',
    downloads: [{ label: 'Test Download', file: 'downloads/test.txt' }],
    it: text('Titolo'),
    en: text('Title'),
  },
];

// httpResource consegna il valore in modo asincrono: un giro di eventi e poi un tick
const settle = async () => {
  await new Promise((r) => setTimeout(r));
  TestBed.tick();
};

describe('Games', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        Games,
        GameDetail,
        TranslocoTestingModule.forRoot({
          langs: { it: { games: { notFound: 'Non trovato' } }, en: {} },
          translocoConfig: { availableLangs: ['it', 'en'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter([]), provideHttpClient(withFetch()), provideHttpClientTesting()],
    }),
  );

  it("l'elenco mostra titolo, descrizione e genere e segue la lingua", () => {
    const f = TestBed.createComponent(Games);
    f.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('content/games/index.json').flush(index);
    f.detectChanges();

    const row: HTMLElement = f.nativeElement.querySelector('a.row');
    expect(row.getAttribute('href')).toBe('/games/g1');
    expect(row.querySelector('h2')!.textContent).toBe('Titolo');
    expect(row.querySelector('.description')!.textContent).toBe('Desc Titolo');
    expect(row.querySelector('.genre')!.textContent).toContain('Genre Titolo');
    expect(row.querySelector('img')!.getAttribute('src')).toBe('content/games/g1/icon.png');

    TestBed.inject(TranslocoService).setActiveLang('en');
    f.detectChanges();
    expect(f.nativeElement.querySelector('a.row h2').textContent).toBe('Title');
  });

  it('la pagina del gioco mostra dati, testo e download', async () => {
    const http = TestBed.inject(HttpTestingController);
    const f = TestBed.createComponent(GameDetail);
    f.componentRef.setInput('slug', 'g1');
    f.detectChanges();
    http.expectOne('content/games/index.json').flush(index);
    f.detectChanges();
    TestBed.tick();

    http.expectOne('content/games/g1/it.md').flush('---\ntitle: Titolo\n---\nPrima\n\n![Didascalia](shot.svg "right")\n\nDopo');
    await settle();
    f.detectChanges();

    const el: HTMLElement = f.nativeElement;
    expect(el.querySelector('h1')!.textContent).toBe('Titolo');
    const body = el.querySelector('.content-body')!;
    expect([...body.children].map((c) => c.tagName)).toEqual(['P', 'FIGURE', 'P']);
    expect(body.querySelector('img')!.getAttribute('src')).toBe('content/games/g1/shot.svg');
    expect(body.querySelector('figcaption')!.textContent).toBe('Didascalia');
    expect(el.querySelector('a[download]')!.getAttribute('href')).toBe('downloads/test.txt');
  });

  it('gioco inesistente: messaggio solo dopo il caricamento', () => {
    const f = TestBed.createComponent(GameDetail);
    f.componentRef.setInput('slug', 'nope');
    f.detectChanges();
    expect(f.nativeElement.querySelector('h1')).toBeNull();
    TestBed.inject(HttpTestingController).expectOne('content/games/index.json').flush(index);
    f.detectChanges();
    expect(f.nativeElement.querySelector('h1').textContent).toBe('Non trovato');
  });
});
