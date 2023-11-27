import BaseJSONStore from './baseJsonStore';
import { Lyrics } from '@shared/types';

export default class LyricsStore extends BaseJSONStore<Lyrics> {
  constructor(jsonPath: string) {
    super(jsonPath);
  }

  public add(songId: string, lyrics: string) {
    if (this.cachedData) {
      this.cachedData[songId] = lyrics;
    } else {
      this.cachedData = { songId: lyrics };
    }
  }

  public delete(songId: string) {
    if (this.cachedData) delete this.cachedData[songId];
  }
}
