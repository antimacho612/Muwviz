import { app } from 'electron';
import path from 'path';

export const ARTWORK_DIR = path.join(app.getPath('userData'), 'artworks');
export const STORES_DIR = path.join(app.getPath('userData'), 'stores');
