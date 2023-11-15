import { ipcRenderer } from 'electron';
import { GetApiType } from 'electron-typescript-ipc';
import { Album, Artist, LyricsMap, Song } from '@shared/types';

export type ElectronAPI = GetApiType<
  {
    openFileBrowser: (
      file: boolean,
      filters?: Electron.FileFilter[]
    ) => Promise<Electron.OpenDialogReturnValue>;

    /**
     * アプリのバージョンを取得する
     */
    getAppVersion: () => Promise<string>;

    /**
     * ウィンドウを最小化する
     */
    minimizeWindow: () => Promise<void>;

    /**
     * ウィンドウの最大化⇔最大化解除を切り替える
     */
    maximizeWindow: () => Promise<void>;

    /**
     * ウィンドウを閉じる
     */
    closeWindow: () => Promise<void>;

    /**
     * 設定情報を取得する
     */
    getPreferences: () => Promise<string>;

    /**
     * 全楽曲情報を取得する
     */
    getAllSongs: () => Promise<Song[]>;

    /**
     * 全アルバム情報を取得する
     */
    getAllAlbums: () => Promise<Album[]>;

    /**
     * 全アーティスト情報を取得する
     */
    getAllArtists: () => Promise<Artist[]>;

    /**
     * 全歌詞情報を取得する
     */
    getAllLyrics: () => Promise<LyricsMap>;
  },
  {
    /**
     * ウィンドウのサイズ変更時
     */
    windowResized: (isMaximized: boolean) => Promise<void>;
  }
>;

export const electronAPI: ElectronAPI = {
  invoke: {
    openFileBrowser: async (file: boolean, filters?: Electron.FileFilter[]) =>
      await ipcRenderer.invoke('openFileDialog', file, filters),

    getAppVersion: async () => await ipcRenderer.invoke('getAppVersion'),

    minimizeWindow: async () => await ipcRenderer.invoke('minimizeWindow'),
    maximizeWindow: async () => await ipcRenderer.invoke('maximizeWindow'),
    closeWindow: async () => await ipcRenderer.invoke('closeWindow'),

    getPreferences: async () => await ipcRenderer.invoke('getPreferences'),

    getAllSongs: async () => await ipcRenderer.invoke('getAllSongs'),

    getAllAlbums: async () => await ipcRenderer.invoke('getAllAlbums'),

    getAllArtists: async () => await ipcRenderer.invoke('getAllArtists'),

    getAllLyrics: async () => await ipcRenderer.invoke('getAllLyrics'),
  },
  on: {
    windowResized: (listener) => ipcRenderer.on('windowResized', listener),
  },
};
