import { defineStore } from 'pinia';
import { AppearanceSettings, DEFAULT_SETTINGS } from '@shared/types';

type WindowStoreState = AppearanceSettings & {
  isAlwaysOnTop: boolean;
  currentVisualizerIndex: number;
};

export const useWindowStore = defineStore('window', {
  state: (): WindowStoreState => {
    return {
      isAlwaysOnTop: false,
      currentVisualizerIndex: 0,
      fontFamily: DEFAULT_SETTINGS.fontFamily,
      theme: DEFAULT_SETTINGS.theme,
      primaryColor: DEFAULT_SETTINGS.primaryColor,
    };
  },

  actions: {
    async fetch() {
      console.info('Fetching settings...');

      const [isAlwaysOnTop, settings] = await Promise.all([
        window.electron.invoke.isWindowAlwaysOnTop(false),
        window.electron.invoke.getSettings(),
      ]);

      this.isAlwaysOnTop = isAlwaysOnTop;
      this.fontFamily = settings.fontFamily;
      this.theme = settings.theme;
      this.primaryColor = settings.primaryColor;
    },
  },
});
