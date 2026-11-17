import { Routes } from '@angular/router';
import { About } from './about/about';
import { GameDetail } from './games/game-detail';
import { Games } from './games/games';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'giochi', component: Games },
  { path: 'giochi/:slug', component: GameDetail },
  { path: 'chi-siamo', component: About },
  { path: '**', redirectTo: '' },
];
