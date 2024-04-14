import { FileChunkArg, FileService } from './file.service';
import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
const CHUNK_SIZE = 2 * 1024 * 1024
@Controller('file')
export class FileController {
  constructor(private fileService:FileService){}
  @Post('chunk')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async UploadFileChunk (@UploadedFile() file:Blob, @Body('hash') hash: string, @Body('index') index: number) {
    const path = join('./uploads',hash,index+'')
    await this.fileService.saveFileChunk({file,path,index,hash} as unknown as FileChunkArg)
    return index+'-'+hash
  }
  @Post('merge')
  @HttpCode(HttpStatus.OK)
  async createMerge (@Body('hash') hash: string, @Body('name') name: string) {
    await this.fileService.mergeFileChunks({ hash,name})
  }
}
