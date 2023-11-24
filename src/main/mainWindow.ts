import { BrowserWindow, app, shell } from 'electron';
import { is } from '@electron-toolkit/utils';
import path from 'path';
import icon from '../../resources/icon.png?asset';
import { registerWindowIpcListener } from './ipc';
import { settingsStore } from './stores';

let mainWindow: BrowserWindow;

const create = async () => {
  const hasFrame = process.platform === 'linux' || process.platform === 'darwin';

  mainWindow = new BrowserWindow({
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

  registerWindowEvents();
  registerWindowIpcListener(mainWindow);

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    await mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  await createTray();
};

const registerWindowEvents = () => {
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', async () => {
    console.log('Saving settings...');
    await settingsStore.save();
  });

  mainWindow.on('session-end', async () => {
    console.log('Saving settings...');
    await settingsStore.save();
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived(
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

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
};

const createTray = async () => {
  // TODO: 未実装
};

const minimize = () => mainWindow.minimizable && mainWindow.minimize();
const maximize = () => {
  if (mainWindow.maximizable) {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  }
};
const close = () => !mainWindow.isDestroyed() && mainWindow.close();

export default {
  create,
  minimize,
  maximize,
  close,
};
