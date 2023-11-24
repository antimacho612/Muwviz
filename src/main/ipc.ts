import { app, BrowserWindow, shell } from 'electron';
import { createIpcMain } from 'electron-typescript-ipc';
import { ElectronAPI } from '@preload/ipc';

import { albumsStore, artistsStore, songsStore, lyricsStore, settingsStore } from './stores';
import { KeyValue, Settings } from '@shared/types';
import mainWindow from './mainWindow';
import { ARTWORK_DIR } from './core/paths';

const ipcMain = createIpcMain<ElectronAPI>();

export function registerIpcChannels() {
  // アプリのバージョンを取得する
  ipcMain.handle('getAppVersion', async () => app.getVersion());

  // アートワークの保存先を取得する
  ipcMain.handle('getArtworkPath', async () => ARTWORK_DIR);

  // 指定されたパスをデフォルトのアプリケーションで開く
  ipcMain.handle('openPath', async (_, path) => shell.openPath(path));

  // ウィンドウを最小化する
  ipcMain.handle('minimizeWindow', async () => mainWindow.minimize());

  // ウィンドウの最大化⇔最大化解除を切り替える
  ipcMain.handle('maximizeWindow', async () => mainWindow.maximize());

  // ウィンドウを閉じる
  ipcMain.handle('closeWindow', async () => mainWindow.close());

  // 設定を取得する
  ipcMain.handle('getSettings', async () => settingsStore.data);
  // 設定を更新する
  ipcMain.handle('updateSettings', async (_, items: KeyValue<Settings>[]) =>
    items.forEach((item) => settingsStore.update(item.key, item.value))
  );

  // 全楽曲情報を取得する
  ipcMain.handle('getAllSongs', async () => songsStore.data);

  // 全アルバム情報を取得する
  ipcMain.handle('getAllAlbums', async () => albumsStore.data);

  // 全アーティスト情報を取得する
  ipcMain.handle('getAllArtists', async () => artistsStore.data);

  // 全歌詞情報を取得する
  ipcMain.handle('getAllLyrics', async () => {
    const lyrics = lyricsStore.data;
    lyricsStore.clearCache();
    return lyrics;
  });
}

export function registerWindowIpcListener(window: BrowserWindow) {
  // ウィンドウリサイズ時: リサイズ後のウィンドウが最大化された状態かどうかを返却する
  window.on('resize', () => {
    ipcMain.send(window, 'windowResized', window.isMaximized());
  });
}
