export class FolderOwnerDto {
  id: string;
  name: string;
  email: string;
}

export class FolderResponseDto {
  id: string;
  name: string;
  description: string | null;
  path: string;
  parentId: string | null;
  color: string;
  icon: string;
  isArchived: boolean;
  documentCount: number;
  totalSize: number;
  owner: FolderOwnerDto;
  children: FolderResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class FolderTreeNodeDto {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  color: string;
  icon: string;
  isArchived: boolean;
  documentCount: number;
  children: FolderTreeNodeDto[];
}
