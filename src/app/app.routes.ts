import { Routes } from '@angular/router';
import { About } from './about/about';
import { Blog } from './blog/blog';
import { BlogPost } from './blog/blog-post';
import { GameDetail } from './games/game-detail';
import { Games } from './games/games';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'games', component: Games },
  { path: 'games/:slug', component: GameDetail },
  { path: 'blog', component: Blog },
  { path: 'blog/:slug', component: BlogPost },
  { path: 'about-us', component: About },
  { path: '**', redirectTo: '' },
];
