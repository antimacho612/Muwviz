import BaseJSONStore from './baseJsonStore';
import { sortArrayOfObjects } from '@shared/utils';
import { Song, SortOption } from '@shared/types';

export default class SongsStore extends BaseJSONStore<Song[]> {
  constructor(jsonPath: string) {
    super(jsonPath);
  }

  public getAll() {
    return this.cachedData ?? [];
  }

  public findById(songId: string) {
    return this.cachedData?.find((song) => song.id === songId);
  }

  public some(cb: (song: Song) => boolean) {
    return this.cachedData?.some(cb);
  }

  public add(song: Song) {
    if (this.cachedData) {
      this.cachedData.push(song);
    } else {
      this.cachedData = [song];
    }
  }

  public delete(songId: string) {
    const index = this.cachedData?.findIndex((song) => song.id === songId) ?? -1;
    if (index >= 0) this.cachedData?.splice(index, 1);
  }

  public sort(sortOptions: SortOption<Song>[]) {
    if (this.cachedData) {
      sortArrayOfObjects(this.cachedData, sortOptions);
    }
  }
}
