import { defineStore } from 'pinia';

type WindowStoreState = {
  isWindowMaximized: boolean;
  isLeftSidePaneCollapsed: boolean;
};

export const useWindowStore = defineStore('window', {
  state: (): WindowStoreState => ({
    isWindowMaximized: true,
    isLeftSidePaneCollapsed: true,
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
  },
});
