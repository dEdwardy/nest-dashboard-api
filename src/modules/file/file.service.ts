import { Injectable } from '@nestjs/common';
import { createReadStream, createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import { mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import Bluebird from 'bluebird';

const createSeriesStream = require('series-stream')
const UPLOAD_DIR = './uploads'
export type FileChunkArg = { file: FileObj; path: string; hash: string }
type FileObj = { buffer: Buffer }
@Injectable()
export class FileService {
  async createDir (dir: string) {
    return await mkdir(dir);
  }
  async saveFileChunk ({ file, path, hash }: FileChunkArg) {
    try {
      await this.createDir(join(UPLOAD_DIR, hash))
    } catch (_) {
    } finally {
      await writeFile(path, file.buffer)
    }
  }
  // 根据文件hash 合并文件chunks
  async mergeFileChunks ({ hash, name }: { hash: string; name: string }) {
    const ss = createSeriesStream()
    ss.setMaxListeners(2000)
    const files = await readdir(`./uploads/${hash}`)
    const runMergeTask = () => {
      return new Promise((resolve, reject) => {
        ss.on('end', () => {
          resolve(true)
        })
        ss.on('error', () => {
          reject(new Error('ss error'))
        })
        const writeStream = createWriteStream(join('uploads', name))
        files.sort((a: string, b: string) => Number(a) - Number(b)).forEach((filePath: string) => {
          ss.add(createReadStream(join('./uploads', hash, filePath)))
        })
        ss.pipe(writeStream)
      })
    }
    await runMergeTask()
  }
  // :TODO 还有问题 合并文件
  async mergeFileChunksV2 ({ hash, name }: { hash: string; name: string }) {
    const files = await readdir(`./uploads/${hash}`)
    const sortedFiles = files.sort((a: string, b: string) => Number(a) - Number(b))
    const writeStream = createWriteStream(join('uploads', name))
    const chunkMergeCallback = (filePath: string) => new Bluebird.Promise((resolve,reject) => {
      const readStream = createReadStream(join('./uploads', hash, filePath))
      readStream.pipe(writeStream, { end: false })
      readStream.on('end',resolve)
      readStream.on('error',reject)
    })
    return Bluebird.Promise.mapSeries(sortedFiles, chunkMergeCallback).then(() => {
      writeStream.end()
    })
  }
}
