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

  const isDestroyed = () => !analyzer.isDestroyed;

  const destroy = () => !analyzer.isDestroyed && analyzer.destroy();

  const changeProperty = (keyValuePair: KeyValue<VisualizerConfig>) => {
    if (analyzer.isDestroyed) return;

    switch (keyValuePair.key) {
      case 'mode':
        analyzer.mode = keyValuePair.value;
        break;
    }
  };

  return {
    isDestroyed,
    destroy,
    changeProperty,
  };
};
