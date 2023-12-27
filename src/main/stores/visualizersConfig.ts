import BaseJSONStore from './baseJsonStore';
import { VisualizerConfig, VISUALIZERS_DEFAULT_CONFIG } from '@shared/visualizerTypes';

export default class VisualizersConfigStore extends BaseJSONStore<VisualizerConfig[]> {
  constructor(jsonPath: string) {
    super(jsonPath);

    if (!this.cachedData) {
      this.save(VISUALIZERS_DEFAULT_CONFIG);
    }
  }

  public getAllVisualizersConfig() {
    return this.cachedData;
  }

  public setVisualizerConfig(index: number, options: Partial<VisualizerConfig>) {
    if (!(this.cachedData && this.cachedData[index])) return;
    Object.assign(this.cachedData[index], options);
  }
}
