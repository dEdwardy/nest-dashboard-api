import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage:memoryStorage(),
      limits: {
        fieldSize: 1024 * 1024 * 20
      }
    })
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule { }
