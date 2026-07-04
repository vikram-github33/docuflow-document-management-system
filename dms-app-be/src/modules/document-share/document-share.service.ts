import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDocumentShareDto } from 'src/dto/create-document-share.dto';
import { Document } from '../documents/documents.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { DocumentShare } from './document-share.entity';
import { SharePermission } from 'src/enum/share-permission.enum';

@Injectable()
export class DocumentShareService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DocumentShare)
    private readonly documentShareRepository: Repository<DocumentShare>,
  ) {}
  async shareDocument(
    documentId: string,
    ownerId: string,
    dto: CreateDocumentShareDto,
  ) {
    // Find document
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: {
        owner: true,
      },
    });
    console.log('userId', ownerId);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Only owner can share
    if (document.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You are not allowed to share this document.',
      );
    }

    // Recipient exists?
    const user = await this.userRepository.findOne({
      where: {
        id: dto.sharedWithUserId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Already shared?
    const existing = await this.documentShareRepository.findOne({
      where: {
        document: { id: documentId },
        sharedWith: { id: dto.sharedWithUserId },
      },
      relations: {
        document: true,
        sharedWith: true,
      },
    });

    if (existing) {
      existing.permission = dto.permission;
      return this.documentShareRepository.save(existing);
    }

    const share = this.documentShareRepository.create({
      document,
      sharedBy: document.owner,
      sharedWith: user,
      permission: dto.permission,
    });

    return this.documentShareRepository.save(share);
  }

  async getSharedWithMe(userId: string) {
    const sharedDocuments = await this.documentShareRepository
      .createQueryBuilder('share')
      .leftJoinAndSelect('share.document', 'document')
      .leftJoinAndSelect('share.sharedBy', 'sharedBy')
      .where('share.shared_with = :userId', { userId })
      .andWhere('share.isActive = true')
      .orderBy('share.createdAt', 'DESC')
      .getMany();

    return {
      success: true,
      message: 'Shared documents fetched successfully.',
      data: sharedDocuments,
    };
  }

  async updatePermission(
    shareId: string,
    permission: SharePermission,
    userId: string,
  ) {
    const share = await this.documentShareRepository.findOne({
      where: {
        id: shareId,
      },
      relations: {
        sharedBy: true,
        sharedWith: true,
        document: true,
      },
    });

    if (!share) {
      throw new NotFoundException('Shared document not found');
    }

    if (share.sharedBy.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this permission.',
      );
    }

    share.permission = permission;

    await this.documentShareRepository.save(share);

    return {
      success: true,
      message: 'Permission updated successfully.',
      data: share,
    };
  }

  async removeShare(
  shareId: string,
  userId: string,
) {
  const share = await this.documentShareRepository.findOne({
    where: {
      id: shareId,
    },
    relations: {
      sharedBy: true,
    },
  });

  if (!share) {
    throw new NotFoundException('Shared document not found');
  }

  if (share.sharedBy.id !== userId) {
    throw new ForbiddenException(
      'You are not authorized to remove this share.',
    );
  }

  await this.documentShareRepository.remove(share);

  return {
    success: true,
    message: 'Document access removed successfully.',
  };
}
}
