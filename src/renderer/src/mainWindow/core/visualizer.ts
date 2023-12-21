import AudioMotionAnalyzer, { ConstructorOptions } from 'audiomotion-analyzer';
import { VisualizerConfig } from '@shared/visualizerTypes';
import { KeyValue } from '@shared/types';

const visualizer = (containerEl: HTMLDivElement, constructorOptions: ConstructorOptions) => {
  const analyzer = new AudioMotionAnalyzer(containerEl, constructorOptions);

  const getConnectedSource = () => analyzer.connectedSources[0];

  const isOn = () => analyzer.isOn;

  const toggle = (isOn?: boolean) => {
    if (analyzer.isDestroyed) throw new Error(`Analyzer has already been destroyed.`);
    analyzer.toggleAnalyzer(isOn);
  };

  const isDestroyed = () => !analyzer.isDestroyed;
  const destroy = () => !analyzer.isDestroyed && analyzer.destroy();

  const changeProperty = (keyValuePair: KeyValue<VisualizerConfig>) => {
    if (analyzer.isDestroyed) return;

    const { key, value } = keyValuePair;
    analyzer.setOptions({ [key]: value });
  };

  return {
    getConnectedSource,
    isOn,
    toggle,
    isDestroyed,
    destroy,
    changeProperty,
  };
};

export default visualizer;
