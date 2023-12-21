import { defineStore } from 'pinia';
import visualizer from '../core/visualizer';
import { KeyValue } from '@shared/types';
import { VisualizerOptions } from '@shared/visualizerTypes';

type WindowStoreState = {
  isWindowMaximized: boolean;
  isLeftSidePaneCollapsed: boolean;
  visualizers: Map<number, ReturnType<typeof visualizer>>;
  visualizersIsOn: [boolean, boolean, boolean];
};

export const useWindowStore = defineStore('window', {
  state: (): WindowStoreState => {
    return {
      isWindowMaximized: true,
      isLeftSidePaneCollapsed: true,
      visualizers: new Map(),
      visualizersIsOn: [true, true, true],
    };
  },

  actions: {
    async fetch() {
      this.isWindowMaximized = await window.electron.invoke.isWindowMaximized(true);
    },

    toggleLeftSidePaneCollapsed() {
      this.isLeftSidePaneCollapsed = !this.isLeftSidePaneCollapsed;
    },

    collapseLeftSidePane() {
      this.isLeftSidePaneCollapsed = true;
    },

    expandLeftSidePane() {
      this.isLeftSidePaneCollapsed = false;
    },

    changeVisualizerProperty(index: number, keyValuePair: KeyValue<VisualizerOptions>) {
      const visualizer = this.visualizers.get(index);
      if (visualizer) visualizer.changeProperty(keyValuePair);
    },

    toggleVisualizer(index: number, isOn: boolean) {
      const target = this.visualizers.get(index);
      if (target) {
        target.toggle(isOn);
        this.visualizersIsOn[index] = isOn;
      }
    },
  },
});
