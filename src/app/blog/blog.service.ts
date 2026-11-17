import { Injectable } from '@angular/core';
import { ContentCollection } from '../content/content-collection';

/** I post: public/content/posts/<slug>/<lingua>.md (vedi docs/CONTENUTI.md) */
@Injectable({ providedIn: 'root' })
export class BlogService extends ContentCollection {
  constructor() {
    super('content/posts');
  }
}
