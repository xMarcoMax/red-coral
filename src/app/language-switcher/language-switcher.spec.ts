import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  it('il menu si apre dall\'icona, elenca le lingue e si chiude alla scelta', async () => {
    await TestBed.configureTestingModule({
      imports: [
        LanguageSwitcher,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, it: {} },
          translocoConfig: { availableLangs: ['en', 'it'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();
    const f = TestBed.createComponent(LanguageSwitcher);
    f.detectChanges();
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelector('ul')).toBeNull();

    el.querySelector<HTMLButtonElement>('.toggle')!.click();
    f.detectChanges();
    const items = el.querySelectorAll<HTMLButtonElement>('li button');
    expect([...items].map((b) => b.textContent!.trim())).toEqual(['English', 'Italiano']);

    items[1].click();
    f.detectChanges();
    expect(el.querySelector('ul')).toBeNull();
  });
});
