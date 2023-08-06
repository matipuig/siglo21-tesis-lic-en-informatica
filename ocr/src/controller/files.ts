import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

class Files {
  private _filesPath = path.join(__dirname, '..', '..', 'persisted');

  constructor() {
    if (!fs.existsSync(this._filesPath)) {
      fs.mkdirSync(this._filesPath, { recursive: true });
    }
  }

  add(base64: string): string {
    const hash = crypto.createHash('sha256').update(base64).digest('hex');
    const filePath = path.join(this._filesPath, hash);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    fs.writeFileSync(filePath, base64, { encoding: 'base64' });
    return filePath;
  }

  existsByHash(hash: string): boolean {
    const filePath = path.join(this._filesPath, hash);
    return fs.existsSync(filePath);
  }

  getFilePathByHash(hash: string): string {
    return path.join(this._filesPath, hash);
  }
}

export default new Files();
