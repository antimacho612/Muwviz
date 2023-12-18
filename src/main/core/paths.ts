import { app } from 'electron';
import path from 'path';

export const ARTWORKS_DIR = path.join(app.getPath('userData'), 'artworks');
export const WAVEFORMS_DIR = path.join(app.getPath('userData'), 'waveforms');
export const STORES_DIR = path.join(app.getPath('userData'), 'stores');
