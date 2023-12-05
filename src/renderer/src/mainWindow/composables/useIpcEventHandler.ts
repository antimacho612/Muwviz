import { useWindowStore } from '@renderer/mainWindow/stores/window';
import { useSettingsStore } from '@renderer/mainWindow/stores/settings';

export const useIpcEventHandler = () => {
  const windowStore = useWindowStore();

  window.electron.on.resizeWindow(async (_, isMaximized) => {
    windowStore.isWindowMaximized = isMaximized;
  });

  const settingsStore = useSettingsStore();

  window.electron.on.updateScannedFolders(async (_, scannedFolders) => {
    settingsStore.scannedFolders = scannedFolders;
  });
};
