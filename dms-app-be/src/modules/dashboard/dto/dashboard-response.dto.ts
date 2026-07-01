export class DashboardStatsDto {
  totalDocuments: number;
  totalFolders: number;
  favouritesCount: number;
  trashedCount: number;
  sharedWithMeCount: number; // stubbed at 0 until Share entity exists
  uploadedThisMonth: number;
  uploadedLastMonth: number;
  documentsGrowthPercent: number;
  foldersCreatedThisMonth: number;
  foldersCreatedLastMonth: number;
  foldersGrowthPercent: number;
  uploadsGrowthPercent: number;
}

export class StorageBreakdownItemDto {
  label: string;
  sizeBytes: number;
  percent: number;
  color: string;
}

export class StorageStatsDto {
  usedBytes: number;
  limitBytes: number;
  usedPercent: number;
  breakdown: StorageBreakdownItemDto[];
}

export class RecentDocumentDto {
  id: string;
  fileName: string;
  fileType: string;
  sizeBytes: string;
  fileUrl: string;
  folderId: string | null;
  folderName: string | null;
  folderColor: string | null;
  isFavourite: boolean;
  updatedAt: Date;
}

export class RecentFolderDto {
  id: string;
  name: string;
  path: string;
  color: string | null;
  documentCount: number;
  updatedAt: Date;
}

export class DashboardResponseDto {
  stats: DashboardStatsDto;
  storage: StorageStatsDto;
  recentDocuments: RecentDocumentDto[];
  recentFolders: RecentFolderDto[];
}
