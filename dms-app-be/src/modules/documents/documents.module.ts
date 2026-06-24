import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './documents.entity';
import { StorageModule } from '../storage/storage.module';
import { AwsService } from '../aws/aws.service';
import { Folder } from '../folders/folders.entity';
import { OcrService } from '../ocr/ocr.service';
import { AiService } from '../ai/ai.service';
import { OllamaProvider } from '../ai/ollama.provider.';
import { GeminiProvider } from '../ai/gemini.provider';
@Module({
  imports: [TypeOrmModule.forFeature([Document,Folder]),StorageModule,],
  controllers: [DocumentsController],
  providers: [DocumentsService,AwsService,OcrService,AiService,OllamaProvider,GeminiProvider]
})
export class DocumentsModule {}
