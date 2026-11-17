import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { GameDetail } from './game-detail';
import { Games } from './games';

const en = {
  games: {
    title: 'Games',
    notFound: 'Game not found',
    detail: { downloads: 'Downloads' },
    items: { 'game-template': { title: 'Template', description: 'Short text', genre: 'Adventure' } },
  },
};
const transloco = TranslocoTestingModule.forRoot({
  langs: { en },
  translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
});

describe('Games', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [transloco], providers: [provideRouter([])] }),
  );

  it("l'elenco ha una riga per gioco con titolo, descrizione e genere, e collega alla sua pagina", () => {
    const f = TestBed.createComponent(Games);
    f.detectChanges();
    const a: HTMLAnchorElement = f.nativeElement.querySelector('a.row');
    expect(a.getAttribute('href')).toBe('/giochi/game-template');
    expect(a.querySelector('h2')!.textContent).toBe('Template');
    expect(a.querySelector('p')!.textContent).toContain('Short text');
    expect(a.querySelector('p')!.textContent).toContain('Adventure');
  });

  it('la pagina gioco mostra titolo e download, o "non trovato" se lo slug non esiste', () => {
    const ok = TestBed.createComponent(GameDetail);
    ok.componentRef.setInput('slug', 'game-template');
    ok.detectChanges();
    expect(ok.nativeElement.querySelector('h1').textContent).toContain('Template');
    expect(ok.nativeElement.querySelector('ul a').getAttribute('href')).toBe('downloads/test-download.txt');

    const ko = TestBed.createComponent(GameDetail);
    ko.componentRef.setInput('slug', 'boh');
    ko.detectChanges();
    expect(ko.nativeElement.querySelector('h1').textContent).toContain('Game not found');
  });
});
