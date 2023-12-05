import { ipcRenderer } from 'electron';
import { contextBridge } from 'electron-typescript-ipc';
import { electronAPI } from './ipc';

const windowLoaded = new Promise((resolve) => {
  window.onload = resolve;
});

ipcRenderer.on('messagePort', async (e) => {
  await windowLoaded;
  window.postMessage('messagePort', '*', e.ports);
});

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
}
