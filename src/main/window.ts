import { BrowserWindow, Event, MessageChannelMain, OpenDialogOptions, dialog, nativeImage, shell } from 'electron';
import { is } from '@electron-toolkit/utils';
import path from 'path';
import { settingsStore, visualizersConfigStore, visualizerPresetsStore } from '.';
import {
  sendNextSongCommandToMain,
  sendPauseCommandToMain,
  sendPlayCommandToMain,
  sendPrevSongCommandToMain,
  sendWindowMaximized,
} from './ipc';
import icon from '../../resources/icon.png?asset';
import prevIcon from '../../resources/prev-icon.png?asset';
import playIcon from '../../resources/play-icon.png?asset';
import pauseIcon from '../../resources/pause-icon.png?asset';
import nextIcon from '../../resources/next-icon.png?asset';
import { DEFAULT_SETTINGS } from '@shared/types';

let mainWindowId: number | undefined;
let subWindowId: number | undefined;

const onCloseWindow = async (_event: Event, window: BrowserWindow, isMainWindow = true) => {
  if (isMainWindow) {
    const [width, height] = window.getSize();
    settingsStore.setMainWindowState({ width, height, isMaximized: window.isMaximized() });
    await settingsStore.save();
  } else {
    settingsStore.setSubWindowState({
      alwaysOnTop: window.isAlwaysOnTop(),
      ...window.getBounds(),
    });
    await visualizersConfigStore.save();
    await visualizerPresetsStore.save();
  }
};

const registerWindowEvents = (window: BrowserWindow, isMainWindow = true, maximizeWindow = false) => {
  window.on('ready-to-show', () => {
    window.show();
    maximizeWindow && window.maximize();
  });

  window.on('resize', () => {
    // ウィンドウリサイズ時: リサイズ後のウィンドウが最大化された状態かどうかを通知する
    sendWindowMaximized(isMainWindow, window.isMaximized());
  });

  window.webContents.setWindowOpenHandler((details) => {
    const ALLOWED_URLS = ['https://audiomotion.dev', 'https://github.com/antimacho612/Muwviz'] as const;
    if (ALLOWED_URLS.some((url) => details.url.startsWith(url))) {
      shell.openExternal(details.url, { activate: true });
    }
    return { action: 'deny' };
  });

  window.on('close', async (e: Event) => {
    await onCloseWindow(e, window, isMainWindow);
  });

  window.on('session-end', async (e: Event) => {
    await onCloseWindow(e, window, isMainWindow);
  });

  if (isMainWindow) {
    window.webContents.session.webRequest.onHeadersReceived({ urls: ['*://*.genius.com/*'] }, (details, callback) => {
      if (details.responseHeaders) {
        // 強制的にCORSブロックを回避する
        delete details.responseHeaders['Access-Control-Allow-Origin'];
        delete details.responseHeaders['access-control-allow-origin'];
        details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];
      }

      callback({ responseHeaders: details.responseHeaders });
    });
  }
};

const createThumbarButtons = (window: BrowserWindow) => {
  window.setThumbarButtons([
    {
      icon: nativeImage.createFromPath(prevIcon),
      click: () => sendPrevSongCommandToMain(),
      tooltip: '前の楽曲',
    },
    {
      icon: nativeImage.createFromPath(playIcon),
      click: () => sendPlayCommandToMain(),
      tooltip: '再生',
    },
    {
      icon: nativeImage.createFromPath(pauseIcon),
      click: () => sendPauseCommandToMain(),
      tooltip: '停止',
    },
    {
      icon: nativeImage.createFromPath(nextIcon),
      click: () => sendNextSongCommandToMain(),
      tooltip: '次の楽曲',
    },
  ]);
};

export const getWindow = (isMainWindow = true) => {
  if (isMainWindow && mainWindowId !== undefined) return BrowserWindow.fromId(mainWindowId);
  if (!isMainWindow && subWindowId !== undefined) return BrowserWindow.fromId(subWindowId);
  return null;
};

const hasFrame = process.platform === 'linux' || process.platform === 'darwin';

export const createMainWindow = async () => {
  const windowState = settingsStore.getMainWindowState();

  const window = new BrowserWindow({
    title: 'Muwviz',
    titleBarStyle: hasFrame ? 'default' : 'hidden',
    frame: hasFrame,
    minWidth: 900,
    width: windowState.isMaximized ? DEFAULT_SETTINGS.mainWindowState.width : windowState.width,
    minHeight: 612,
    height: windowState.isMaximized ? DEFAULT_SETTINGS.mainWindowState.height : windowState.height,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });
  mainWindowId = window.id;

  registerWindowEvents(window, true, windowState.isMaximized);

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    await window.loadURL(`${process.env.ELECTRON_RENDERER_URL}`);
  } else {
    await window.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  createThumbarButtons(window);
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
    const windowState = settingsStore.getSubWindowState();

    window = new BrowserWindow({
      title: 'Muwviz Visualizer Config',
      titleBarStyle: hasFrame ? 'default' : 'hidden',
      frame: hasFrame,
      ...windowState,
      minWidth: 320,
      maxWidth: 700,
      minHeight: 456,
      show: false,
      autoHideMenuBar: true,
      icon,
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
    window.restore();
    window.focus();
  }
};

export const isWindowMaximized = (isMainWindow = true) => {
  const window = getWindow(isMainWindow);
  return window?.isMaximized();
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

export const isWindowAlwaysOnTop = (isMainWindow: boolean) => {
  const window = getWindow(isMainWindow);
  return window && window.isAlwaysOnTop();
};

export const setWindowAlwaysOnTop = (isMainWindow: boolean, flag: boolean) => {
  const window = getWindow(isMainWindow);
  window?.setAlwaysOnTop(flag);
};

export const showWindow = (isMainWindow: boolean) => {
  const window = getWindow(isMainWindow);
  window?.show();
  window?.focus();
};

export const showConfirm = (isMainWindow: boolean, message: string, detail?: string) => {
  const window = getWindow(isMainWindow);
  return (
    window &&
    dialog.showMessageBox(window, {
      type: 'warning',
      message,
      detail,
      buttons: ['OK', 'Cancel'],
      cancelId: 1,
    })
  );
};
