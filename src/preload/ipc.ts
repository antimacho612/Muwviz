import { FileFilter, MessageBoxReturnValue, OpenDialogReturnValue, ipcRenderer } from 'electron';
import { GetApiType } from 'electron-typescript-ipc';
import { Album, Artist, Lyrics, ScanProgress, ScannedFolder, Settings, Song, UpdatableSettings } from '@shared/types';
import { VisualizerConfig, VisualizerPreset } from '@shared/visualizerTypes';

export type ElectronAPI = GetApiType<
  {
    /**
     * アプリのバージョンを取得する
     */
    getAppVersion: () => Promise<string>;

    /**
     * アプリケーションを初期化する
     */
    initializeApp: () => Promise<void>;

    /**
     * アプリケーションを再起動する
     */
    relaunchApp: () => Promise<void>;

    /**
     * アプリケーションのアップデート有無をチェックする
     */
    checkUpdates: () => Promise<void>;

    /**
     * アプリケーションをアップデートする
     */
    updateApp: () => Promise<void>;

    /**
     * アートワークの保存先を取得する
     */
    getArtworkPath: () => Promise<string>;

    /**
     * 波形データの保存先を取得する
     */
    getWaveformPath: () => Promise<string>;

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
     * 確認メッセージを表示する
     * @param isMainWindow 表示対象がメインウィンドウかどうか
     * @param message メッセージ
     * @param detail 詳細
     */
    showConfirm: (isMainWindow: boolean, message: string, detail?: string) => Promise<MessageBoxReturnValue>;

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
    updateSettings: <K extends keyof UpdatableSettings>(key: K, value: UpdatableSettings[K]) => Promise<void>;

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
     * 全楽曲情報を取得する
     */
    getAllSongs: () => Promise<Song[]>;

    /**
     * 楽曲情報のキャッシュ（メイン側で保持しているデータ）を削除する
     */
    clearSongsCache: () => Promise<void>;

    /**
     * ライブラリから楽曲を削除する
     * @param songIds 削除する楽曲のID
     */
    removeSongsFromLibrary: (songIds: string[]) => Promise<void>;

    /**
     * ライブラリを初期化する
     */
    initializeLibrary: () => Promise<void>;

    /**
     * 全アルバム情報を取得する
     */
    getAllAlbums: () => Promise<Album[]>;

    /**
     * アルバム情報のキャッシュ（メイン側で保持しているデータ）を削除する
     */
    clearAlbumsCache: () => Promise<void>;

    /**
     * 全アーティスト情報を取得する
     */
    getAllArtists: () => Promise<Artist[]>;

    /**
     * アーティスト情報のキャッシュ（メイン側で保持しているデータ）を削除する
     */
    clearArtistsCache: () => Promise<void>;

    /**
     * 全歌詞情報を取得する
     */
    getAllLyrics: () => Promise<Lyrics>;

    /**
     * 波形データを取得する
     * @param songId 対象の楽曲のID
     */
    getWaveformData: (songId: string) => Promise<DataView | undefined>;

    /**
     * 波形データを保存する
     * @param songId 対象の楽曲のID
     * @param waveformData 波形データ
     */
    saveWaveformData: (songId: string, waveformData: DataView) => Promise<void>;

    /**
     * 歌詞情報のキャッシュ（メイン側で保持しているデータ）を削除する
     */
    clearLyricsCache: () => Promise<void>;

    /**
     * 全ビジュアライザーの設定情報を取得する
     */
    getAllVisualizersConfig: () => Promise<VisualizerConfig[]>;

    /**
     * ビジュアライザーの設定を更新する
     * @param index 更新対象のビジュアライザーのインデックス
     * @param options 更新内容
     * @param isMainWindow メインウィンドウからの更新かどうか
     */
    updateVisualizerConfig: (
      index: number,
      options: Partial<VisualizerConfig>,
      isMainWindow?: boolean
    ) => Promise<void>;

    /**
     * ビジュアライザーの全設定プリセットを取得する
     */
    getAllVisualizerPresets: () => Promise<VisualizerPreset[]>;

    /**
     * ビジュアライザーの設定プリセットを追加する
     * @param preset 追加するプリセット
     */
    addVisualizerPreset: (preset: VisualizerPreset) => Promise<void>;

    /**
     * ビジュアライザーの設定プリセットを削除する
     * @param id 削除するプリセットのID
     */
    deleteVisualizerPreset: (id: string) => Promise<void>;

    /**
     * デスクトップ通知を表示する
     * @param title タイトル
     * @param body 本文
     * @param imagePath イメージのパス
     */
    showDesktopNotification: (title: string, body: string, imagePath?: string) => Promise<void>;
  },
  {
    /**
     * アプリケーションのアップデートが可能になったことをメインウィンドウに通知する
     */
    isAppUpdateAvailable: () => Promise<void>;

    /**
     * ウィンドウのサイズ変更時
     */
    resizeWindow: (isMaximized: boolean) => Promise<void>;

    /**
     * スキャンの進捗状況送信時
     */
    updateScanProgress: (progress: ScanProgress) => Promise<void>;

    /**
     * 楽曲の再生命令送信時
     */
    sendPlaySongCommand: () => Promise<void>;

    /**
     * 楽曲の再生一時停止命令送信時
     */
    sendPauseSongCommand: () => Promise<void>;

    /**
     * 前の楽曲再生命令送信時
     */
    sendPrevSongCommand: () => Promise<void>;

    /**
     * 次の楽曲の再生命令送信時
     */
    sendNextSongCommand: () => Promise<void>;

    /**
     * スキャン済みフォルダの情報変更時
     */
    updateScannedFolders: (scannedFolders: ScannedFolder[]) => Promise<void>;
  }
>;

export const electronAPI: ElectronAPI = {
  invoke: {
    getAppVersion: async () => await ipcRenderer.invoke('getAppVersion'),
    initializeApp: async () => await ipcRenderer.invoke('initializeApp'),
    relaunchApp: async () => await ipcRenderer.invoke('relaunchApp'),
    checkUpdates: async () => await ipcRenderer.invoke('checkUpdates'),
    updateApp: async () => await ipcRenderer.invoke('updateApp'),

    getArtworkPath: async () => await ipcRenderer.invoke('getArtworkPath'),
    getWaveformPath: async () => await ipcRenderer.invoke('getWaveformPath'),

    openFileBrowser: async (isMainWindow, mode, filters) =>
      await ipcRenderer.invoke('openFileBrowser', isMainWindow, mode, filters),
    showConfirm: async (isMainWindow, message, detail) =>
      await ipcRenderer.invoke('showConfirm', isMainWindow, message, detail),
    openPath: async (path) => await ipcRenderer.invoke('openPath', path),

    openVisualizerConfigWindow: async () => await ipcRenderer.invoke('openVisualizerConfigWindow'),

    isWindowMaximized: async (isMainWindow) => await ipcRenderer.invoke('isWindowMaximized', isMainWindow),
    minimizeWindow: async (isMainWindow) => await ipcRenderer.invoke('minimizeWindow', isMainWindow),
    maximizeWindow: async (isMainWindow) => await ipcRenderer.invoke('maximizeWindow', isMainWindow),
    closeWindow: async (isMainWindow) => await ipcRenderer.invoke('closeWindow', isMainWindow),
    isWindowAlwaysOnTop: async (isMainWindow) => await ipcRenderer.invoke('isWindowAlwaysOnTop', isMainWindow),
    setWindowAlwaysOnTop: async (isMainWindow, flag) =>
      await ipcRenderer.invoke('setWindowAlwaysOnTop', isMainWindow, flag),

    getSettings: async () => await ipcRenderer.invoke('getSettings'),
    updateSettings: async (key, value) => await ipcRenderer.invoke('updateSettings', key, value),

    getScannedFolders: async () => await ipcRenderer.invoke('getScannedFolders'),
    scanFolder: async (folderPath, resortLibrary) => await ipcRenderer.invoke('scanFolder', folderPath, resortLibrary),
    initializeLibrary: async () => await ipcRenderer.invoke('initializeLibrary'),
    removeSongsFromLibrary: async (songIds) => await ipcRenderer.invoke('removeSongsFromLibrary', songIds),

    getAllSongs: async () => await ipcRenderer.invoke('getAllSongs'),
    clearSongsCache: async () => await ipcRenderer.invoke('clearSongsCache'),
    getAllAlbums: async () => await ipcRenderer.invoke('getAllAlbums'),
    clearAlbumsCache: async () => await ipcRenderer.invoke('clearAlbumsCache'),
    getAllArtists: async () => await ipcRenderer.invoke('getAllArtists'),
    clearArtistsCache: async () => await ipcRenderer.invoke('clearArtistsCache'),
    getAllLyrics: async () => await ipcRenderer.invoke('getAllLyrics'),
    clearLyricsCache: async () => await ipcRenderer.invoke('clearLyricsCache'),

    getWaveformData: async (songId) => await ipcRenderer.invoke('getWaveformData', songId),
    saveWaveformData: async (songId, waveformData) =>
      await ipcRenderer.invoke('saveWaveformData', songId, waveformData),

    getAllVisualizersConfig: async () => await ipcRenderer.invoke('getAllVisualizersConfig'),
    updateVisualizerConfig: async (index, options, isMainWindow = false) =>
      await ipcRenderer.invoke('updateVisualizerConfig', index, options, isMainWindow),

    getAllVisualizerPresets: async () => await ipcRenderer.invoke('getAllVisualizerPresets'),
    addVisualizerPreset: async (preset) => await ipcRenderer.invoke('addVisualizerPreset', preset),
    deleteVisualizerPreset: async (id) => await ipcRenderer.invoke('deleteVisualizerPreset', id),

    showDesktopNotification: async (title, body, imagePath) =>
      await ipcRenderer.invoke('showDesktopNotification', title, body, imagePath),
  },
  on: {
    isAppUpdateAvailable: (listener) => ipcRenderer.on('isAppUpdateAvailable', listener),

    resizeWindow: (listener) => ipcRenderer.on('resizeWindow', listener),

    sendPlaySongCommand: (listener) => ipcRenderer.on('sendPlaySongCommand', listener),
    sendPauseSongCommand: (listener) => ipcRenderer.on('sendPauseSongCommand', listener),
    sendPrevSongCommand: (listener) => ipcRenderer.on('sendPrevSongCommand', listener),
    sendNextSongCommand: (listener) => ipcRenderer.on('sendNextSongCommand', listener),

    updateScanProgress: (listener) => ipcRenderer.on('updateScanProgress', listener),
    updateScannedFolders: (listener) => ipcRenderer.on('updateScannedFolders', listener),
  },
};
