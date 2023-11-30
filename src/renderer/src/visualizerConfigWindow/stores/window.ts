import { defineStore } from 'pinia';
import { DEFAULT_SETTINGS } from '@shared/types';

type WindowStoreState = {
  isWindowMaximized: boolean;
  fontFamily: string;
  theme: 'Light' | 'Dark';
  primaryColor: string;
};

export const useWindowStore = defineStore('window', {
  state: (): WindowStoreState => {
    return {
      isWindowMaximized: false,
      fontFamily: DEFAULT_SETTINGS.fontFamily,
      theme: DEFAULT_SETTINGS.theme,
      primaryColor: DEFAULT_SETTINGS.primaryColor,
    };
  },

  actions: {
    async fetch() {
      console.log('Fetching settings...');

      const [settings] = await Promise.all([window.electronAPI.invoke.getSettings()]);

      this.fontFamily = settings.fontFamily;
      this.theme = settings.theme;
      this.primaryColor = settings.primaryColor;
    },
  },
});
