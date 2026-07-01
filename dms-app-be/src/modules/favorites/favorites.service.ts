import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favourites.entity';
import { ToggleFavoriteDto } from './toggle-favorite.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DocumentActivityService } from '../document-activity/document-activity.service';
import { User } from '../user/user.entity';
import { ActivityType } from 'src/enum/activity.enum';
import { Document } from '../documents/documents.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly documentActivityService: DocumentActivityService,
  ) {}

  // private readonly userId = '6e498a66-b48d-4dea-acb1-dda2104b6606';

  async toggle(dto: ToggleFavoriteDto,userId:string) {
    const existing = await this.favoriteRepo.findOne({
      where: {
        userId:userId,
        documentId: dto.documentId,
        folderId: dto.folderId,
      },
    });
    const user = await this.userRepository.findOne({
      where: {
        id:userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const document = await this.documentRepository.findOne({
      where: {
        id: dto.documentId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }
    await this.documentActivityService.createActivity(
      user,
      document,
      ActivityType.FAVORITED,
    );
    if (existing) {
      await this.favoriteRepo.remove(existing);
      await this.documentActivityService.createActivity(
        user,
        document,
        ActivityType.UNFAVORITED,
      );
      return {
        favorite: false,
        message: 'Removed from favorites',
      };
    }

    const favorite = this.favoriteRepo.create({
      userId:userId,
      documentId: dto.documentId,
      folderId: dto.folderId,
    });

    await this.documentActivityService.createActivity(
      user,
      document,
      ActivityType.FAVORITED,
    );

    await this.favoriteRepo.save(favorite);

    return {
      favorite: true,
      message: 'Added to favorites',
    };
  }

  async getFavorites(userId) {
    return this.favoriteRepo.find({
      where: {
        userId:userId,
      },
      relations: {
        document: true,
        folder: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getFavoriteDocuments(userId:string) {
    return this.favoriteRepo.find({
      where: {
        userId:userId,
      },
      relations: {
        document: true,
      },
    });
  }

  async getFavoriteFolders(userId:string) {
    return this.favoriteRepo.find({
      where: {
        userId,
      },
      relations: {
        folder: true,
      },
    });
  }
}
