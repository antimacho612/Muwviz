import { defineStore } from 'pinia';
import visualizer from '../core/visualizer';
import { KeyValue } from '@shared/types';
import { VisualizerOptions } from '@shared/visualizerTypes';

type Visualizer = {
  instance: ReturnType<typeof visualizer> | undefined;
  isOn: boolean;
  backgroundColor: string;
};
type VisualizersStoreState = {
  visualizers: [Visualizer, Visualizer, Visualizer];
};

export const useVisualizersStore = defineStore('visualizers', {
  state: (): VisualizersStoreState => ({
    visualizers: [
      { instance: undefined, isOn: true, backgroundColor: '' },
      { instance: undefined, isOn: true, backgroundColor: '' },
      { instance: undefined, isOn: true, backgroundColor: '' },
    ],
  }),

  actions: {
    changeVisualizerProperty(index: number, keyValuePair: KeyValue<VisualizerOptions>) {
      const visualizer = this.visualizers[index];
      if (visualizer.instance) visualizer.instance.changeProperty(keyValuePair);
    },

    toggleVisualizer(index: number, isOn: boolean) {
      const visualizer = this.visualizers[index];
      if (visualizer.instance) {
        visualizer.instance.toggle(isOn);
        visualizer.isOn = isOn;
      }
    },

    changeBackgroundColor(index: number, color: string) {
      const visualizer = this.visualizers[index];
      if (visualizer) {
        visualizer.backgroundColor = color;
      }
    },
  },
});
