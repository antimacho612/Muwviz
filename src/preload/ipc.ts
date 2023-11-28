import { FileFilter, OpenDialogReturnValue, ipcRenderer } from 'electron';
import { GetApiType } from 'electron-typescript-ipc';
import {
  Album,
  Artist,
  KeyValue,
  Lyrics,
  ScanProgress,
  ScannedFolder,
  Settings,
  Song,
} from '@shared/types';

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
     * @param mode モード（ファイル選択 or フォルダ選択）
     * @param filters ファイルフィルタ（ファイル選択モード時のみ有効）
     */
    openFileBrowser: (
      mode: 'File' | 'Folder',
      filters?: FileFilter[]
    ) => Promise<OpenDialogReturnValue>;

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
    updateSettings: (items: KeyValue<Omit<Settings, 'scannedFolders'>>[]) => Promise<void>;

    /**
     * スキャン済みフォルダ情報を取得する
     */
    getScannedFolders: () => Promise<ScannedFolder[]>;

    /**
     * フォルダをスキャンし楽曲ライブラリを構築する
     * @param folderPath スキャン対象のフォルダパス
     * @param resortLibrary スキャン後にライブラリ（楽曲、アルバム、アーティスト）をソートしなおすかどうか
     */
    scanFolder: (folderPath: string, resortLibrary?: boolean) => Promise<void>;

    /**
     * スキャンIDに紐づく楽曲、その他関連情報をライブラリから削除する
     */
    deleteEntitiesByScanId: (scanId: string) => Promise<void>;

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
    getAllLyrics: () => Promise<Lyrics>;
  },
  {
    /**
     * ウィンドウのサイズ変更時
     */
    resizeWindow: (isMaximized: boolean) => Promise<void>;

    /**
     * スキャンの進捗状況送信時
     */
    updateScanProgress: (progress: ScanProgress) => Promise<void>;

    /**
     * スキャン済みフォルダの情報変更時
     */
    updateScannedFolders: (scannedFolders: ScannedFolder[]) => Promise<void>;
  }
>;

export const electronAPI: ElectronAPI = {
  invoke: {
    getAppVersion: async () => await ipcRenderer.invoke('getAppVersion'),
    getArtworkPath: async () => await ipcRenderer.invoke('getArtworkPath'),

    openFileBrowser: async (mode: 'File' | 'Folder', filters?: Electron.FileFilter[]) =>
      await ipcRenderer.invoke('openFileBrowser', mode, filters),
    openPath: async (path: string) => await ipcRenderer.invoke('openPath', path),

    minimizeWindow: async () => await ipcRenderer.invoke('minimizeWindow'),
    maximizeWindow: async () => await ipcRenderer.invoke('maximizeWindow'),
    closeWindow: async () => await ipcRenderer.invoke('closeWindow'),

    getSettings: async () => await ipcRenderer.invoke('getSettings'),
    updateSettings: async (items: KeyValue<Omit<Settings, 'scannedFolders'>>[]) =>
      await ipcRenderer.invoke('updateSettings', items),

    getScannedFolders: async () => await ipcRenderer.invoke('getScannedFolders'),
    scanFolder: async (folderPath: string, resortLibrary?: boolean) =>
      await ipcRenderer.invoke('scanFolder', folderPath, resortLibrary),
    deleteEntitiesByScanId: async (scanId: string) =>
      await ipcRenderer.invoke('deleteEntitiesByScanId', scanId),

    getAllSongs: async () => await ipcRenderer.invoke('getAllSongs'),
    getAllAlbums: async () => await ipcRenderer.invoke('getAllAlbums'),
    getAllArtists: async () => await ipcRenderer.invoke('getAllArtists'),
    getAllLyrics: async () => await ipcRenderer.invoke('getAllLyrics'),
  },
  on: {
    resizeWindow: (listener) => ipcRenderer.on('resizeWindow', listener),
    updateScanProgress: (listener) => ipcRenderer.on('updateScanProgress', listener),
    updateScannedFolders: (listener) => ipcRenderer.on('updateScannedFolders', listener),
  },
};
