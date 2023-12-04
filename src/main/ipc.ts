import { ElectronAPI } from '@preload/ipc';
import { KeyValue, ScanProgress, Settings } from '@shared/types';
import { app, shell } from 'electron';
import { createIpcMain } from 'electron-typescript-ipc';
import {
  albumsStore,
  artistsStore,
  lyricsStore,
  scannedFoldersStore,
  settingsStore,
  songsStore,
  visualizerConfigStore,
} from '.';
import { ARTWORK_DIR } from './core/paths';
import { scanFolder } from './core/scanner';
import {
  closeWindow,
  createSubWindow,
  getWindow,
  isWindowMaximized,
  maximizeWindow,
  minimizeWindow,
  openFileBrowser,
} from './window';
import { deleteEntitiesByScanId } from './core/libraryManager';

const ipcMain = createIpcMain<ElectronAPI>();

export const registerIpcChannels = () => {
  // アプリのバージョンを取得する
  ipcMain.handle('getAppVersion', async () => app.getVersion());

  // アートワークの保存先を取得する
  ipcMain.handle('getArtworkPath', async () => ARTWORK_DIR);

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

  // 設定を取得する
  ipcMain.handle('getSettings', async () => settingsStore.getData());
  // 設定を更新する
  ipcMain.handle('updateSettings', async (_, items: KeyValue<Omit<Settings, 'scannedFolders'>>[]) =>
    items.forEach((item) => settingsStore.update(item.key, item.value))
  );

  // スキャン済みフォルダ情報を取得する
  ipcMain.handle('getScannedFolders', async () => scannedFoldersStore.getData());
  // フォルダをスキャンし楽曲ライブラリを構築する
  ipcMain.handle(
    'scanFolder',
    async (_, folderPath, resortLibrary) => await scanFolder(folderPath, resortLibrary)
  );
  // スキャンIDに紐づく楽曲、その他関連情報をライブラリから削除する
  ipcMain.handle(
    'deleteEntitiesByScanId',
    async (_, scanId) => await deleteEntitiesByScanId(scanId)
  );

  // 全楽曲情報を取得する
  ipcMain.handle('getAllSongs', async () => songsStore.getData());

  // 全アルバム情報を取得する
  ipcMain.handle('getAllAlbums', async () => albumsStore.getData());

  // 全アーティスト情報を取得する
  ipcMain.handle('getAllArtists', async () => artistsStore.getData());

  // 全歌詞情報を取得する
  ipcMain.handle('getAllLyrics', async () => {
    const lyrics = lyricsStore.getData();
    lyricsStore.clearCache();
    return lyrics;
  });

  // 全ビジュアライザーの設定情報を取得する
  ipcMain.handle('getAllVisualizerConfig', async () => visualizerConfigStore.getVisualizerConfig());

  // ビジュアライザーの設定を更新する
  ipcMain.handle('updateVisualizerConfig', async (_, index, options) =>
    visualizerConfigStore.setVisualizerConfig(index, options)
  );
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
 * スキャン済みフォルダ情報をメインウィンドウに通知する
 */
export const sendScannedFoldersToMain = () => {
  const window = getWindow();
  window && ipcMain.send(window, 'updateScannedFolders', scannedFoldersStore.getAll());
};
