import BaseJSONStore from './baseJsonStore';
import { LyricsMap } from '@shared/types';

export default class LyricsStore extends BaseJSONStore<LyricsMap> {
  constructor(jsonPath: string) {
    console.debug('Initializing lyrics store...');
    super(jsonPath);
  }
}
