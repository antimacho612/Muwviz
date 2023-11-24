/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import fsAsync from 'fs/promises';
import path from 'path';
import { ensureDirectory } from '@main/utils';

export default abstract class BaseJSONStore<T extends Record<string, any>> {
  protected readonly jsonDirectory: string;
  protected readonly jsonPath: string;
  protected storedData?: T;
  private caching = true;

  constructor(jsonPath: string, initialize = true) {
    this.jsonDirectory = path.dirname(jsonPath);
    this.jsonPath = jsonPath;
    if (initialize) {
      this.readJson();
    }
  }

  public get data(): T | undefined {
    if (!this.caching) {
      this.readJson();
    }
    return this.storedData;
  }

  private readJson() {
    this.caching = true;

    try {
      const text = fs.readFileSync(this.jsonPath, { encoding: 'utf-8' });
      this.storedData = JSON.parse(text);
    } catch (e) {
      if ((e as any)?.code !== 'ENOENT') {
        throw e;
      }
    }
  }

  public clearCache() {
    this.storedData = undefined;
    this.caching = false;
  }

  public update<K extends keyof T>(key: K, value: T[K]) {
    if (!this.caching) {
      this.readJson();
    }

    if (!this.storedData) {
      throw new Error();
    }

    this.storedData[key] = value;
  }

  public async save(newData = this.storedData) {
    await ensureDirectory(this.jsonDirectory);

    const json = JSON.stringify(newData);
    await fsAsync.writeFile(this.jsonPath, json, { encoding: 'utf-8', mode: 0o666 });

    if (this.caching) {
      this.storedData = newData;
    }
  }
}
