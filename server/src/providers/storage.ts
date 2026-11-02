import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';

export interface StorageAdapter {
  save(buffer: Buffer, filename: string, mime: string): Promise<string>;
  remove(url: string): Promise<void>;
}

export class LocalStorage implements StorageAdapter {
  constructor(private dir = env.UPLOAD_DIR) {}
  async save(buffer: Buffer, filename: string) {
    await fs.mkdir(this.dir, { recursive: true });
    await fs.writeFile(path.join(this.dir, filename), buffer);
    return `${env.PUBLIC_URL}/uploads/${filename}`;
  }
  async remove(url: string) {
    const name = url.split('/uploads/')[1];
    if (name) await fs.rm(path.join(this.dir, name), { force: true });
  }
}

/** Swap-in point for S3 / Cloudinary. */
export class S3Storage implements StorageAdapter {
  async save(): Promise<string> {
    throw new Error('S3Storage is not configured. Install @aws-sdk/client-s3 and implement save().');
  }
  async remove(): Promise<void> {}
}

export const storage: StorageAdapter = env.STORAGE_DRIVER === 's3' ? new S3Storage() : new LocalStorage();
