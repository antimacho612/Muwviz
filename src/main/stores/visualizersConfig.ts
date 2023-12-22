import BaseJSONStore from './baseJsonStore';
import {
  VisualizerConfig,
  VISUALIZER_DEFAULT_PRESET1,
  VISUALIZER_DEFAULT_PRESET2,
  VISUALIZER_DEFAULT_PRESET3,
} from '@shared/visualizerTypes';

export default class VisualizersConfigStore extends BaseJSONStore<VisualizerConfig[]> {
  constructor(jsonPath: string) {
    super(jsonPath);

    if (!this.cachedData) {
      this.save([
        {
          isOn: true,
          ...VISUALIZER_DEFAULT_PRESET1,
        },
        {
          isOn: true,
          ...VISUALIZER_DEFAULT_PRESET2,
        },
        {
          isOn: true,
          ...VISUALIZER_DEFAULT_PRESET3,
        },
      ]);
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
