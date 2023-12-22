import { defineStore } from 'pinia';
import { getLyrics } from 'genius-lyrics-api';

export type LyricsData = {
  type: 'METADATA' | 'EXTERNAL';
  lyrics?: string | null;
};

type LyricsStoreState = {
  lyricsMap: { [songId: string]: LyricsData };
};

const getLocalDbKey = (songId: string) => `lyric-${songId}`;

export const useLyricsStore = defineStore('lyrics', {
  state: (): LyricsStoreState => {
    return {
      lyricsMap: {},
    };
  },

  actions: {
    fetchLocalDb(songId: string) {
      const key = getLocalDbKey(songId);
      const dbItem = localStorage.getItem(key);
      const parsedData = dbItem ? (JSON.parse(dbItem) as LyricsData) : undefined;

      let lyricsData: LyricsData;
      if (parsedData) {
        lyricsData = parsedData;
      } else {
        lyricsData = {
          type: 'METADATA',
        };
        localStorage.setItem(key, JSON.stringify(lyricsData));
      }

      this.lyricsMap[songId] = lyricsData;
      return lyricsData;
    },

    async fetchApi(_songId: string, _title: string, _artist: string) {
      // TODO:
      console.log('fetchApi');

      const options = {
        apiKey: 'NiD8kHwPkM6ADr5k5vELd9U_MEETq2yovtnGaj87ZGwaR8NGepBqdEFoUAhDU7k2',
        title: 'Posthumous Forgiveness',
        artist: 'Tame Impala',
        optimizeQuery: true,
      };

      const lyrics = await getLyrics(options);

      console.log(lyrics);
    },

    async rebuild() {
      try {
        const lyricsMap = await window.electron.invoke.getAllLyrics();
        Object.keys(lyricsMap).forEach((songId) => {
          const key = getLocalDbKey(songId);
          if (!Object.hasOwn(localStorage, key)) {
            const data: LyricsData = {
              type: 'METADATA',
              lyrics: lyricsMap[songId],
            };
            localStorage.setItem(key, JSON.stringify(data));
          }
        });
      } catch (e) {
        console.error(e);
      } finally {
        await window.electron.invoke.clearLyricsCache();
      }
    },
  },
});
