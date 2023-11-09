import { inject } from 'vue';
import { audioPlayerInjectionKey } from '@renderer/core/audioPlayer';

export const useAudioPlayer = () => {
  const audioPlayer = inject(audioPlayerInjectionKey);

  if (!audioPlayer) {
    throw new Error();
  }

  return audioPlayer;
};
