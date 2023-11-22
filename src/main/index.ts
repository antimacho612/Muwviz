import { app, shell, BrowserWindow, protocol } from 'electron';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import * as path from 'path';
import log from 'electron-log/main';
import icon from '../../resources/icon.png?asset';
import { registerIpcChannels, registerWindowIpcListener } from './ipc';
import { scanDirectory } from './core/directoryScanner';
import { ParsedSong, parseSongFile } from './core/songFileParser';
import { songsStore, albumsStore, artistsStore, lyricsStore } from './stores';
import { buildLibrary } from './core/libraryBuilder';
import { deleteOldLog } from './utils';

// 多重起動防止
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('muwviz', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('muwviz');
}

initializeLogger();

registerProtocols();

export let win: BrowserWindow;

app.whenReady().then(async () => {
  // test ---------------------------------------
  console.debug('Scanning directory...');
  const files = await scanDirectory('D:\\Music\\Perfume');

  const parsedSongs: ParsedSong[] = [];
  for (const file of files) {
    const parsedSong = await parseSongFile(file);
    if (parsedSong) {
      parsedSongs.push(parsedSong);
    }
  }

  console.debug('Building library...');
  const { songs, albums, artists, lyricsMap } = await buildLibrary(parsedSongs);

  await albumsStore.save(albums);
  await artistsStore.save(artists);
  await songsStore.save(songs);
  await lyricsStore.save(lyricsMap);
  // test ---------------------------------------

  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  protocol.registerFileProtocol('media', (request, callback) => {
    const url = request.url.replace(`media://`, '');
    try {
      return callback(decodeURIComponent(url));
    } catch (e) {
      console.error(e);
    }
  });

  registerIpcChannels();

  win = await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      win = await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function initializeLogger() {
  const isProduction = process.env.NODE_ENV === 'production';

  log.initialize({ preload: true });
  log.transports.file.level = isProduction ? 'info' : 'silly';
  log.transports.console.level = isProduction ? 'info' : 'silly';
  log.transports.file.writeOptions = {
    encoding: 'utf-8',
    flag: 'a',
    mode: 0o666,
  };
  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] [{processType}] {text}';
  log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] [{processType}] {text}';
  log.transports.file.resolvePathFn = (variables) => {
    const dir = variables.electronDefaultDir ?? app.getPath('logs');
    // sv-SEロケールはYYYY-MM-DD形式
    const fileName = `${new Date().toLocaleDateString('sv-SE')}.log`;
    return path.join(dir, fileName);
  };

  // Consoleをオーバーライド
  Object.assign(console, log.functions);

  process.on('uncaughtException', (err) => {
    console.error(err);
  });
  process.on('unhandledRejection', (err) => {
    console.error(err);
  });

  deleteOldLog(log.variables.electronDefaultDir ?? app.getPath('logs'));
}

function registerProtocols() {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'muwviz', privileges: { secure: true, standard: true } },
    { scheme: 'media', privileges: { corsEnabled: true, supportFetchAPI: true } },
  ]);
}

async function createWindow() {
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

  window.on('ready-to-show', () => {
    window.show();
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

  registerWindowIpcListener(window);

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    await window.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    await window.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  return window;
}
