import BaseJSONStore from './baseJsonStore';
import { sortArrayOfObjects } from '@shared/utils';
import { Album, SortOption } from '@shared/types';

export default class AlbumsStore extends BaseJSONStore<Album[]> {
  constructor(jsonPath: string) {
    super(jsonPath);
  }

  public getAll() {
    return this.cachedData ?? [];
  }

  public findById(id: string) {
    return this.cachedData?.find((album) => album.id === id);
  }

  public findByTitle(title: string) {
    return this.cachedData?.find((album) => album.title === title);
  }

  public add(album: Album) {
    if (this.cachedData) {
      this.cachedData.push(album);
    } else {
      this.cachedData = [album];
    }
  }

  public delete(id: string) {
    const index = this.cachedData?.findIndex((album) => album.id === id) ?? -1;
    if (index >= 0) this.cachedData?.splice(index, 1);
  }

  public sort(sortOptions: SortOption<Album>[]) {
    if (this.cachedData) {
      sortArrayOfObjects(this.cachedData, sortOptions);
    }
  }
}
