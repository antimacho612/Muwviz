import { VisualizerConfig, getDefaultConfig } from '@shared/visualizerTypes';
import { defineStore } from 'pinia';

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
      this.visualizerConfig = await window.electronAPI.invoke.getAllVisualizerConfig();
    },
  },
});
