import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from '../user/user.entity';
import { ActivityType } from 'src/enum/activity.enum';
import { DocumentActivity } from './documentactivity.entity';
import { Document } from '../documents/documents.entity';
import { Folder } from '../folders/folders.entity';

@Injectable()
export class DocumentActivityService {
  constructor(
    @InjectRepository(DocumentActivity)
    private readonly documentActivityRepository: Repository<DocumentActivity>,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // Document activity description — now covers ALL 13 enum values
  // (previously only 7 were handled; VIEWED, SHARED, DOWNLOADED, MOVED, DELETED
  //  fell through to a generic default)
  // ─────────────────────────────────────────────────────────────────────────────
  private getDescription(
    user: User,
    document: Document,
    type: ActivityType,
    extra?: { sharedWith?: string; fromPath?: string; toPath?: string },
  ): string {
    const name = document.fileName;
    switch (type) {
      case ActivityType.CREATED:
      case ActivityType.UPLOADED:
        return `${user.firstName} uploaded "${name}"`;

      case ActivityType.VIEWED:
        return `${user.firstName} viewed "${name}"`;

      case ActivityType.UPDATED:
        return `${user.firstName} updated "${name}"`;

      case ActivityType.SHARED:
        return extra?.sharedWith
          ? `${user.firstName} shared "${name}" with ${extra.sharedWith}`
          : `${user.firstName} shared "${name}"`;

      case ActivityType.DOWNLOADED:
        return `${user.firstName} downloaded "${name}"`;

      case ActivityType.MOVED:
        return extra?.toPath
          ? `${user.firstName} moved "${name}" to ${extra.toPath}`
          : `${user.firstName} moved "${name}"`;

      case ActivityType.MOVED_TO_TRASH:
        return `${user.firstName} moved "${name}" to trash`;

      case ActivityType.RESTORED:
        return `${user.firstName} restored "${name}" from trash`;

      case ActivityType.DELETED:
      case ActivityType.PERMANENTLY_DELETED:
        return `${user.firstName} permanently deleted "${name}"`;

      case ActivityType.FAVORITED:
        return `${user.firstName} added "${name}" to favourites`;

      case ActivityType.UNFAVORITED:
        return `${user.firstName} removed "${name}" from favourites`;

      default:
        return `${user.firstName} performed an action on "${name}"`;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // createActivity — FIXED: description was never being saved before
  // ─────────────────────────────────────────────────────────────────────────────
  async createActivity(
    user: User,
    document: Document,
    activityType: ActivityType,
    extra?: { sharedWith?: string; fromPath?: string; toPath?: string },
  ) {
    const description = this.getDescription(user, document, activityType, extra);

    await this.documentActivityRepository.save({
      user,
      document,
      activityType,
      description, // ← was missing in the original implementation
    });
  }

  // Transactional variant — use inside existing transactions (upload, move, etc.)
  async createActivityWithManager(
    manager: EntityManager,
    user: User,
    document: Document,
    activityType: ActivityType,
    extra?: { sharedWith?: string; fromPath?: string; toPath?: string },
  ) {
    const repo = manager.getRepository(DocumentActivity);
    const description = this.getDescription(user, document, activityType, extra);

    const activity = repo.create({ user, document, activityType, description });
    return repo.save(activity);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Folder activity — unchanged logic, extended for rename support
  // ─────────────────────────────────────────────────────────────────────────────
  private getFolderDescription(
    user: User,
    folder: Folder,
    type: ActivityType,
    extra?: { fromName?: string },
  ): string {
    switch (type) {
      case ActivityType.CREATED:
        return `${user.firstName} created folder "${folder.name}"`;
      case ActivityType.UPDATED:
        return extra?.fromName
          ? `${user.firstName} renamed "${extra.fromName}" to "${folder.name}"`
          : `${user.firstName} updated folder "${folder.name}"`;
      case ActivityType.MOVED_TO_TRASH:
        return `${user.firstName} moved folder "${folder.name}" to trash`;
      case ActivityType.RESTORED:
        return `${user.firstName} restored folder "${folder.name}"`;
      case ActivityType.DELETED:
      case ActivityType.PERMANENTLY_DELETED:
        return `${user.firstName} permanently deleted folder "${folder.name}"`;
      default:
        return `${user.firstName} performed an action on folder "${folder.name}"`;
    }
  }

  async createFolderActivity(
    manager: EntityManager,
    user: User,
    folder: Folder,
    activityType: ActivityType,
    extra?: { fromName?: string },
  ) {
    const repo = manager.getRepository(DocumentActivity);
    const description = this.getFolderDescription(user, folder, activityType, extra);

    const activity = repo.create({ user, folder, activityType, description });
    return repo.save(activity);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // getAllActivities — now supports filtering + pagination
  // Backward compatible: calling with no args behaves like before
  // ─────────────────────────────────────────────────────────────────────────────
  async getAllActivities(params?: {
    page?: number;
    limit?: number;
    activityType?: ActivityType;
    entityType?: 'document' | 'folder';
    userId?: string;
    search?: string;
    dateFrom?: Date;
  }) {
    const page  = params?.page  ?? 1;
    const limit = params?.limit ?? 50;

    const qb = this.documentActivityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.user', 'user')
      .leftJoinAndSelect('activity.document', 'document')
      .leftJoinAndSelect('activity.folder', 'folder')
      .select([
        'activity.id',
        'activity.activityType',
        'activity.description',
        'activity.createdAt',

        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',

        'document.id',
        'document.fileName',
        'document.fileType',
        'document.fileUrl',

        'folder.id',
        'folder.name',
        'folder.path',
      ])
      .orderBy('activity.createdAt', 'DESC');

    if (params?.activityType) {
      qb.andWhere('activity.activityType = :activityType', { activityType: params.activityType });
    }

    if (params?.entityType === 'document') {
      qb.andWhere('activity.document_id IS NOT NULL');
    } else if (params?.entityType === 'folder') {
      qb.andWhere('activity.folder_id IS NOT NULL');
    }

    if (params?.userId) {
      qb.andWhere('activity.user_id = :userId', { userId: params.userId });
    }

    if (params?.dateFrom) {
      qb.andWhere('activity.createdAt >= :dateFrom', { dateFrom: params.dateFrom });
    }

    if (params?.search) {
      qb.andWhere(
        '(document.fileName ILIKE :search OR folder.name ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${params.search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Summary counts for the top stat cards — grouped count query, single round trip
  // ─────────────────────────────────────────────────────────────────────────────
  async getActivitySummary(dateFrom?: Date) {
    const qb = this.documentActivityRepository
      .createQueryBuilder('activity')
      .select('activity.activityType', 'activityType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('activity.activityType');

    if (dateFrom) {
      qb.where('activity.createdAt >= :dateFrom', { dateFrom });
    }

    const rows = await qb.getRawMany<{ activityType: ActivityType; count: string }>();

    const counts: Record<string, number> = {};
    for (const row of rows) counts[row.activityType] = parseInt(row.count, 10);
    return counts;
  }
}
