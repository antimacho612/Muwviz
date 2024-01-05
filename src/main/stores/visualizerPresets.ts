import BaseJSONStore from './baseJsonStore';
import { VisualizerPreset } from '@shared/visualizerTypes';

export default class VisualizerPresetsStore extends BaseJSONStore<VisualizerPreset[]> {
  constructor(jsonPath: string) {
    super(jsonPath);
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

  public delete(id: string) {
    const index = this.cachedData?.findIndex((preset) => preset.id === id) ?? -1;
    if (index >= 0) this.cachedData?.splice(index, 1);
  }
}
