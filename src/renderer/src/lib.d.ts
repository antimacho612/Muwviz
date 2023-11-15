declare module 'genius-lyrics-api' {
  export function getLyrics({
    apiKey: string,
    title: string,
    artist: string,
    optimizeQuery: boolean,
  });
}
