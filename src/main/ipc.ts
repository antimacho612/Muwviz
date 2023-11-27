import { ElectronAPI } from '@preload/ipc';
import { KeyValue, Settings } from '@shared/types';
import { app, dialog, shell } from 'electron';
import { createIpcMain } from 'electron-typescript-ipc';
import {
  albumsStore,
  artistsStore,
  lyricsStore,
  mainWindow,
  scannedFoldersStore,
  settingsStore,
  songsStore,
} from '.';
import { ARTWORK_DIR } from './core/paths';
import { scanFolder } from './core/scanner';
import { closeWindow, maximizeWindow, minimizeWindow } from './window';
import { deleteEntitiesByScanId } from './core/libraryManager';

const ipcMain = createIpcMain<ElectronAPI>();

export const registerIpcChannels = () => {
  // アプリのバージョンを取得する
  ipcMain.handle('getAppVersion', async () => app.getVersion());

  // アートワークの保存先を取得する
  ipcMain.handle('getArtworkPath', async () => ARTWORK_DIR);

  // ファイルブラウザを開く
  ipcMain.handle(
    'openFileBrowser',
    async (_, mode, filters) =>
      await dialog.showOpenDialog(mainWindow, {
        properties: [mode === 'File' ? 'openFile' : 'openDirectory'],
        filters,
      })
  );

  // 指定されたパスをデフォルトのアプリケーションで開く
  ipcMain.handle('openPath', async (_, path) => shell.openPath(path));

  // ウィンドウを最小化する
  ipcMain.handle('minimizeWindow', async () => minimizeWindow(mainWindow));

  // ウィンドウの最大化⇔最大化解除を切り替える
  ipcMain.handle('maximizeWindow', async () => maximizeWindow(mainWindow));

  // ウィンドウを閉じる
  ipcMain.handle('closeWindow', async () => closeWindow(mainWindow));

  // 設定を取得する
  ipcMain.handle('getSettings', async () => settingsStore.getData());
  // 設定を更新する
  ipcMain.handle('updateSettings', async (_, items: KeyValue<Omit<Settings, 'scannedFolders'>>[]) =>
    items.forEach((item) => settingsStore.update(item.key, item.value))
  );

  // スキャン済みフォルダ情報を取得する
  ipcMain.handle('getScannedFolders', async () => await scannedFoldersStore.getData());
  // フォルダをスキャンし楽曲ライブラリを構築する
  ipcMain.handle('scanFolder', async (_, folderPath, resortLibrary) =>
    scanFolder(folderPath, resortLibrary)
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
};

export const sendToRenderer = ipcMain.send;
