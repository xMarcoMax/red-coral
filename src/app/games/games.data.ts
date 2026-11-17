export interface Game {
  slug: string;
}

// I testi di ogni gioco stanno in public/i18n/*.json sotto games.items.<slug>
export const GAMES: Game[] = [{ slug: 'game-template' }];
