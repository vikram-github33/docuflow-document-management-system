import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentActivity } from './documentactivity.entity';
import { DocumentActivityService } from './document-activity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentActivity]),
  ],
  providers: [DocumentActivityService],
  exports: [DocumentActivityService],
})
export class DocumentActivityModule {}