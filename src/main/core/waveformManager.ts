import fs from 'fs';
import fsAsync from 'fs/promises';
import path from 'path';
import { WAVEFORMS_DIR } from './paths';

const getDatFilePath = (songId: string) => path.join(WAVEFORMS_DIR, `${songId}.dat`);

/**
 * 波形データをdatファイルから取得し返却する
 * @param songId 対象の楽曲ID
 * @returns 波形データ
 */
export const getWaveformData = async (songId: string) => {
  const datFilePath = getDatFilePath(songId);

  if (!fs.existsSync(datFilePath)) return undefined;

  const dat = await fsAsync.readFile(getDatFilePath(songId));
  return new DataView(dat.buffer);
};

/**
 * 波形データをdatファイルに保存する
 * @param songId 対象の楽曲ID
 * @param waveformData 保存する波形データ
 */
export const saveWaveformData = async (songId: string, waveformData: DataView) => {
  await fsAsync.writeFile(getDatFilePath(songId), waveformData);
};

/**
 * 波形データを削除する
 * @param songId 対象の楽曲ID
 */
export const deleteWaveformData = async (songId: string) => {
  const datFilePath = getDatFilePath(songId);
  if (fs.existsSync(datFilePath)) {
    try {
      await fsAsync.unlink(datFilePath);
    } catch (e) {
      console.error('Failed to delete waveform data', datFilePath, e);
    }
  }
};

/**
 * 全楽曲の波形データを削除する
 */
export const deleteAllWaveformData = async () => {
  const contents = await fsAsync.readdir(WAVEFORMS_DIR);
  contents
    .filter((content) => content.endsWith('.dat'))
    .forEach(async (datFilePath) => {
      try {
        await fsAsync.unlink(datFilePath);
      } catch (e) {
        console.error('Failed to delete waveform data', datFilePath, e);
      }
    });
};
