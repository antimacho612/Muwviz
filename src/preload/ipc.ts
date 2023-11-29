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
      isMainWindow: boolean,
      mode: 'File' | 'Folder',
      filters?: FileFilter[]
    ) => Promise<OpenDialogReturnValue>;

    /**
     * 指定されたパスをデフォルトのアプリケーションで開く
     */
    openPath: (path: string) => Promise<void>;

    /**
     * ビジュアライザー設定ウィンドウを開く
     */
    openVisualizerConfigWindow: () => Promise<void>;

    /**
     * ウィンドウを最小化する
     */
    minimizeWindow: (isMainWindow: boolean) => Promise<void>;

    /**
     * ウィンドウの最大化⇔最大化解除を切り替える
     */
    maximizeWindow: (isMainWindow: boolean) => Promise<void>;

    /**
     * ウィンドウを閉じる
     */
    closeWindow: (isMainWindow: boolean) => Promise<void>;

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

    openFileBrowser: async (
      isMainWindow: boolean,
      mode: 'File' | 'Folder',
      filters?: Electron.FileFilter[]
    ) => await ipcRenderer.invoke('openFileBrowser', isMainWindow, mode, filters),
    openPath: async (path: string) => await ipcRenderer.invoke('openPath', path),

    openVisualizerConfigWindow: async () => await ipcRenderer.invoke('openVisualizerConfigWindow'),

    minimizeWindow: async (isMainWindow: boolean) =>
      await ipcRenderer.invoke('minimizeWindow', isMainWindow),
    maximizeWindow: async (isMainWindow: boolean) =>
      await ipcRenderer.invoke('maximizeWindow', isMainWindow),
    closeWindow: async (isMainWindow: boolean) =>
      await ipcRenderer.invoke('closeWindow', isMainWindow),

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
