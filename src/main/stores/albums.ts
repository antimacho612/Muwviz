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

  public findById(albumId: string) {
    return this.cachedData?.find((album) => album.id === albumId);
  }

  public findByName(albumName: string) {
    return this.cachedData?.find((album) => album.name === albumName);
  }

  public add(album: Album) {
    if (this.cachedData) {
      this.cachedData.push(album);
    } else {
      this.cachedData = [album];
    }
  }

  public delete(albumId: string) {
    const index = this.cachedData?.findIndex((album) => album.id === albumId) ?? -1;
    if (index >= 0) this.cachedData?.splice(index, 1);
  }

  public sort(sortOptions: SortOption<Album>[]) {
    if (this.cachedData) {
      sortArrayOfObjects(this.cachedData, sortOptions);
    }
  }
}
