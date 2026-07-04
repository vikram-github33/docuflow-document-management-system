import { Module } from '@nestjs/common';
import { DocumentShareController } from './document-share.controller';
import { DocumentShareService } from './document-share.service';
import { DocumentShare } from './document-share.entity';
import { User } from '../user/user.entity';
import { Document } from '../documents/documents.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[ TypeOrmModule.forFeature([
      DocumentShare,
      Document,
      User,
    ]),],
  controllers: [DocumentShareController],
  providers: [DocumentShareService]
})
export class DocumentShareModule {}
