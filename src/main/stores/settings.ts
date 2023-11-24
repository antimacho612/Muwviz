import BaseJSONStore from './baseJsonStore';
import { DEFAULT_SETTINGS, Settings } from '@shared/types';

export default class SettingsStore extends BaseJSONStore<Settings> {
  constructor(jsonPath: string) {
    console.log('Initializing settings store...');
    super(jsonPath);

    if (!this.data) {
      this.save(DEFAULT_SETTINGS);
    }
  }
}
