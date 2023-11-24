import path from 'path';
import { STORES_DIR } from '@main/core/paths';
import SongsStore from './songs';
import AlbumsStore from './albums';
import ArtistsStore from './artists';
import LyricsStore from './lyrics';
import SettingsStore from './settings';

export const songsStore = new SongsStore(path.join(STORES_DIR, 'songs.json'));
export const albumsStore = new AlbumsStore(path.join(STORES_DIR, 'albums.json'));
export const artistsStore = new ArtistsStore(path.join(STORES_DIR, 'artists.json'));
export const lyricsStore = new LyricsStore(path.join(STORES_DIR, 'lyrics.json'));
export const settingsStore = new SettingsStore(path.join(STORES_DIR, 'settings.json'));
