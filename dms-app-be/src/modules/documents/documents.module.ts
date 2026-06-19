import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './documents.entity';
import { StorageModule } from '../storage/storage.module';
import { AwsService } from '../aws/aws.service';
@Module({
  imports: [TypeOrmModule.forFeature([Document]),StorageModule,],
  controllers: [DocumentsController],
  providers: [DocumentsService,AwsService]
})
export class DocumentsModule {}
