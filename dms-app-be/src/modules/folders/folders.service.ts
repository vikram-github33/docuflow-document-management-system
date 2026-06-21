import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Folder } from './folders.entity';
import { CreateFolderDto } from '././../../dto/folder/create-folder.dto';
import { UpdateFolderDto } from '././../../dto/folder/update-folder.dto';
import { FolderTreeNodeDto } from './../../dto/folder/folder-response.dto';
import { Document } from '../documents/documents.entity';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepo: Repository<Folder>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly dataSource: DataSource,
  ) {}

  private sanitizeSegment(name: string): string {
    return name.trim().replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, ' ').trim();
  }

  private buildPath(parentPath: string | null, name: string): string {
    const seg = this.sanitizeSegment(name);
    return parentPath ? `${parentPath}/${seg}` : `/${seg}`;
  }

  private toTreeNode(folder: Folder): FolderTreeNodeDto {
    return {
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parentId??null,
      color: folder.color??'',
      icon: folder.icon??'',
      isArchived: folder.isArchived,
      documentCount: folder.documentCount,
      documents:[],
      children: (folder.children ?? []).map((c) => this.toTreeNode(c)),
    };
  }

  async createFolder(dto: CreateFolderDto, ownerId: string): Promise<Folder> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Folder);

      let parentPath: string | undefined;

      // Validate parent folder
      if (dto.parentId) {
        const parent = await repo.findOne({
          where: { id: dto.parentId },
          withDeleted: false,
        });

        if (!parent) {
          throw new NotFoundException(
            `Parent folder with id "${dto.parentId}" does not exist`,
          );
        }

        if (parent.isArchived) {
          throw new BadRequestException(
            'Cannot create a subfolder inside an archived folder',
          );
        }

        parentPath = parent.path;
      }

      // Build path using parent path + new name
      const newPath = this.buildPath(parentPath ?? null, dto.name);

      // Check name uniqueness within the same parent
      const nameConflict = await repo.findOne({
        where: {
          parentId: dto.parentId ?? IsNull(),
          name: dto.name.trim(),
        },
        withDeleted: false,
      });

      if (nameConflict) {
        throw new ConflictException(
          `A folder named "${dto.name}" already exists in this location`,
        );
      }

      // Check path uniqueness (your entity has unique: true on path)
      const pathConflict = await repo.findOne({
        where: { path: newPath },
        withDeleted: false,
      });

      if (pathConflict) {
        throw new ConflictException(
          `Folder path "${newPath}" already exists`,
        );
      }

      const folder = repo.create({
        name: dto.name.trim(),
        description: dto.description,
        parentId: dto.parentId ?? undefined,
        path: newPath,
        ownerId,
        color: dto.color,
        icon: dto.icon,
        // inheritPermissions: dto.inheritPermissions ?? true,
        // retentionDays: dto.retentionDays,
        isArchived: false,
        documentCount: 0,
        sizeBytes: '0',
      });

      return repo.save(folder);
    });
  }

  // async getFolderTree(): Promise<FolderTreeNodeDto[]> {
  //   const all = await this.folderRepo.find({
  //     order: { name: 'ASC' },
  //     withDeleted: false,
  //   });

  //   // Build map
  //   const map = new Map<string, FolderTreeNodeDto>();
  //   for (const f of all) {
  //     map.set(f.id, {
  //       id: f.id,
  //       name: f.name,
  //       path: f.path,
  //       parentId: f.parentId ??null,
  //       color: f.color??'',
  //       icon: f.icon??'',
  //       isArchived: f.isArchived,
  //       documentCount: f.documentCount,
  //       children: [],
  //     });
  //   }

  //   const roots: FolderTreeNodeDto[] = [];

  //   for (const f of all) {
  //     const node = map.get(f.id)!;
  //     if (f.parentId && map.has(f.parentId)) {
  //       map.get(f.parentId)!.children.push(node);
  //     } else {
  //       roots.push(node);
  //     }
  //   }

  //   return roots;
  // }

  async getFolderTreeWithFiles(): Promise<FolderTreeNodeDto[]> {
  const folders = await this.folderRepo.find({
    order: { name: 'ASC' },
  });

  const documents = await this.documentRepository.find();

  const map = new Map<string, FolderTreeNodeDto>();

  // Create folder nodes
  for (const folder of folders) {
    map.set(folder.id, {
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parentId ?? null,
      color: folder.color ?? '',
      icon: folder.icon ?? '',
      isArchived: folder.isArchived,
      documentCount: folder.documentCount,
      documents: [],
      children: [],
    });
  }

  // Attach documents to folders
  for (const doc of documents) {
    const folderNode = map.get(doc.folderId);

    if (folderNode) {
      folderNode.documents.push({
        id: doc.id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
      });
    }
  }

  const roots: FolderTreeNodeDto[] = [];

  // Build tree
  for (const folder of folders) {
    const node = map.get(folder.id)!;

    if (folder.parentId && map.has(folder.parentId)) {
      map.get(folder.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
 async getRootFolders(): Promise<Folder[]> {
  return this.folderRepo.find({
    where: {
      parentId: IsNull(),
    },
    relations: {
      owner: true,
      children: true,
    },
    order: {
      name: 'ASC',
    },
  });
}

  async getFolderById(id: string): Promise<Folder> {
    const folder = await this.folderRepo.findOne({
      where: { id },
       relations: {
      owner: true,
      children: true,
      parent:true
    },
    order: {
      name: 'ASC',
    },
    });
    if (!folder) throw new NotFoundException(`Folder "${id}" not found`);
    return folder;
  }

  async getFolderChildren(id: string): Promise<Folder[]> {
    await this.getFolderById(id);
    return this.folderRepo.find({
      where: { parentId: id },
     relations: {
      owner: true,
    },
    order: {
      name: 'ASC',
    },
    });
  }

  async updateFolder(
    id: string,
    dto: UpdateFolderDto,
    requesterId: string,
  ): Promise<Folder> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Folder);

      const folder = await repo.findOne({
        where: { id },
        relations: {
      // owner: true,
      // children: true,
      parent:true
    },
    order: {
      name: 'ASC',
    },
      });

      if (!folder) {
        throw new NotFoundException(`Folder with id "${id}" not found`);
      }

      if (folder.ownerId !== requesterId) {
        throw new ForbiddenException(
          'You do not have permission to update this folder',
        );
      }

      // Handle rename — rebuild path and cascade to all descendants
      if (dto.name && dto.name.trim() !== folder.name) {
        const nameConflict = await repo.findOne({
          where: {
            parentId: folder.parentId ?? IsNull(),
            name: dto.name.trim(),
          },
          withDeleted: false,
        });

        if (nameConflict && nameConflict.id !== id) {
          throw new ConflictException(
            `A folder named "${dto.name}" already exists in this location`,
          );
        }

        const parentPath = folder.parent?.path ?? null;
        const newPath = this.buildPath(parentPath, dto.name);
        const oldPath = folder.path;

        // Update all descendant paths first
        await this.cascadePathUpdate(repo, oldPath, newPath);

        folder.name = dto.name.trim();
        folder.path = newPath;
      }

      // Apply other allowed fields
      if (dto.description !== undefined) folder.description = dto.description;
      if (dto.color !== undefined) folder.color = dto.color;
      if (dto.icon !== undefined) folder.icon = dto.icon;
      // if (dto.inheritPermissions !== undefined) folder.inheritPermissions = dto.inheritPermissions;
      if (dto.isArchived !== undefined) folder.isArchived = dto.isArchived;
      // if (dto.retentionDays !== undefined) folder.retentionDays = dto.retentionDays;

      return repo.save(folder);
    });
  }

  private async updateDescendantPaths(
    repo: Repository<Folder>, oldBase: string, newBase: string,
  ): Promise<void> {
    const descendants = await repo
      .createQueryBuilder('f')
      .where('f.path LIKE :prefix', { prefix: `${oldBase}/%` })
      .getMany();
    for (const d of descendants) d.path = newBase + d.path.slice(oldBase.length);
    if (descendants.length > 0) await repo.save(descendants);
  }

  async deleteFolder(id: string, requesterId: string): Promise<{ message: string }> {
    const folder = await this.folderRepo.findOne({ where: { id }, relations: {
      // owner: true,
      // children: true,
      parent:true
    },
    order: {
      name: 'ASC',
    }, });
    if (!folder) throw new NotFoundException(`Folder "${id}" not found`);
    if (folder.ownerId !== requesterId) throw new ForbiddenException('Permission denied');
    if (folder.children?.length > 0) {
      throw new BadRequestException('Delete all subfolders before deleting this folder');
    }
    if (folder.documentCount > 0) {
      throw new BadRequestException('Move or delete documents before deleting this folder');
    }
    await this.folderRepo.remove(folder);
    return { message: `Folder "${folder.name}" deleted successfully` };
  }

  // Called by DocumentsService when a document is uploaded/deleted
  async incrementDocumentCount(folderId: string, sizeBytes: number): Promise<void> {
    await this.folderRepo.increment({ id: folderId }, 'documentCount', 1);
    await this.folderRepo.increment({ id: folderId }, 'totalSize', sizeBytes);
  }

  async decrementDocumentCount(folderId: string, sizeBytes: number): Promise<void> {
    await this.folderRepo.decrement({ id: folderId }, 'documentCount', 1);
    await this.folderRepo.decrement({ id: folderId }, 'totalSize', sizeBytes);
  }

  private async cascadePathUpdate(
    repo: Repository<Folder>,
    oldBasePath: string,
    newBasePath: string,
  ): Promise<void> {
    const descendants = await repo
      .createQueryBuilder('folder')
      .where('folder.path LIKE :prefix', { prefix: `${oldBasePath}/%` })
      .getMany();

    if (descendants.length === 0) return;

    const updated = descendants.map((d) => ({
      ...d,
      path: newBasePath + d.path.slice(oldBasePath.length),
    }));

    await repo.save(updated);
  }
}
