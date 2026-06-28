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
// import { DocumentActivity } from '../document-activity/documentactivity.entity';
import { User } from '../user/user.entity';
import { DocumentActivityModule } from '../document-activity/document-activity.module';
@Module({
  imports: [TypeOrmModule.forFeature([Document,Folder,User]),StorageModule,DocumentActivityModule],
  controllers: [DocumentsController],
  providers: [DocumentsService,AwsService,OcrService,AiService,OllamaProvider,GeminiProvider,]
})
export class DocumentsModule {}
