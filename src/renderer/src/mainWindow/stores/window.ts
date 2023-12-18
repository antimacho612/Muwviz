import { defineStore } from 'pinia';
import visualizer from '../core/visualizer';

type WindowStoreState = {
  isWindowMaximized: boolean;
  isLeftSidePaneCollapsed: boolean;
  visualizers: Map<number, ReturnType<typeof visualizer>>;
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
  },
});
