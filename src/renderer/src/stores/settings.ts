import { KeyValue, ScannedFolder, Settings } from '@shared/types';
import { defineStore } from 'pinia';

export type SettingsStoreState = {
  scannedFolders: ScannedFolder[];
  artworkPath: string;
  fontFamily: string;
  theme: 'Light' | 'Dark';
  primaryColor: string;
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStoreState => {
    return {
      scannedFolders: [],
      artworkPath: '',
      fontFamily: '',
      theme: 'Light',
      primaryColor: '#7c3aed',
    };
  },

  actions: {
    async fetch() {
      console.debug('Fetching settings...');

      const [artworkPath, scannedFolders, settings] = await Promise.all([
        window.electronAPI.invoke.getArtworkPath(),
        window.electronAPI.invoke.getScannedFolders(),
        window.electronAPI.invoke.getSettings(),
      ]);

      this.scannedFolders = scannedFolders ?? [];
      this.artworkPath = artworkPath;
      this.fontFamily = settings.fontFamily;
      this.theme = settings.theme;
      this.primaryColor = settings.primaryColor;
    },

    async saveChanges(keys: Set<keyof Settings>) {
      const state = this.$state;
      const items: KeyValue<Omit<Settings, 'scannedFolders'>>[] = [];
      keys.forEach((key) => {
        switch (key) {
          case 'fontFamily':
            items.push({ key, value: state.fontFamily });
            break;
          case 'primaryColor':
            items.push({ key, value: state.primaryColor });
            break;
          case 'theme':
            items.push({ key, value: state.theme });
            break;
          default:
            throw new Error();
        }
      });

      await window.electronAPI.invoke.updateSettings(items);
    },
  },
});
