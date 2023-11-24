import { ipcRenderer } from 'electron';
import { GetApiType } from 'electron-typescript-ipc';
import { Album, Artist, KeyValue, LyricsMap, Settings, Song } from '@shared/types';

export type ElectronAPI = GetApiType<
  {
    /**
     * アプリのバージョンを取得する
     */
    getAppVersion: () => Promise<string>;

    /**
     * アートワークの保存先を取得する
     */
    getArtworkPath: () => Promise<string>;

    /**
     * ファイルブラウザを開く
     */
    openFileBrowser: (
      file: boolean,
      filters?: Electron.FileFilter[]
    ) => Promise<Electron.OpenDialogReturnValue>;

    /**
     * 指定されたパスをデフォルトのアプリケーションで開く
     */
    openPath: (path: string) => Promise<void>;

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
     * 設定を取得する
     */
    getSettings: () => Promise<Settings>;

    /**
     * 設定を更新する
     */
    updateSettings: (items: KeyValue<Settings>[]) => Promise<void>;

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
    getAppVersion: async () => await ipcRenderer.invoke('getAppVersion'),
    getArtworkPath: async () => await ipcRenderer.invoke('getArtworkPath'),

    openFileBrowser: async (file: boolean, filters?: Electron.FileFilter[]) =>
      await ipcRenderer.invoke('openFileDialog', file, filters),
    openPath: async (path: string) => await ipcRenderer.invoke('openPath', path),

    minimizeWindow: async () => await ipcRenderer.invoke('minimizeWindow'),
    maximizeWindow: async () => await ipcRenderer.invoke('maximizeWindow'),
    closeWindow: async () => await ipcRenderer.invoke('closeWindow'),

    getSettings: async () => await ipcRenderer.invoke('getSettings'),
    updateSettings: async (items: KeyValue<Settings>[]) =>
      await ipcRenderer.invoke('updateSettings', items),

    getAllSongs: async () => await ipcRenderer.invoke('getAllSongs'),

    getAllAlbums: async () => await ipcRenderer.invoke('getAllAlbums'),

    getAllArtists: async () => await ipcRenderer.invoke('getAllArtists'),

    getAllLyrics: async () => await ipcRenderer.invoke('getAllLyrics'),
  },
  on: {
    windowResized: (listener) => ipcRenderer.on('windowResized', listener),
  },
};
