import { defineStore } from 'pinia';
// import { getLyrics } from 'genius-lyrics-api';

export type LyricsData = {
  type: 'METADATA' | 'EXTERNAL';
  lyrics?: string | null;
};

type LyricsStoreState = {
  lyricsMap: { [songId: string]: LyricsData };
};

const getLocalDbKey = (songId: string) => `lyrics-${songId}`;

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

    // TODO: 未実装
    // async fetchApi(_songId: string, title: string, artist: string) {
    //   const options = {
    //     apiKey: 'NiD8kHwPkM6ADr5k5vELd9U_MEETq2yovtnGaj87ZGwaR8NGepBqdEFoUAhDU7k2',
    //     title,
    //     artist,
    //     optimizeQuery: true,
    //   };

    //   await getLyrics(options);
    // },

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

    delete(songId: string) {
      delete this.lyricsMap[songId];
      localStorage.removeItem(getLocalDbKey(songId));
    },

    deleteAll() {
      this.lyricsMap = {};

      const targetKeys = Array<string>();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('lyrics-')) {
          targetKeys.push(key);
        }
      }

      targetKeys.forEach((key) => localStorage.removeItem(key));
    },
  },
});
