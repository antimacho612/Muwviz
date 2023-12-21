import { defineStore } from 'pinia';
import { VisualizerConfig } from '@shared/visualizerTypes';

type VisualizerConfigStoreState = {
  visualizerConfig: VisualizerConfig[];
};

export const useVisualizerConfigStore = defineStore('visualizerConfig', {
  state: (): VisualizerConfigStoreState => ({
    visualizerConfig: [],
  }),

  actions: {
    async fetch() {
      console.info('Fetching visualizer config...');
      this.visualizerConfig = await window.electron.invoke.getAllVisualizerConfig();
    },
  },
});
