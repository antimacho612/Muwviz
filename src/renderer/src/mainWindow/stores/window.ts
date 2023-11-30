import { defineStore } from 'pinia';

type WindowStoreState = {
  isWindowMaximized: boolean;
  isLeftSidePaneCollapsed: boolean;
};

export const useWindowStore = defineStore('window', {
  state: (): WindowStoreState => {
    return {
      isWindowMaximized: true,
      isLeftSidePaneCollapsed: true,
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
