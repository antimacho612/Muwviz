import { useAudioPlayer } from './useAudioPlayer';

export const useKeyboardHotKeys = () => {
  const audioPlayer = useAudioPlayer();

  document.addEventListener('keydown', async (e) => {
    if ((e.target as HTMLElement).tagName !== 'INPUT') {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          await audioPlayer.togglePlay();
          break;
        case 'ArrowLeft':
          if (e.altKey) {
            await audioPlayer.previousSong();
          } else if (e.ctrlKey && audioPlayer.currentSong.value) {
            audioPlayer.setCurrentTime(Math.max(0, audioPlayer.currentTime.value - 5));
          }
          break;
        case 'ArrowRight':
          if (e.altKey) {
            await audioPlayer.nextSong();
          } else if (e.ctrlKey && audioPlayer.currentSong.value) {
            audioPlayer.setCurrentTime(
              Math.min(audioPlayer.currentTime.value + 5, audioPlayer.duration.value)
            );
          }
          break;
        case 'KeyM':
          audioPlayer.toggleMute();
          break;
        case 'KeyR':
          audioPlayer.toggleRepeat();
          break;
        case 'F5':
          location.reload();
          break;
      }
    }
  });
};
