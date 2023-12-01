import { defineStore } from 'pinia';
import { useVisualizer } from '../core/visualizer';

type WindowStoreState = {
  isWindowMaximized: boolean;
  isLeftSidePaneCollapsed: boolean;
  visualizers: Map<number, ReturnType<typeof useVisualizer>>;
};

export const useWindowStore = defineStore('window', {
  state: (): WindowStoreState => {
    return {
      isWindowMaximized: true,
      isLeftSidePaneCollapsed: true,
      visualizers: new Map(),
    };
  },

  actions: {
    toggleLeftSidePaneCollapsed() {
      this.isLeftSidePaneCollapsed = !this.isLeftSidePaneCollapsed;
    },

    collapseLeftSidePane() {
      this.isLeftSidePaneCollapsed = true;
    },

    expandLeftSidePane() {
      this.isLeftSidePaneCollapsed = false;
    },
  },
});
