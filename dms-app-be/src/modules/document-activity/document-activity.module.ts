import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentActivity } from './documentactivity.entity';
import { DocumentActivityService } from './document-activity.service';
import { DocumentActivityController } from './document-activity.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentActivity]),
  ],
  providers: [DocumentActivityService],
  controllers:[DocumentActivityController],
  exports: [DocumentActivityService],
})
export class DocumentActivityModule {}