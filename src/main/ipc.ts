import { app, shell } from 'electron';
import { createIpcMain } from 'electron-typescript-ipc';
import { ElectronAPI } from '@preload/ipc';
import {
  albumsStore,
  artistsStore,
  lyricsStore,
  scannedFoldersStore,
  settingsStore,
  songsStore,
  visualizerConfigStore,
  visualizerPresetsStore,
} from '.';
import { ARTWORKS_DIR, WAVEFORMS_DIR } from './core/paths';
import { scanFolder } from './core/scanner';
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
} from './window';
import { removeSongsFromLibrary } from './core/libraryManager';
import { getWaveformData, saveWaveformData } from './core/waveformManager';
import { showNotification } from './utils';
import { KeyValue, ScanProgress, Settings } from '@shared/types';

const ipcMain = createIpcMain<ElectronAPI>();

export const registerIpcChannels = () => {
  // アプリのバージョンを取得する
  ipcMain.handle('getAppVersion', async () => app.getVersion());

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

  // ビジュアライザー設定ウィンドウを開く
  ipcMain.handle('openVisualizerConfigWindow', async () => createSubWindow());

  // 指定されたパスをデフォルトのアプリケーションで開く
  ipcMain.handle('openPath', async (_, path) => shell.openPath(path));

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
  ipcMain.handle('getSettings', async () => settingsStore.getData());
  // 設定を更新する
  ipcMain.handle('updateSettings', async (_, items: KeyValue<Omit<Settings, 'scannedFolders'>>[]) =>
    items.forEach((item) => settingsStore.update(item.key, item.value))
  );

  // スキャン済みフォルダ情報を取得する
  ipcMain.handle('getScannedFolders', async () => scannedFoldersStore.getAll());
  // フォルダをスキャンし楽曲ライブラリを構築する
  ipcMain.handle(
    'scanFolder',
    async (_, folderPath, resortLibrary) => await scanFolder(folderPath, resortLibrary)
  );
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
  ipcMain.handle('getAllVisualizerConfig', async () => visualizerConfigStore.getVisualizerConfig());

  // ビジュアライザーの設定を更新する
  ipcMain.handle('updateVisualizerConfig', async (_, index, options, isMainWindow = false) => {
    visualizerConfigStore.setVisualizerConfig(index, options);

    // メインウィンドウからの更新時は、更新内容を設定ファイルに即時保存する
    // ※メインウィンドウを閉じた際はビジュアライザー設定ファイルへの保存を行わないため
    if (isMainWindow) visualizerConfigStore.save();
  });

  // ビジュアライザーの全設定プリセットを取得する
  ipcMain.handle('getAllVisualizerPresets', async () => visualizerPresetsStore.getAll());
  // ビジュアライザープリセットを追加する
  ipcMain.handle('addVisualizerPreset', async (_, preset) => visualizerPresetsStore.add(preset));

  // デスクトップ通知を表示する
  ipcMain.handle('showDesktopNotification', async (_, title, body, imagePath) => {
    const window = getWindow();
    if (window && window.isMinimized() && settingsStore.getData()?.showDesktopNotification) {
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
