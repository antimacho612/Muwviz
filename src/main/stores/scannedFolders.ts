import { ScannedFolder } from '@shared/types';
import BaseJSONStore from './baseJsonStore';

export default class ScannedFoldersStore extends BaseJSONStore<ScannedFolder[]> {
  constructor(jsonPath: string) {
    super(jsonPath);
  }

  public add(scannedFolder: ScannedFolder) {
    if (this.cachedData) {
      this.cachedData.push(scannedFolder);
    } else {
      this.cachedData = [scannedFolder];
    }
  }
}
