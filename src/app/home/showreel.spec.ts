import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { afterEach, beforeEach, vi } from 'vitest';
import { ContentItem } from '../content/content-collection';
import { Showreel } from './showreel';

const item = (slug: string): ContentItem => ({
  slug,
  lang: 'it',
  title: 'Titolo ' + slug,
  excerpt: 'Testo ' + slug,
  downloads: [],
});

describe('Showreel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [
        Showreel,
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter([])],
    });
  });
  afterEach(() => vi.useRealTimers());

  function create(items: ContentItem[]) {
    const f = TestBed.createComponent(Showreel);
    f.componentRef.setInput('heading', 'Ultimi post');
    f.componentRef.setInput('basePath', '/blog');
    f.componentRef.setInput('items', items);
    f.detectChanges();
    return f;
  }
  const state = (f: ReturnType<typeof create>) =>
    [...f.nativeElement.querySelectorAll('.card')].map((c: HTMLElement) => c.className.replace('card ', '').trim());

  it('mostra al massimo 3 schede e riempie i posti mancanti con schede vuote', () => {
    const f = create([item('a'), item('b'), item('c'), item('d')]);
    expect(f.nativeElement.querySelectorAll('a.card').length).toBe(3);

    const g = create([item('a')]);
    const el: HTMLElement = g.nativeElement;
    expect(el.querySelectorAll('a.card').length).toBe(1);
    expect(el.querySelectorAll('.card.placeholder').length).toBe(2);
    expect(el.querySelector('a.card')!.getAttribute('href')).toBe('/blog/a');
    expect(el.querySelector('h2')!.textContent).toBe('Ultimi post');
  });

  it('frecce e puntini cambiano scheda; le schede nascoste non si raggiungono', () => {
    const f = create([item('a'), item('b'), item('c')]);
    const el: HTMLElement = f.nativeElement;
    expect(state(f)).toEqual(['active', 'after', 'before']);

    (el.querySelectorAll('.controls > button')[1] as HTMLElement).click(); // successiva
    f.detectChanges();
    expect(state(f)).toEqual(['before', 'active', 'after']);
    expect(el.querySelectorAll('.card')[0].hasAttribute('inert')).toBe(true);
    expect(el.querySelectorAll('.card')[1].hasAttribute('inert')).toBe(false);

    (el.querySelectorAll('.dot')[2] as HTMLElement).click();
    f.detectChanges();
    expect(state(f)).toEqual(['after', 'before', 'active']);
  });

  it('passa da sola alla scheda successiva e si ferma con il mouse', () => {
    const f = create([item('a'), item('b'), item('c')]);
    const el: HTMLElement = f.nativeElement;

    vi.advanceTimersByTime(6000);
    TestBed.tick();
    f.detectChanges();
    expect(state(f)[1]).toBe('active');

    el.querySelector('section')!.dispatchEvent(new Event('pointerenter'));
    f.detectChanges();
    TestBed.tick();
    vi.advanceTimersByTime(20000);
    TestBed.tick();
    f.detectChanges();
    expect(state(f)[1]).toBe('active'); // ferma

    el.querySelector('section')!.dispatchEvent(new Event('pointerleave'));
    f.detectChanges();
    TestBed.tick();
    vi.advanceTimersByTime(6000);
    TestBed.tick();
    f.detectChanges();
    expect(state(f)[2]).toBe('active');
  });
});
