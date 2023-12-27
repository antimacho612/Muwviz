import fs from 'fs';
import fsAsync from 'fs/promises';
import Jimp from 'jimp';
import { xxHash32 } from 'js-xxhash';
import { IPicture } from 'music-metadata';
import path from 'path';
import { ARTWORKS_DIR } from './paths';
import { songsStore, albumsStore } from '..';

export const saveArtwork = async (picture: IPicture) => {
  const hashedFileName = xxHash32(picture.data).toString(16);

  const filePath = path.join(ARTWORKS_DIR, `${hashedFileName}.png`);
  if (!fs.existsSync(filePath)) {
    console.debug('Saving artwork...', filePath);
    try {
      const image = await Jimp.read(picture.data);
      image.contain(256, 256);
      await image.writeAsync(filePath);
    } catch (e) {
      console.error('Failed to save artwork', e);
    }
  }

  return filePath;
};

export const deleteAllArtworks = async () => {
  const contents = await fsAsync.readdir(ARTWORKS_DIR);
  contents
    .filter((content) => content.endsWith('.png'))
    .forEach(async (artwork) => {
      const artworkPath = path.join(ARTWORKS_DIR, artwork);
      try {
        await fsAsync.unlink(artworkPath);
      } catch (e) {
        console.error('Failed to delete artwork', artworkPath, e);
      }
    });
};

export const deleteArtworksIfNoReferred = async (artworkPaths: ReadonlySet<string>) => {
  const songs = songsStore.getAll();
  const albums = albumsStore.getAll();

  for (const artworkPath of artworkPaths) {
    if (
      songs?.some((song) => song.artworkPath === artworkPath) ||
      albums?.some((album) => album.artworkPath === artworkPath)
    ) {
      // まだ使用されているため削除しない
      return;
    }

    if (fs.existsSync(artworkPath)) {
      try {
        await fsAsync.unlink(artworkPath);
      } catch (e) {
        console.error('Failed to delete artwork', artworkPath, e);
      }
    }
  }
};
