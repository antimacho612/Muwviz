import BaseJSONStore from './baseJsonStore';
import { DEFAULT_SETTINGS, Settings } from '@shared/types';

export default class SettingsStore extends BaseJSONStore<Settings> {
  constructor(jsonPath: string) {
    super(jsonPath);

    if (!this.cachedData) {
      this.save(DEFAULT_SETTINGS);
    }
  }

  public update<K extends keyof Omit<Settings, 'scannedFolders'>>(key: K, value: Settings[K]) {
    if (!this.cachedData) throw new Error();
    this.cachedData[key] = value;
  }
}
