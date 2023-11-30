import { useWindowStore } from '@renderer/mainWindow/stores/window';

export const useIpcEventHandler = () => {
  const windowStore = useWindowStore();

  window.electronAPI.on.resizeWindow(async (_, isMaximized) => {
    windowStore.isWindowMaximized = isMaximized;
  });
};
