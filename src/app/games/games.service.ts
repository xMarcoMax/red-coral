import { Injectable } from '@angular/core';
import { ContentCollection } from '../content/content-collection';

/** I giochi: public/content/games/<slug>/<lingua>.md (vedi docs/CONTENUTI.md) */
@Injectable({ providedIn: 'root' })
export class GamesService extends ContentCollection {
  constructor() {
    super('content/games');
  }
}
