import { pickLang } from './language.service';

describe('pickLang', () => {
  it('usa la scelta salvata se valida', () => {
    expect(pickLang('it', 'en-US')).toBe('it');
  });
  it('ignora una scelta salvata non valida', () => {
    expect(pickLang('xx', 'it-IT')).toBe('it');
  });
  it('segue la lingua del browser se it o en', () => {
    expect(pickLang(null, 'it-IT')).toBe('it');
    expect(pickLang(null, 'en-GB')).toBe('en');
  });
  it("ripiega sull'inglese per le altre lingue", () => {
    expect(pickLang(null, 'fr-FR')).toBe('en');
    expect(pickLang(null, undefined)).toBe('en');
  });
});
