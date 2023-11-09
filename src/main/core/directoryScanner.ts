import * as fsAsync from 'fs/promises';
import * as path from 'path';

export async function scanDirectory(directory: string) {
  let files: string[] = [];

  const dirents = await fsAsync.readdir(directory, { withFileTypes: true });
  for (const dirent of dirents) {
    if (dirent.isFile() && dirent.name.match(/.(aac|mp3|ogg|wav|flac|webm|m4a)$/)) {
      files.push(path.join(directory, dirent.name));
    } else if (dirent.isDirectory()) {
      files = [...files, ...(await scanDirectory(path.join(directory, dirent.name)))];
    }
  }
  return files;
}
