import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThanOrEqual, Not } from 'typeorm';
import { Document } from '../documents/documents.entity';
import { Folder } from '../folders/folders.entity';
import { Favorite } from '../favorites/favourites.entity';
import {
  DashboardResponseDto,
  DashboardStatsDto,
  StorageStatsDto,
  RecentDocumentDto,
  RecentFolderDto,
} from './dto/dashboard-response.dto';

// Configure your real plan limit here (or pull from a Workspace/Org entity if you have one)
const STORAGE_LIMIT_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    @InjectRepository(Folder)
    private readonly folderRepo: Repository<Folder>,
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  private startOfMonth(monthsAgo = 0): Date {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo, 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private growthPercent(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // getStats — top 6 KPI cards
  // ─────────────────────────────────────────────────────────────────────────────
  async getStats(userId?: string): Promise<DashboardStatsDto> {
    const thisMonthStart = this.startOfMonth(0);
    const lastMonthStart = this.startOfMonth(1);

    const [
      totalDocuments,
      totalFolders,
      favouritesCount,
      trashedDocuments,
      trashedFolders,
      uploadedThisMonth,
      uploadedLastMonth,
      foldersCreatedThisMonth,
      foldersCreatedLastMonth,
    ] = await Promise.all([
      // Active (non-deleted) documents — TypeORM soft-delete excludes deletedAt rows by default
      this.documentRepo.count(),

      // Active folders
      this.folderRepo.count(),

      // Favourites for this user (or workspace-wide if userId not passed)
      userId
        ? this.favoriteRepo.count({ where: { userId } })
        : this.favoriteRepo.count(),

      // Trashed documents — withDeleted + deletedAt IS NOT NULL
      this.documentRepo
        .createQueryBuilder('d')
        .withDeleted()
        .where('d.deletedAt IS NOT NULL')
        .getCount(),

      // Trashed folders
      this.folderRepo
        .createQueryBuilder('f')
        .withDeleted()
        .where('f.deletedAt IS NOT NULL')
        .getCount(),

      // Uploaded this month
      this.documentRepo.count({
        where: { createdAt: MoreThanOrEqual(thisMonthStart) },
      }),

      // Uploaded last month (for the trend %)
      this.documentRepo
        .createQueryBuilder('d')
        .where('d.createdAt >= :lastStart', { lastStart: lastMonthStart })
        .andWhere('d.createdAt < :thisStart', { thisStart: thisMonthStart })
        .getCount(),

      // Folders created this month
      this.folderRepo.count({
        where: { createdAt: MoreThanOrEqual(thisMonthStart) },
      }),

      // Folders created last month
      this.folderRepo
        .createQueryBuilder('f')
        .where('f.createdAt >= :lastStart', { lastStart: lastMonthStart })
        .andWhere('f.createdAt < :thisStart', { thisStart: thisMonthStart })
        .getCount(),
    ]);

    const trashedCount = trashedDocuments + trashedFolders;

    return {
      totalDocuments,
      totalFolders,
      favouritesCount,
      trashedCount,
      sharedWithMeCount: 0, // ← stub: wire up once a Share entity exists
      uploadedThisMonth,
      uploadedLastMonth,
      documentsGrowthPercent: this.growthPercent(uploadedThisMonth, uploadedLastMonth),
      foldersCreatedThisMonth,
      foldersCreatedLastMonth,
      foldersGrowthPercent: this.growthPercent(foldersCreatedThisMonth, foldersCreatedLastMonth),
      uploadsGrowthPercent: this.growthPercent(uploadedThisMonth, uploadedLastMonth),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // getStorageStats — used storage + breakdown by file category
  // ─────────────────────────────────────────────────────────────────────────────
  async getStorageStats(): Promise<StorageStatsDto> {
    // Sum of sizeBytes across active documents
    const totalRow = await this.documentRepo
      .createQueryBuilder('d')
      .select('COALESCE(SUM(d.sizeBytes), 0)', 'total')
      .getRawOne<{ total: string }>();

    const usedBytes = parseInt(totalRow?.total ?? '0', 10);

    // Breakdown by category — documents vs images vs other, by fileType prefix
    const breakdownRows = await this.documentRepo
      .createQueryBuilder('d')
      .select(
        `CASE
          WHEN d.fileType LIKE 'image/%' THEN 'Images'
          WHEN d.fileType = 'application/pdf'
            OR d.fileType LIKE '%word%'
            OR d.fileType LIKE '%document%'
            OR d.fileType LIKE '%sheet%'
            OR d.fileType LIKE '%presentation%'
          THEN 'Documents'
          ELSE 'Other'
        END`,
        'category',
      )
      .addSelect('COALESCE(SUM(d.sizeBytes), 0)', 'bytes')
      .groupBy('category')
      .getRawMany<{ category: string; bytes: string }>();

    const colorMap: Record<string, string> = {
      Documents: '#1976d2',
      Images:    '#1e88e5',
      Other:     '#90caf9',
    };

    const breakdown = ['Documents', 'Images', 'Other'].map((label) => {
      const row   = breakdownRows.find((r) => r.category === label);
      const bytes = row ? parseInt(row.bytes, 10) : 0;
      return {
        label,
        sizeBytes: bytes,
        percent: usedBytes > 0 ? Math.round((bytes / usedBytes) * 100) : 0,
        color: colorMap[label],
      };
    });

    return {
      usedBytes,
      limitBytes: STORAGE_LIMIT_BYTES,
      usedPercent: Math.min(100, Math.round((usedBytes / STORAGE_LIMIT_BYTES) * 100)),
      breakdown,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // getRecentDocuments — joined with folder + favourite status
  // ─────────────────────────────────────────────────────────────────────────────
  async getRecentDocuments(limit = 8, userId?: string): Promise<RecentDocumentDto[]> {
    const documents = await this.documentRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.folder', 'folder')
      .orderBy('d.updatedAt', 'DESC')
      .take(limit)
      .getMany();

    if (documents.length === 0) return [];

    // Fetch favourite status in a single query rather than N+1
    const docIds = documents.map((d) => d.id);
    const favourites = userId
      ? await this.favoriteRepo.find({
          where: { userId, documentId: Not(IsNull()) },
        })
      : [];
    const favouriteDocIds = new Set(
      favourites.filter((f) => docIds.includes(f.documentId!)).map((f) => f.documentId),
    );

    return documents.map((d) => ({
      id: d.id,
      fileName: d.fileName,
      fileType: d.fileType,
      sizeBytes: d.sizeBytes,
      fileUrl: d.fileUrl,
      folderId: d.folderId ?? null,
      folderName: d.folder?.name ?? null,
      folderColor: d.folder?.color ?? null,
      isFavourite: favouriteDocIds.has(d.id),
      updatedAt: d.updatedAt,
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // getRecentFolders
  // ─────────────────────────────────────────────────────────────────────────────
  async getRecentFolders(limit = 6): Promise<RecentFolderDto[]> {
    const folders = await this.folderRepo.find({
      order: { updatedAt: 'DESC' },
      take: limit,
    });

    return folders.map((f) => ({
      id: f.id,
      name: f.name,
      path: f.path,
      color: f.color ?? null,
      documentCount: f.documentCount,
      updatedAt: f.updatedAt,
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // getDashboard — single call that returns everything the page needs
  // ─────────────────────────────────────────────────────────────────────────────
  async getDashboard(userId?: string): Promise<DashboardResponseDto> {
    const [stats, storage, recentDocuments, recentFolders] = await Promise.all([
      this.getStats(userId),
      this.getStorageStats(),
      this.getRecentDocuments(8, userId),
      this.getRecentFolders(6),
    ]);

    return { stats, storage, recentDocuments, recentFolders };
  }
}
