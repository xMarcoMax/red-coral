export interface Download {
  label: string;
  /** Percorso relativo (rispetta il base href); in futuro il link a una GitHub Release */
  file: string;
}

export interface Game {
  slug: string;
  /** Percorso relativo a public/ */
  icon: string;
  downloads: Download[];
}

// I testi di ogni gioco stanno in public/i18n/*.json sotto games.items.<slug>
export const GAMES: Game[] = [
  {
    slug: 'game-template',
    icon: 'logo.png',
    downloads: [{ label: 'Test Download', file: 'downloads/test-download.txt' }],
  },
];
