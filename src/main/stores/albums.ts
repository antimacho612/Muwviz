import BaseJSONStore from './baseJsonStore';
import { Album } from '@shared/types';

export default class SongsStore extends BaseJSONStore<Album[]> {
  constructor(jsonPath: string) {
    console.debug('Initializing albums store...');
    super(jsonPath);
  }
}
