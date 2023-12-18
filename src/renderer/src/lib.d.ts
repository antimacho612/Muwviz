declare module 'genius-lyrics-api' {
  export function getLyrics({
    apiKey: string,
    title: string,
    artist: string,
    optimizeQuery: boolean,
  });
}

declare module 'waveform-data' {
  export interface WaveformDataAudioBufferOptions extends WaveformDataAudioBufferOptions {
    disable_worker?: boolean;
  }
}
