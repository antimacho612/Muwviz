import BaseJSONStore from './baseJsonStore';
import { Song } from '@shared/types';

export default class SongsStore extends BaseJSONStore<Song[]> {
  constructor(jsonPath: string) {
    console.debug('Initializing songs store...');
    super(jsonPath);
  }
}
