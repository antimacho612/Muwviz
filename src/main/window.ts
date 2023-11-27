import { is } from '@electron-toolkit/utils';
import { BrowserWindow, shell } from 'electron';
import path from 'path';
import { settingsStore } from '.';
import icon from '../../resources/icon.png?asset';
import { sendToRenderer } from './ipc';

const registerWindowEvents = (window: BrowserWindow) => {
  window.on('ready-to-show', () => {
    window.show();
  });

  window.on('close', async () => {
    console.log('Saving settings...');
    await settingsStore.save();
  });

  window.on('session-end', async () => {
    console.log('Saving settings...');
    await settingsStore.save();
  });

  window.on('resize', () => {
    // ウィンドウリサイズ時: リサイズ後のウィンドウが最大化された状態かどうかを通知する
    sendToRenderer(window, 'resizeWindow', window.isMaximized());
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

  const window = new BrowserWindow({
    title: 'Muwviz',
    titleBarStyle: hasFrame ? 'default' : 'hidden',
    frame: hasFrame,
    width: 900,
    minWidth: 900,
    height: 670,
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
