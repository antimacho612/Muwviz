import { defineStore } from 'pinia';
import { VisualizerConfig } from '@shared/visualizerTypes';

type VisualizersConfigStoreState = {
  configs: VisualizerConfig[];
};

export const useVisualizersConfigStore = defineStore('visualizersConfig', {
  state: (): VisualizersConfigStoreState => ({
    configs: [],
  }),

  actions: {
    async fetch() {
      console.info('Fetching visualizer config...');
      this.configs = await window.electron.invoke.getAllVisualizersConfig();
    },
  },
});
