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
      case 'fftSize':
        analyzer.fftSize = keyValuePair.value;
        break;
      case 'smoothing':
        analyzer.smoothing = keyValuePair.value;
        break;
      case 'minFreq':
        analyzer.minFreq = keyValuePair.value;
        break;
      case 'maxFreq':
        analyzer.maxFreq = keyValuePair.value;
        break;
      case 'frequencyScale':
        analyzer.frequencyScale = keyValuePair.value;
        break;
      case 'weightingFilter':
        analyzer.weightingFilter = keyValuePair.value;
        break;
      case 'minDecibels':
        analyzer.minDecibels = keyValuePair.value;
        break;
      case 'maxDecibels':
        analyzer.maxDecibels = keyValuePair.value;
        break;
      case 'linearBoost':
        analyzer.linearBoost = keyValuePair.value;
        break;
      case 'linearAmplitude':
        analyzer.linearAmplitude = keyValuePair.value;
        break;
      case 'channelLayout':
        analyzer.channelLayout = keyValuePair.value;
        break;
      case 'colorMode':
        analyzer.colorMode = keyValuePair.value;
        break;
      case 'gradientLeft':
        analyzer.gradientLeft = keyValuePair.value;
        break;
      case 'gradientRight':
        analyzer.gradientRight = keyValuePair.value;
        break;
      case 'splitGradient':
        analyzer.splitGradient = keyValuePair.value;
        break;
      case 'barSpace':
        analyzer.barSpace = keyValuePair.value;
        break;

      default:
        console.debug('Not handled...', keyValuePair);
    }

    console.log(keyValuePair.key, analyzer[keyValuePair.key]);
  };

  return {
    isDestroyed,
    destroy,
    changeProperty,
  };
};