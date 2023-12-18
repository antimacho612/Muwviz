import fsAsync from 'fs/promises';
import path from 'path';
import { WAVEFORMS_DIR } from './paths';

export const saveWaveformData = async (songId: string, waveformData: DataView) => {
  await fsAsync.writeFile(path.join(WAVEFORMS_DIR, `${songId}.dat`), waveformData);
};

export const getWaveformData = async (songId: string) => {
  const dat = await fsAsync.readFile(path.join(WAVEFORMS_DIR, `${songId}.dat`));
  return new DataView(dat.buffer);
};
