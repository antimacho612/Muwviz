import { defineStore } from 'pinia';
import { AppearanceSettings, DEFAULT_SETTINGS } from '@shared/types';

type WindowStoreState = AppearanceSettings & { currentVisualizerIndex: number };

export const useWindowStore = defineStore('window', {
  state: (): WindowStoreState => {
    return {
      currentVisualizerIndex: 0,
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
