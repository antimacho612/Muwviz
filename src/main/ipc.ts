import { BrowserWindow, app } from 'electron';
import { createIpcMain } from 'electron-typescript-ipc';
import { ElectronAPI } from '@preload/ipc';

import { win } from '.';
import { albumsStore, artistsStore, songsStore, lyricsStore } from './stores';

const ipcMain = createIpcMain<ElectronAPI>();

export function registerIpcChannels() {
  // アプリのバージョン取得
  ipcMain.handle('getAppVersion', async () => app.getVersion());

  // ウィンドウ最小化
  ipcMain.handle('minimizeWindow', async () => win.minimizable && win.minimize());

  // ウィンドウ最大化切り替え
  ipcMain.handle('maximizeWindow', async () => {
    if (win.maximizable) {
      if (win.isMaximized()) {
        win.restore();
      } else {
        win.maximize();
      }
    }
  });

  // ウィンドウを閉じる
  ipcMain.handle('closeWindow', async () => !win.isDestroyed() && win.close());

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
