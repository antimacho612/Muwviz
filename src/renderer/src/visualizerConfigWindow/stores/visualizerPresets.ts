import { defineStore } from 'pinia';
import { VISUALIZER_DEFAULT_PRESETS, VisualizerPreset } from '@shared/visualizerTypes';

type VisualizerPresetsStoreState = {
  presets: VisualizerPreset[];
};

export const useVisualizerPresetsStore = defineStore('visualizerPresets', {
  state: (): VisualizerPresetsStoreState => ({
    presets: [],
  }),

  actions: {
    async fetch() {
      this.presets = [];
      this.presets.push(...VISUALIZER_DEFAULT_PRESETS);

      console.info('Fetching visualizer presets...');
      const userPresets = await window.electron.invoke.getAllVisualizerPresets();
      this.presets.push(...userPresets);
    },

    async add(preset: VisualizerPreset) {
      await window.electron.invoke.addVisualizerPreset(preset);
      this.presets.push(preset);
    },

    async delete(id: string) {
      const target = this.presets.find((preset) => preset.id === id);
      if (!(target && target.canDelete)) return;

      await window.electron.invoke.deleteVisualizerPreset(id);
      this.presets = this.presets.filter((preset) => preset.id !== id);
    },
  },
});
