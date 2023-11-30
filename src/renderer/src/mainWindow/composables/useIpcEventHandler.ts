import { useWindowStore } from '@renderer/mainWindow/stores/window';
import { useSettingsStore } from '@renderer/mainWindow/stores/settings';

export const useIpcEventHandler = () => {
  const windowStore = useWindowStore();

  window.electronAPI.on.resizeWindow(async (_, isMaximized) => {
    windowStore.isWindowMaximized = isMaximized;
  });

  const settingsStore = useSettingsStore();

  window.electronAPI.on.updateScannedFolders(async (_, scannedFolders) => {
    settingsStore.scannedFolders = scannedFolders;
  });
};
