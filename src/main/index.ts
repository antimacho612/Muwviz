import { electronApp, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, Menu, Tray, app, nativeImage, protocol } from 'electron';
import logger from 'electron-log/main';
import path from 'path';
import icon from '../../resources/icon.png?asset';
import { createMainWindow, minimizeWindow, showWindow } from './window';
import {
  registerIpcChannels,
  sendNextSongCommandToMain,
  sendPauseCommandToMain,
  sendPlayCommandToMain,
  sendPrevSongCommandToMain,
} from './ipc';
import { STORES_DIR } from './core/paths';
import SongsStore from './stores/songs';
import AlbumsStore from './stores/albums';
import ArtistsStore from './stores/artists';
import LyricsStore from './stores/lyrics';
import SettingsStore from './stores/settings';
import ScannedFoldersStore from './stores/scannedFolders';
import VisualizersConfigStore from './stores/visualizersConfig';
import VisualizerPresetsStore from './stores/visualizerPresets';
import AppUpdater from './utils/appUpdater';
import { deleteOldLog } from './utils';

export let songsStore: SongsStore;
export let albumsStore: AlbumsStore;
export let artistsStore: ArtistsStore;
export let lyricsStore: LyricsStore;
export let settingsStore: SettingsStore;
export let scannedFoldersStore: ScannedFoldersStore;
export let visualizersConfigStore: VisualizersConfigStore;
export let visualizerPresetsStore: VisualizerPresetsStore;
export let appUpdater: AppUpdater;

// 多重起動防止
if (!app.requestSingleInstanceLock()) app.quit();

initializeLogger();

initializeStore();

registerProtocols();

app.whenReady().then(async () => {
  electronApp.setAppUserModelId(app.getName());

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  protocol.registerFileProtocol('media', (request, callback) => {
    const url = request.url.replace('media://', '');
    try {
      return callback(decodeURIComponent(url));
    } catch (e) {
      console.error(e);
    }
  });

  registerIpcChannels();

  await createMainWindow();

  createTray();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createMainWindow();
  });

  appUpdater = new AppUpdater();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function initializeLogger() {
  const isProduction = process.env.NODE_ENV_ELECTRON_VITE === 'production';

  logger.initialize({ preload: true });
  logger.transports.file.level = isProduction ? 'info' : 'silly';
  logger.transports.console.level = isProduction ? 'info' : 'silly';
  logger.transports.file.writeOptions = {
    encoding: 'utf-8',
    flag: 'a',
    mode: 0o666,
  };
  logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] [{processType}] {text}';
  logger.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] [{processType}] {text}';
  logger.transports.file.resolvePathFn = (variables) => {
    const dir = variables.electronDefaultDir ?? app.getPath('logs');
    // sv-SEロケールはYYYY-MM-DD形式
    const fileName = `${new Date().toLocaleDateString('sv-SE')}.log`;
    return path.join(dir, fileName);
  };

  // Consoleをオーバーライド
  Object.assign(console, logger.functions);
  process.on('uncaughtException', (err) => console.error(err));
  process.on('unhandledRejection', (err) => console.error(err));

  deleteOldLog(logger.variables.electronDefaultDir ?? app.getPath('logs'));
}

function initializeStore() {
  songsStore = new SongsStore(path.join(STORES_DIR, 'songs.json'));
  albumsStore = new AlbumsStore(path.join(STORES_DIR, 'albums.json'));
  artistsStore = new ArtistsStore(path.join(STORES_DIR, 'artists.json'));
  lyricsStore = new LyricsStore(path.join(STORES_DIR, 'lyrics.json'));
  settingsStore = new SettingsStore(path.join(STORES_DIR, 'settings.json'));
  scannedFoldersStore = new ScannedFoldersStore(path.join(STORES_DIR, 'scanned-folders.json'));
  visualizersConfigStore = new VisualizersConfigStore(
    path.join(STORES_DIR, 'visualizers-config.json')
  );
  visualizerPresetsStore = new VisualizerPresetsStore(
    path.join(STORES_DIR, 'visualizer-presets.json')
  );
}

function registerProtocols() {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'muwviz', privileges: { secure: true, standard: true } },
    { scheme: 'media', privileges: { corsEnabled: true, supportFetchAPI: true } },
  ]);
}

function createTray() {
  const tray = new Tray(nativeImage.createFromPath(icon));

  tray.setToolTip('Muwviz');
  tray.setTitle('Muwviz');

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'メインウィンドウを表示',
        click: () => showWindow(true),
      },
      {
        label: 'メインウィンドウを最小化',
        click: () => minimizeWindow(true),
      },
      { type: 'separator' },
      {
        label: '前の楽曲',
        click: () => sendPrevSongCommandToMain(),
      },
      {
        label: '再生',
        click: () => sendPlayCommandToMain(),
      },
      {
        label: '停止',
        click: () => sendPauseCommandToMain(),
      },
      {
        label: '次の楽曲',
        click: () => sendNextSongCommandToMain(),
      },
      { type: 'separator' },
      {
        label: '終了',
        click: () => app.quit(),
      },
    ])
  );

  tray.addListener('click', () => showWindow(true));
}
