import BaseJSONStore from './baseJsonStore';
import { sortArrayOfObjects } from '@shared/utils';
import { Artist, SortOption } from '@shared/types';

export default class ArtistsStore extends BaseJSONStore<Artist[]> {
  constructor(jsonPath: string) {
    super(jsonPath);
  }

  public getAll() {
    return this.cachedData ?? [];
  }

  public findById(artistId: string) {
    return this.cachedData?.find((artist) => artist.id === artistId);
  }

  public findByName(name: string) {
    return this.cachedData?.find((artist) => artist.name === name);
  }

  public add(artist: Artist) {
    if (this.cachedData) {
      this.cachedData.push(artist);
    } else {
      this.cachedData = [artist];
    }
  }

  public delete(artistId: string) {
    const index = this.cachedData?.findIndex((artist) => artist.id === artistId) ?? -1;
    if (index >= 0) this.cachedData?.splice(index, 1);
  }

  public sort(sortOptions: SortOption<Artist>[]) {
    if (this.cachedData) {
      sortArrayOfObjects(this.cachedData, sortOptions);
    }
  }
}
