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
import { VisualizerConfig } from '@shared/visualizerTypes';

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
     * ウィンドウが最大化された状態かどうかを取得する
     */
    isWindowMaximized: (isMainWindow: boolean) => Promise<boolean>;

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
     * ウィンドウが常に他のウィンドウの上に表示されるようになっているかどうかを取得する
     */
    isWindowAlwaysOnTop: (isMainWindow: boolean) => Promise<boolean>;

    /**
     * ウィンドウを常に他のウィンドウの上に表示するかどうかを設定する
     * @param isMainWindow 設定対象がメインウィンドウかどうか
     * @param flag トップに表示するかどうか
     */
    setWindowAlwaysOnTop: (isMainWindow: boolean, flag: boolean) => Promise<void>;

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

    /**
     * 全ビジュアライザーの設定情報を取得する
     */
    getAllVisualizerConfig: () => Promise<VisualizerConfig[]>;

    /**
     * ビジュアライザーの設定を更新する
     * @param index 更新対象のビジュアライザーのインデックス
     * @param options 更新内容
     */
    updateVisualizerConfig: (index: number, options: Partial<VisualizerConfig>) => Promise<void>;
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

    openFileBrowser: async (isMainWindow, mode, filters) =>
      await ipcRenderer.invoke('openFileBrowser', isMainWindow, mode, filters),
    openPath: async (path) => await ipcRenderer.invoke('openPath', path),

    openVisualizerConfigWindow: async () => await ipcRenderer.invoke('openVisualizerConfigWindow'),

    isWindowMaximized: async (isMainWindow) =>
      await ipcRenderer.invoke('isWindowMaximized', isMainWindow),
    minimizeWindow: async (isMainWindow) =>
      await ipcRenderer.invoke('minimizeWindow', isMainWindow),
    maximizeWindow: async (isMainWindow) =>
      await ipcRenderer.invoke('maximizeWindow', isMainWindow),
    closeWindow: async (isMainWindow) => await ipcRenderer.invoke('closeWindow', isMainWindow),
    isWindowAlwaysOnTop: async (isMainWindow) =>
      await ipcRenderer.invoke('isWindowAlwaysOnTop', isMainWindow),
    setWindowAlwaysOnTop: async (isMainWindow, flag) =>
      await ipcRenderer.invoke('setWindowAlwaysOnTop', isMainWindow, flag),

    getSettings: async () => await ipcRenderer.invoke('getSettings'),
    updateSettings: async (items: KeyValue<Omit<Settings, 'scannedFolders'>>[]) =>
      await ipcRenderer.invoke('updateSettings', items),

    getScannedFolders: async () => await ipcRenderer.invoke('getScannedFolders'),
    scanFolder: async (folderPath, resortLibrary) =>
      await ipcRenderer.invoke('scanFolder', folderPath, resortLibrary),
    deleteEntitiesByScanId: async (scanId) =>
      await ipcRenderer.invoke('deleteEntitiesByScanId', scanId),

    getAllSongs: async () => await ipcRenderer.invoke('getAllSongs'),
    getAllAlbums: async () => await ipcRenderer.invoke('getAllAlbums'),
    getAllArtists: async () => await ipcRenderer.invoke('getAllArtists'),
    getAllLyrics: async () => await ipcRenderer.invoke('getAllLyrics'),

    getAllVisualizerConfig: async () => await ipcRenderer.invoke('getAllVisualizerConfig'),
    updateVisualizerConfig: async (index, options) =>
      await ipcRenderer.invoke('updateVisualizerConfig', index, options),
  },
  on: {
    resizeWindow: (listener) => ipcRenderer.on('resizeWindow', listener),
    updateScanProgress: (listener) => ipcRenderer.on('updateScanProgress', listener),
    updateScannedFolders: (listener) => ipcRenderer.on('updateScannedFolders', listener),
  },
};
