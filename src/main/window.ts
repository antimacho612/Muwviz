import { is } from '@electron-toolkit/utils';
import { BrowserWindow, Event, shell } from 'electron';
import path from 'path';
import { settingsStore } from '.';
import icon from '../../resources/icon.png?asset';
import { sendWindowMaximizedToMain } from './ipc';
import { DEFAULT_SETTINGS } from '@shared/types';

const onCloseWindow = async (_event: Event, window: BrowserWindow) => {
  const [width, height] = window.getSize();
  settingsStore.setWindowSize({ width, height });
  await settingsStore.save();
};

const registerWindowEvents = (window: BrowserWindow) => {
  window.on('ready-to-show', () => {
    window.show();
  });

  window.on('close', async (e: Event) => {
    await onCloseWindow(e, window);
  });

  window.on('session-end', async (e: Event) => {
    await onCloseWindow(e, window);
  });

  window.on('resize', () => {
    // ウィンドウリサイズ時: リサイズ後のウィンドウが最大化された状態かどうかを通知する
    sendWindowMaximizedToMain(window.isMaximized());
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

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
};

const createTray = async () => {
  // TODO: 未実装
};

export const createWindow = async () => {
  const hasFrame = process.platform === 'linux' || process.platform === 'darwin';
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
      devTools: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  registerWindowEvents(window);

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    await window.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    await window.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  await createTray();

  return window;
};

export const minimizeWindow = (window: BrowserWindow) => window.minimizable && window.minimize();

export const maximizeWindow = (window: BrowserWindow) => {
  if (window.maximizable) {
    if (window.isMaximized()) {
      window.restore();
    } else {
      window.maximize();
    }
  }
};

export const closeWindow = (window: BrowserWindow) => !window.isDestroyed() && window.close();
