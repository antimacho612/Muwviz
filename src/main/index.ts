import { electronApp, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app, protocol } from 'electron';
import log from 'electron-log/main';
import path from 'path';
import { STORES_DIR } from './core/paths';
import { registerIpcChannels } from './ipc';
import AlbumsStore from './stores/albums';
import ArtistsStore from './stores/artists';
import LyricsStore from './stores/lyrics';
import ScannedFoldersStore from './stores/scannedFolders';
import SettingsStore from './stores/settings';
import SongsStore from './stores/songs';
import { deleteOldLog } from './utils';
import { createMainWindow } from './window';
import VisualizerConfigStore from './stores/visualizerConfig';

export let songsStore: SongsStore;
export let albumsStore: AlbumsStore;
export let artistsStore: ArtistsStore;
export let lyricsStore: LyricsStore;
export let settingsStore: SettingsStore;
export let scannedFoldersStore: ScannedFoldersStore;
export let visualizerConfigStore: VisualizerConfigStore;

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

initializeStore();

registerProtocols();

app.whenReady().then(async () => {
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

  await createMainWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
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

function initializeStore() {
  songsStore = new SongsStore(path.join(STORES_DIR, 'songs.json'));
  albumsStore = new AlbumsStore(path.join(STORES_DIR, 'albums.json'));
  artistsStore = new ArtistsStore(path.join(STORES_DIR, 'artists.json'));
  lyricsStore = new LyricsStore(path.join(STORES_DIR, 'lyrics.json'));
  settingsStore = new SettingsStore(path.join(STORES_DIR, 'settings.json'));
  scannedFoldersStore = new ScannedFoldersStore(path.join(STORES_DIR, 'scanned-folders.json'));
  visualizerConfigStore = new VisualizerConfigStore(
    path.join(STORES_DIR, 'visualizer-config.json')
  );
}

function registerProtocols() {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'muwviz', privileges: { secure: true, standard: true } },
    { scheme: 'media', privileges: { corsEnabled: true, supportFetchAPI: true } },
  ]);
}
