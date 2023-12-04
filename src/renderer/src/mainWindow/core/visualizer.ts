import AudioMotionAnalyzer from 'audiomotion-analyzer';
import { VisualizerConfig } from '@shared/visualizerTypes';
import { KeyValue } from '@shared/types';

export const useVisualizer = (containerEl: HTMLDivElement, audio: HTMLAudioElement | AudioNode) => {
  const analyzer = new AudioMotionAnalyzer(containerEl, {
    source: audio,
    overlay: true,
    bgAlpha: 0,
    showBgColor: false,
  });

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

    if (key === 'scaleXLabel') {
      if (value === 'None') {
        analyzer.showScaleX = false;
      } else {
        analyzer.showScaleX = true;
        analyzer.noteLabels = value === 'Musical Notes';
      }
    } else {
      analyzer.setOptions({ [key]: value });
    }
  };

  return {
    isOn,
    start,
    stop,
    isDestroyed,
    destroy,
    changeProperty,
  };
};
