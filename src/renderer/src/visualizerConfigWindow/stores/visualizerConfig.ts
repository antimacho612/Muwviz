import { defineStore } from 'pinia';
import { VisualizerConfig } from '@shared/visualizerTypes';

type VisualizerConfigStoreState = {
  visualizerConfig: VisualizerConfig[];
};

export const useVisualizerConfigStore = defineStore('visualizerConfig', {
  state: (): VisualizerConfigStoreState => {
    return {
      visualizerConfig: [],
    };
  },

  actions: {
    async fetch() {
      console.log('Fetching visualizer config...');
      this.visualizerConfig = await window.electron.invoke.getAllVisualizerConfig();
    },
  },
});
