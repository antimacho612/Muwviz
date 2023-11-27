/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import fsAsync from 'fs/promises';
import path from 'path';
import { ensureDirectory } from '@main/utils';

export default abstract class BaseJSONStore<T> {
  protected readonly jsonDirectory: string;
  protected readonly jsonPath: string;
  private _cachedData?: T;
  private _caching = true;

  constructor(jsonPath: string, initialize = true) {
    this.jsonDirectory = path.dirname(jsonPath);
    this.jsonPath = jsonPath;
    if (initialize) {
      this.readJson();
    }
  }

  protected get cachedData() {
    if (!this._caching) {
      this.readJson();
    }
    return this._cachedData;
  }

  protected set cachedData(data: T | undefined) {
    this._caching = true;
    this._cachedData = data;
  }

  public getData(): T | undefined {
    return structuredClone(this.cachedData);
  }

  private readJson() {
    this._caching = true;

    try {
      const text = fs.readFileSync(this.jsonPath, { encoding: 'utf-8' });
      this._cachedData = JSON.parse(text);
    } catch (e) {
      if ((e as any)?.code !== 'ENOENT') {
        throw e;
      }
    }
  }

  public clearCache() {
    this._cachedData = undefined;
    this._caching = false;
  }

  public async save(newData = this._cachedData) {
    await ensureDirectory(this.jsonDirectory);

    const json = JSON.stringify(newData);
    await fsAsync.writeFile(this.jsonPath, json, { encoding: 'utf-8', mode: 0o666 });

    if (this._caching) {
      this._cachedData = newData;
    }
  }
}
