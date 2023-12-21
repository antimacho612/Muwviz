import BaseJSONStore from './baseJsonStore';
import { VISUALIZER_DEFAULT_PRESETS, VisualizerPreset } from '@shared/visualizerTypes';

export default class VisualizerPresetsStore extends BaseJSONStore<VisualizerPreset[]> {
  constructor(jsonPath: string) {
    super(jsonPath);

    if (!this.cachedData) {
      this.save(VISUALIZER_DEFAULT_PRESETS);
    }
  }

  public getAll() {
    return this.cachedData ?? [];
  }

  public add(preset: VisualizerPreset) {
    if (this.cachedData) {
      this.cachedData.push(preset);
    } else {
      this.cachedData = [preset];
    }
  }
}
