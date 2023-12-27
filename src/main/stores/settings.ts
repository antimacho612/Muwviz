import BaseJSONStore from './baseJsonStore';
import { DEFAULT_SETTINGS, Settings, UpdatableSettings } from '@shared/types';

export default class SettingsStore extends BaseJSONStore<Settings> {
  constructor(jsonPath: string) {
    super(jsonPath);

    if (!this.cachedData) {
      this.save(DEFAULT_SETTINGS);
    }
  }

  public getAll() {
    return this.cachedData ?? DEFAULT_SETTINGS;
  }

  public getByKey(key: keyof Settings) {
    return (this.cachedData ?? DEFAULT_SETTINGS)[key];
  }

  public getMainWindowState() {
    return this.cachedData?.mainWindowState ?? DEFAULT_SETTINGS.mainWindowState;
  }

  public setMainWindowState(windowState: { width: number; height: number; isMaximized: boolean }) {
    if (!this.cachedData) return;
    this.cachedData.mainWindowState = windowState;
  }

  public getSubWindowState() {
    return this.cachedData?.subWindowState ?? DEFAULT_SETTINGS.subWindowState;
  }

  public setSubWindowState(windowState: {
    width: number;
    height: number;
    alwaysOnTop: boolean;
    x?: number;
    y?: number;
  }) {
    if (!this.cachedData) return;
    this.cachedData.subWindowState = windowState;
  }

  public update<K extends keyof UpdatableSettings>(key: K, value: Settings[K]) {
    if (!this.cachedData) throw new Error();
    this.cachedData[key] = value;
  }
}
