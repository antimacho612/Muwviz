import { VisualizerConfig, getDefaultConfig } from '@shared/visualizerTypes';
import BaseJSONStore from './baseJsonStore';

export default class VisualizerConfigStore extends BaseJSONStore<VisualizerConfig[]> {
  constructor(jsonPath: string) {
    super(jsonPath);

    if (!this.cachedData) {
      this.save([getDefaultConfig(), getDefaultConfig(), getDefaultConfig()]);
    }
  }

  public getVisualizerConfig() {
    return this.cachedData;
  }

  public setVisualizerConfig(index: number, options: Partial<VisualizerConfig>) {
    if (!(this.cachedData && this.cachedData[index])) return;
    Object.assign(this.cachedData[index], options);
  }
}
