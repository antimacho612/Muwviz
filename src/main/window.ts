import {
  BrowserWindow,
  Event,
  MessageChannelMain,
  OpenDialogOptions,
  dialog,
  shell,
} from 'electron';
import { is } from '@electron-toolkit/utils';
import path from 'path';
import { settingsStore } from '.';
import { sendWindowMaximized } from './ipc';
import { DEFAULT_SETTINGS } from '@shared/types';
import icon from '../../resources/icon.png?asset';

let mainWindowId: number | undefined;
let subWindowId: number | undefined;

const onCloseWindow = async (_event: Event, window: BrowserWindow) => {
  const [width, height] = window.getSize();
  settingsStore.setWindowSize({ width, height });
  await settingsStore.save();
};

const registerWindowEvents = (window: BrowserWindow, isMainWindow = true) => {
  window.on('ready-to-show', () => {
    window.show();
  });

  window.on('resize', () => {
    // ウィンドウリサイズ時: リサイズ後のウィンドウが最大化された状態かどうかを通知する
    sendWindowMaximized(isMainWindow, window.isMaximized());
  });

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (isMainWindow) {
    window.on('close', async (e: Event) => {
      await onCloseWindow(e, window);
    });

    window.on('session-end', async (e: Event) => {
      await onCloseWindow(e, window);
    });

    window.webContents.session.webRequest.onHeadersReceived(
      { urls: ['*://*.genius.com/*'] },
      (details, callback) => {
        if (details.responseHeaders) {
          // 強制的にCORSブロックを回避する
          delete details.responseHeaders['Access-Control-Allow-Origin'];
          delete details.responseHeaders['access-control-allow-origin'];
          details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];
        }

        callback({ responseHeaders: details.responseHeaders });
      }
    );
  }
};

const createTray = async () => {
  // TODO: 未実装
};

export const getWindow = (isMainWindow = true) => {
  if (isMainWindow && mainWindowId !== undefined) return BrowserWindow.fromId(mainWindowId);
  if (!isMainWindow && subWindowId !== undefined) return BrowserWindow.fromId(subWindowId);
  return null;
};

const hasFrame = process.platform === 'linux' || process.platform === 'darwin';

export const createMainWindow = async () => {
  const windowSize = settingsStore.getData()?.windowSize ?? DEFAULT_SETTINGS.windowSize;
  const window = new BrowserWindow({
    title: 'Muwviz',
    titleBarStyle: hasFrame ? 'default' : 'hidden',
    frame: hasFrame,
    ...windowSize,
    minWidth: 900,
    minHeight: 612,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });
  mainWindowId = window.id;

  registerWindowEvents(window);

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    await window.loadURL(`${process.env.ELECTRON_RENDERER_URL}`);
  } else {
    await window.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  await createTray();
};

const setupMessagePort = (subWindow: BrowserWindow) => {
  const mainWindow = getWindow();
  if (!mainWindow) return;

  const { port1, port2 } = new MessageChannelMain();
  mainWindow.webContents.postMessage('messagePort', null, [port1]);
  subWindow.webContents.postMessage('messagePort', null, [port2]);
};

export const createSubWindow = async () => {
  let window: BrowserWindow | null = getWindow(false);

  if (!window || window?.isDestroyed()) {
    window = new BrowserWindow({
      title: 'Muwviz Visualizer Config',
      titleBarStyle: hasFrame ? 'default' : 'hidden',
      frame: hasFrame,
      width: 800,
      minWidth: 320,
      height: 480,
      minHeight: 320,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        contextIsolation: true,
        devTools: true,
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: false,
      },
    });
    subWindowId = window.id;

    registerWindowEvents(window, false);

    setupMessagePort(window);

    if (is.dev && process.env.ELECTRON_RENDERER_URL) {
      await window.loadURL(`${process.env.ELECTRON_RENDERER_URL}/visualizer-config.html`);
    } else {
      await window.loadFile(path.join(__dirname, '../renderer/visualizer-config.html'));
    }
  } else {
    window.focus();
  }
};

export const minimizeWindow = (isMainWindow = true) => {
  const window = getWindow(isMainWindow);
  window?.minimizable && window.minimize();
};

export const maximizeWindow = (isMainWindow = true) => {
  const window = getWindow(isMainWindow);
  if (window?.maximizable) {
    if (window.isMaximized()) {
      window.restore();
    } else {
      window.maximize();
    }
  }
};

export const openFileBrowser = (isMainWindow: boolean, options: OpenDialogOptions) => {
  const window = getWindow(isMainWindow);
  return window && dialog.showOpenDialog(window, options);
};

export const closeWindow = (isMainWindow = true) => {
  const window = getWindow(isMainWindow);
  window && !window.isDestroyed() && window.close();
};
