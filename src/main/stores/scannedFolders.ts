import { ScannedFolder } from '@shared/types';
import BaseJSONStore from './baseJsonStore';

export default class ScannedFoldersStore extends BaseJSONStore<ScannedFolder[]> {
  constructor(jsonPath: string) {
    super(jsonPath);
  }

  public getAll() {
    return this.cachedData ?? [];
  }

  public findById(scanId: string) {
    return this.cachedData?.find((folder) => folder.id === scanId);
  }

  public findByPath(path: string) {
    return this.cachedData?.find(
      (folder) => folder.path.toLocaleLowerCase() === path.toLocaleLowerCase()
    );
  }

  public upsert(scannedFolder: ScannedFolder) {
    if (this.cachedData) {
      const found = this.findById(scannedFolder.id);
      if (found) {
        Object.assign(found, scannedFolder);
      } else {
        this.cachedData.push(scannedFolder);
      }
    } else {
      this.cachedData = [scannedFolder];
    }
  }

  public delete(scanId: string) {
    const index = this.cachedData?.findIndex((scannedFolder) => scannedFolder.id === scanId) ?? -1;
    if (index >= 0) this.cachedData?.splice(index, 1);
  }
}
