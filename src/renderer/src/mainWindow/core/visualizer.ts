import AudioMotionAnalyzer, { ConstructorOptions } from 'audiomotion-analyzer';
import { VisualizerConfig } from '@shared/visualizerTypes';
import { KeyValue } from '@shared/types';

const visualizer = (containerEl: HTMLDivElement, constructorOptions: ConstructorOptions) => {
  const analyzer = new AudioMotionAnalyzer(containerEl, constructorOptions);

  const getConnectedSource = () => analyzer.connectedSources[0];

  const isOn = () => analyzer.isOn;
  const start = () => {
    !analyzer.isDestroyed && analyzer.start();
  };
  const stop = () => {
    !analyzer.isDestroyed && analyzer.stop();
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
    start,
    stop,
    isDestroyed,
    destroy,
    changeProperty,
  };
};

export default visualizer;
