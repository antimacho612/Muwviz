import { useWindowStore } from '@mainWindow/stores/window';
import { useSettingsStore } from '@mainWindow/stores/settings';

export const useIpcEventHandler = () => {
  const windowStore = useWindowStore();
  window.electron.on.resizeWindow(async (_, isMaximized) => {
    windowStore.isWindowMaximized = isMaximized;
  });

  window.electron.on.isAppUpdateAvailable(async () => {
    windowStore.isUpdateAvailable = true;
  });
  window.electron.invoke.checkUpdates();

  const settingsStore = useSettingsStore();
  window.electron.on.updateScannedFolders(async (_, scannedFolders) => {
    settingsStore.scannedFolders = scannedFolders;
  });
};
