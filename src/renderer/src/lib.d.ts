declare module 'genius-lyrics-api' {
  export function getLyrics({ apiKey: string, title: string, artist: string, optimizeQuery: boolean });
}

declare module 'waveform-data' {
  export * from 'waveform-data';

  export interface WaveformDataAudioBufferOptions extends WaveformData.WaveformDataAudioBufferOptions {
    /**
     * Set to true to disable use of a Web Worker
     * @note ライブラリの型定義ファイルに定義がないため追加
     */
    disable_worker?: boolean;
  }
}
