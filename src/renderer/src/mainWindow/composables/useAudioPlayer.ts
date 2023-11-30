import { inject } from 'vue';
import { audioPlayerKey } from '../injectionKeys';

export const useAudioPlayer = () => {
  const audioPlayer = inject(audioPlayerKey);
  if (!audioPlayer) throw new Error();
  return audioPlayer;
};
