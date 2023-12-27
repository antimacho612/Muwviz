import { ElectronAPI } from '@preload/ipc';
import { DEFAULT_SETTINGS, ScanProgress, Settings, UpdatableSettings } from '@shared/types';
import { VISUALIZERS_DEFAULT_CONFIG, VISUALIZER_DEFAULT_PRESETS } from '@shared/visualizerTypes';
import { app, shell } from 'electron';
import { createIpcMain } from 'electron-typescript-ipc';
import {
  albumsStore,
  artistsStore,
  lyricsStore,
  scannedFoldersStore,
  settingsStore,
  songsStore,
  visualizerPresetsStore,
  visualizersConfigStore,
} from '.';
import { initializeLibrary, removeSongsFromLibrary } from './core/libraryManager';
import { ARTWORKS_DIR, WAVEFORMS_DIR } from './core/paths';
import { scanFolder } from './core/scanner';
import { getWaveformData, saveWaveformData } from './core/waveformManager';
import { showNotification } from './utils';
import {
  closeWindow,
  createSubWindow,
  getWindow,
  isWindowAlwaysOnTop,
  isWindowMaximized,
  maximizeWindow,
  minimizeWindow,
  openFileBrowser,
  setWindowAlwaysOnTop,
  showConfirm,
} from './window';

const ipcMain = createIpcMain<ElectronAPI>();

export const registerIpcChannels = () => {
  // アプリのバージョンを取得する
  ipcMain.handle('getAppVersion', async () => app.getVersion());
  // アプリケーションを初期化する
  ipcMain.handle('initializeApp', async () => {
    await Promise.allSettled([
      initializeLibrary(),
      settingsStore.save(DEFAULT_SETTINGS),
      visualizersConfigStore.save(VISUALIZERS_DEFAULT_CONFIG),
      visualizerPresetsStore.save(VISUALIZER_DEFAULT_PRESETS),
    ]);
  });
  // アプリケーションを再起動する
  ipcMain.handle('relaunchApp', async () => {
    app.relaunch();
    app.exit();
  });

  // アートワークの保存先を取得する
  ipcMain.handle('getArtworkPath', async () => ARTWORKS_DIR);
  // 波形データの保存先を取得する
  ipcMain.handle('getWaveformPath', async () => WAVEFORMS_DIR);

  // ファイルブラウザを開く
  ipcMain.handle('openFileBrowser', async (_, isMainWindow, mode, filters) =>
    openFileBrowser(isMainWindow, {
      properties: [mode === 'File' ? 'openFile' : 'openDirectory'],
      filters,
    })
  );
  // 確認メッセージを表示する
  ipcMain.handle('showConfirm', async (_, isMainWindow, message, detail) =>
    showConfirm(isMainWindow, message, detail)
  );
  // 指定されたパスをデフォルトのアプリケーションで開く
  ipcMain.handle('openPath', async (_, path) => shell.openPath(path));

  // ビジュアライザー設定ウィンドウを開く
  ipcMain.handle('openVisualizerConfigWindow', async () => createSubWindow());

  // ウィンドウが最大化された状態かどうかを取得する
  ipcMain.handle('isWindowMaximized', async (_, isMainWindow) => isWindowMaximized(isMainWindow));
  // ウィンドウを最小化する
  ipcMain.handle('minimizeWindow', async (_, isMainWindow) => minimizeWindow(isMainWindow));
  // ウィンドウの最大化⇔最大化解除を切り替える
  ipcMain.handle('maximizeWindow', async (_, isMainWindow) => maximizeWindow(isMainWindow));
  // ウィンドウを閉じる
  ipcMain.handle('closeWindow', async (_, isMainWindow) => closeWindow(isMainWindow));
  // ウィンドウが常に他のウィンドウの上に表示されるようになっているかどうかを取得する
  ipcMain.handle('isWindowAlwaysOnTop', async (_, isMainWindow) =>
    isWindowAlwaysOnTop(isMainWindow)
  );
  // ウィンドウを常に他のウィンドウの上に表示するかどうかを設定する
  ipcMain.handle('setWindowAlwaysOnTop', async (_, isMainWindow, flag) =>
    setWindowAlwaysOnTop(isMainWindow, flag)
  );

  // 設定を取得する
  ipcMain.handle('getSettings', async () => settingsStore.getAll());
  // 設定を更新する
  ipcMain.handle(
    'updateSettings',
    async <K extends keyof UpdatableSettings>(_, key: K, value: UpdatableSettings[K]) =>
      settingsStore.update(key, value as Settings[K])
  );

  // スキャン済みフォルダ情報を取得する
  ipcMain.handle('getScannedFolders', async () => scannedFoldersStore.getAll());
  // フォルダをスキャンし楽曲ライブラリを構築する
  ipcMain.handle(
    'scanFolder',
    async (_, folderPath, resortLibrary) => await scanFolder(folderPath, resortLibrary)
  );
  // ライブラリを初期化する
  ipcMain.handle('initializeLibrary', async () => await initializeLibrary());
  // ライブラリから楽曲を削除する
  ipcMain.handle(
    'removeSongsFromLibrary',
    async (_, songIds) => await removeSongsFromLibrary(songIds)
  );

  // 全楽曲情報を取得する
  ipcMain.handle('getAllSongs', async () => songsStore.getAll());
  // 楽曲情報のキャッシュ（メイン側で保持しているデータ）を削除する
  ipcMain.handle('clearSongsCache', async () => songsStore.clearCache());

  // 全アルバム情報を取得する
  ipcMain.handle('getAllAlbums', async () => albumsStore.getAll());
  // アルバム情報のキャッシュ（メイン側で保持しているデータ）を削除する
  ipcMain.handle('clearAlbumsCache', async () => albumsStore.clearCache());

  // 全アーティスト情報を取得する
  ipcMain.handle('getAllArtists', async () => artistsStore.getAll());
  // アーティスト情報のキャッシュ（メイン側で保持しているデータ）を削除する
  ipcMain.handle('clearArtistsCache', async () => artistsStore.clearCache());

  // 全歌詞情報を取得する
  ipcMain.handle('getAllLyrics', async () => {
    const lyrics = lyricsStore.getAll();
    lyricsStore.clearCache();
    return lyrics;
  });
  // 歌詞情報のキャッシュ（メイン側で保持しているデータ）を削除する
  ipcMain.handle('clearLyricsCache', async () => lyricsStore.clearCache());

  // 波形データを取得する
  ipcMain.handle('getWaveformData', async (_, songId) => getWaveformData(songId));
  // 波形データを保存する
  ipcMain.handle('saveWaveformData', async (_, songId, waveformData) =>
    saveWaveformData(songId, waveformData)
  );

  // 全ビジュアライザーの設定情報を取得する
  ipcMain.handle('getAllVisualizersConfig', async () =>
    visualizersConfigStore.getAllVisualizersConfig()
  );

  // ビジュアライザーの設定を更新する
  ipcMain.handle('updateVisualizerConfig', async (_, index, options, isMainWindow = false) => {
    visualizersConfigStore.setVisualizerConfig(index, options);

    // メインウィンドウからの更新時は、更新内容を設定ファイルに即時保存する
    // ※メインウィンドウを閉じた際はビジュアライザー設定ファイルへの保存を行わないため
    if (isMainWindow) visualizersConfigStore.save();
  });

  // ビジュアライザーの全設定プリセットを取得する
  ipcMain.handle('getAllVisualizerPresets', async () => visualizerPresetsStore.getAll());
  // ビジュアライザーの設定プリセットを追加する
  ipcMain.handle('addVisualizerPreset', async (_, preset) => visualizerPresetsStore.add(preset));
  // ビジュアライザーの設定プリセットを削除する
  ipcMain.handle('deleteVisualizerPreset', async (_, id) => visualizerPresetsStore.delete(id));

  // デスクトップ通知を表示する
  ipcMain.handle('showDesktopNotification', async (_, title, body, imagePath) => {
    const window = getWindow();
    if (window && window.isMinimized() && settingsStore.getByKey('showDesktopNotification')) {
      showNotification(title, body, imagePath);
    }
  });
};

/**
 * ウィンドウが最大化されているかどうかをウィンドウに通知する
 * @param isMainWindow 通知対象がメインウィンドウかどうか
 * @param isMaximized ウィンドウが最大化されているかどうか
 */
export const sendWindowMaximized = (isMainWindow: boolean, isMaximized: boolean) => {
  const window = getWindow(isMainWindow);
  window && ipcMain.send(window, 'resizeWindow', isMaximized);
};

/**
 * スキャンの進捗状況をメインウィンドウに通知する
 * @param progress 進捗状況
 */
export const sendScanProgressToMain = (progress: ScanProgress) => {
  const window = getWindow();
  window && ipcMain.send(window, 'updateScanProgress', progress);
};

/**
 * 楽曲の再生命令をメインウィンドウに通知する
 */
export const sendPlayCommandToMain = () => {
  const window = getWindow();
  window && ipcMain.send(window, 'sendPlaySongCommand');
};

/**
 * 楽曲の再生一時停止命令をメインウィンドウに通知する
 */
export const sendPauseCommandToMain = () => {
  const window = getWindow();
  window && ipcMain.send(window, 'sendPauseSongCommand');
};

/**
 * 前の楽曲再生命令をメインウィンドウに通知する
 */
export const sendPrevSongCommandToMain = () => {
  const window = getWindow();
  window && ipcMain.send(window, 'sendPrevSongCommand');
};

/**
 * 次の楽曲再生命令をメインウィンドウに通知する
 */
export const sendNextSongCommandToMain = () => {
  const window = getWindow();
  window && ipcMain.send(window, 'sendNextSongCommand');
};

/**
 * スキャン済みフォルダ情報をメインウィンドウに通知する
 */
export const sendScannedFoldersToMain = () => {
  const window = getWindow();
  window && ipcMain.send(window, 'updateScannedFolders', scannedFoldersStore.getAll());
};
