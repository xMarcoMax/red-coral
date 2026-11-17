import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { App } from './app';

describe('App', () => {
  it('crea il componente root', async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, it: {} },
          translocoConfig: { availableLangs: ['en', 'it'], defaultLang: 'en' },
        }),
      ],
      providers: [provideRouter([])],
    }).compileComponents();
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });
});
