import fsAsync from 'fs/promises';

export const ensureDirectory = async (path: string) =>
  await fsAsync.mkdir(path, { recursive: true });
