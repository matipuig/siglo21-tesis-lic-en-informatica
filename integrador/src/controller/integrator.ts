import crypto from 'crypto';
import chokidar from 'chokidar';
import fs from 'fs';
import { isNull, isUndefined } from 'lodash';
import path from 'path';

import CONFIG from '~/config';
import loaderService from '~/services/loader';

type MetadataType = {
  subject: string;
  year: number;
};

const { FILES_DIR_PATH, SOURCE_NAME } = CONFIG;

if (!fs.existsSync(FILES_DIR_PATH)) {
  throw new Error(`No existe la carpeta ${FILES_DIR_PATH}`);
}

class Integrator {
  private _watcher: chokidar.FSWatcher | undefined;

  async start(): Promise<void> {
    if (!isUndefined(this._watcher)) {
      return;
    }
    const watchPath = path.join(FILES_DIR_PATH, '**', '*.pdf');
    const watcher = chokidar.watch(watchPath, {
      persistent: true,
      ignoreInitial: false,
    });
    watcher.on('add', (filePath) => this._updateFileInLoader(filePath));
    watcher.on('unlink', (filePath) => this._deleteInLoader(filePath));
    console.log(`Controlando archivos ${watchPath}`);
  }

  stop(): boolean {
    if (isUndefined(this._watcher)) {
      return true;
    }
    this._watcher.close();
    this._watcher = undefined;
    return true;
  }

  private async _updateFileInLoader(filePath: string): Promise<boolean> {
    try {
      console.log(`Verificando ${filePath}`);
      const metadata = this._getMetadata(filePath);
      if (isNull(metadata)) {
        return false;
      }
      const shouldUpdate = await this._shouldUpdateFile(filePath);
      if (!shouldUpdate) {
        return false;
      }
      const sourceDocumentIdentifier = this._getSourceDocumentIdentifier(filePath);
      const fileName = path.basename(filePath);
      const base64 = fs.readFileSync(filePath, 'base64');
      const document = {
        metadata,
        sourceDocumentIdentifier,
        source: SOURCE_NAME,
        contentHash: this._getContentHash(base64),
        file: {
          fileName,
          base64,
        },
      };
      await loaderService.set(document);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private async _deleteInLoader(filePath: string): Promise<boolean> {
    try {
      console.log(`Eliminando ${filePath}`);
      const sourceDocumentIdentifier = this._getSourceDocumentIdentifier(filePath);
      await loaderService.delete(sourceDocumentIdentifier);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private async _shouldUpdateFile(filePath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(filePath)) {
        return this._deleteInLoader(filePath);
      }
      const base64 = fs.readFileSync(filePath, 'base64');
      const currentContentHash = this._getContentHash(base64);
      const loaderContentHashes = await loaderService.getContentHashes([filePath]);
      const loaderContentHash = loaderContentHashes[0];
      if (isNull(loaderContentHash.contentHash)) {
        return true;
      }
      return loaderContentHash.contentHash === currentContentHash;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private _getMetadata(filePath: string): MetadataType | null {
    const noBaseFilePath = filePath.replace(FILES_DIR_PATH, '');
    const arrFilePath = noBaseFilePath.split(path.sep);
    if (arrFilePath.length < 4) {
      return null;
    }
    return {
      subject: arrFilePath[1],
      year: Number.parseInt(arrFilePath[2], 10),
    };
  }

  private _getContentHash(base64: string): string {
    return crypto.createHash('sha256').update(base64).digest('hex');
  }

  private _getSourceDocumentIdentifier(filePath: string): string {
    const baseFilePath = filePath.replace(`${FILES_DIR_PATH}${path.sep}`, '');
    let finalId = baseFilePath;
    while (finalId.includes(path.sep)) {
      finalId = finalId.replace(path.sep, '_');
    }
    return finalId;
  }
}

export default new Integrator();
