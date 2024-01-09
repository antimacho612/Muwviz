import { defineStore } from 'pinia';
import { DEFAULT_SETTINGS, ScannedFolder, UpdatableSettings } from '@shared/types';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

export type SettingsStoreState = {
  scannedFolders: ScannedFolder[];
  artworkPath: string;
  waveformPath: string;
  appVersion: string;
  audioMotionAnalyzerVersion: string;
} & UpdatableSettings;

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStoreState => {
    return {
      scannedFolders: [],
      artworkPath: '',
      waveformPath: '',
      cacheWaveformData: DEFAULT_SETTINGS.cacheWaveformData,
      fontFamily: DEFAULT_SETTINGS.fontFamily,
      theme: DEFAULT_SETTINGS.theme,
      primaryColor: DEFAULT_SETTINGS.primaryColor,
      showDesktopNotification: DEFAULT_SETTINGS.showDesktopNotification,
      appVersion: '',
      audioMotionAnalyzerVersion: AudioMotionAnalyzer.version,
    };
  },

  actions: {
    async fetch() {
      console.debug('Fetching settings...');

      const [artworkPath, waveformPath, scannedFolders, settings, appVersion] = await Promise.all([
        window.electron.invoke.getArtworkPath(),
        window.electron.invoke.getWaveformPath(),
        window.electron.invoke.getScannedFolders(),
        window.electron.invoke.getSettings(),
        window.electron.invoke.getAppVersion(),
      ]);

      this.scannedFolders = scannedFolders ?? [];
      this.artworkPath = artworkPath;
      this.waveformPath = waveformPath;
      this.cacheWaveformData = settings.cacheWaveformData;
      this.fontFamily = settings.fontFamily;
      this.theme = settings.theme;
      this.primaryColor = settings.primaryColor;
      this.showDesktopNotification = settings.showDesktopNotification;
      this.appVersion = appVersion;
    },

    async saveChange<K extends keyof UpdatableSettings>(key: K, value: UpdatableSettings[K]) {
      await window.electron.invoke.updateSettings(key, value);
    },
  },
});
