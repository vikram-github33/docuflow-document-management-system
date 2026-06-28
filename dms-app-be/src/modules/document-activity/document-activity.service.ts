import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { ActivityType } from 'src/enum/activity.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentActivity } from './documentactivity.entity';
import { Repository } from 'typeorm';
import { Document } from '../documents/documents.entity';

@Injectable()
export class DocumentActivityService {
  constructor(
    @InjectRepository(DocumentActivity)
    private readonly activityRepository: Repository<DocumentActivity>,
  ) {}
  async createActivity(
    user: User,
    document: Document,
    activityType: ActivityType,
  ) {
    await this.activityRepository.save({
      user,
      document,
      activityType,
    });
  }
}
