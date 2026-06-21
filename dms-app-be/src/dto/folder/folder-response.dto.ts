export class DocumentTreeDto {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
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

  documents: DocumentTreeDto[];

  children: FolderTreeNodeDto[];
}