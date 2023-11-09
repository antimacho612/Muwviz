import BaseJSONStore from './baseJsonStore';
import { Artist } from '@shared/types';

export default class ArtistsStore extends BaseJSONStore<Artist[]> {
  constructor(jsonPath: string) {
    console.debug('Initializing artists store...');
    super(jsonPath);
  }
}
