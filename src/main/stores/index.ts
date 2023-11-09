import { app } from 'electron';
import path from 'path';
import SongsStore from './songs';
import AlbumsStore from './albums';
import ArtistsStore from './artists';

const storesDirectory = path.join(app.getPath('userData'), 'stores');

export const songsStore = new SongsStore(path.join(storesDirectory, 'songs.json'));
export const albumsStore = new AlbumsStore(path.join(storesDirectory, 'albums.json'));
export const artistsStore = new ArtistsStore(path.join(storesDirectory, 'artists.json'));
