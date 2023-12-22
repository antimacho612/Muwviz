import { defineStore } from 'pinia';

type WindowStoreState = {
  isWindowMaximized: boolean;
  isLeftSidePaneCollapsed: boolean;
  isRightSidePaneCollapsed: boolean;
};

export const useWindowStore = defineStore('window', {
  state: (): WindowStoreState => ({
    isWindowMaximized: true,
    isLeftSidePaneCollapsed: false,
    isRightSidePaneCollapsed: false,
  }),

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

    collapseRightSidePane() {
      this.isRightSidePaneCollapsed = true;
    },

    expandRightSidePane() {
      this.isRightSidePaneCollapsed = false;
    },
  },
});
