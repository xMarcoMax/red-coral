import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { BlogPost } from './blog-post';

const index = [
  { slug: 'p', date: '2026-05-02', it: { title: 'Titolo IT', excerpt: '' }, en: { title: 'Title EN', excerpt: '' } },
];

// httpResource consegna il valore in modo asincrono: un giro di eventi e poi un tick
const settle = async () => {
  await new Promise((r) => setTimeout(r));
  TestBed.tick();
};

describe('BlogPost', () => {
  it('cambiando lingua mostra titolo e testo dell\'altra lingua', async () => {
    TestBed.configureTestingModule({
      imports: [
        BlogPost,
        TranslocoTestingModule.forRoot({
          langs: { it: {}, en: {} },
          translocoConfig: { availableLangs: ['it', 'en'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter([]), provideHttpClient(withFetch()), provideHttpClientTesting()],
    });
    const http = TestBed.inject(HttpTestingController);
    const f = TestBed.createComponent(BlogPost);
    f.componentRef.setInput('slug', 'p');
    f.detectChanges();
    http.expectOne('content/posts/index.json').flush(index);
    f.detectChanges();
    TestBed.tick();

    http.expectOne('content/posts/p/it.md').flush('---\ntitle: Titolo IT\ndate: 2026-05-02\n---\nTesto italiano');
    await settle();
    f.detectChanges();
    expect(f.nativeElement.querySelector('h1').textContent).toBe('Titolo IT');
    expect(f.nativeElement.querySelector('.content-body').textContent).toContain('Testo italiano');

    TestBed.inject(TranslocoService).setActiveLang('en');
    f.detectChanges();
    TestBed.tick();
    http.expectOne('content/posts/p/en.md').flush('---\ntitle: Title EN\ndate: 2026-05-02\n---\nEnglish text');
    await settle();
    f.detectChanges();
    expect(f.nativeElement.querySelector('h1').textContent).toBe('Title EN');
    expect(f.nativeElement.querySelector('.content-body').textContent).toContain('English text');
  });
});
