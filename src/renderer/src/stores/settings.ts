import { defineStore } from 'pinia';

export type SettingsStoreState = {
  fontFamily: string;
  theme: 'Light' | 'Dark';
  primaryColor: string;
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStoreState => {
    return {
      fontFamily: '',
      theme: 'Light',
      primaryColor: '#7c3aed',
    };
  },

  actions: {},
});
