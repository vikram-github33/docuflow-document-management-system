import { InjectRepository } from "@nestjs/typeorm";
import { Favorite } from "./favourites.entity";
import { ToggleFavoriteDto } from "./toggle-favorite.dto";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
  ) {}

  private readonly userId =
    '6e498a66-b48d-4dea-acb1-dda2104b6606';

  async toggle(dto: ToggleFavoriteDto) {
    const existing =
      await this.favoriteRepo.findOne({
        where: {
          userId: this.userId,
          documentId: dto.documentId,
          folderId: dto.folderId,
        },
      });

    if (existing) {
      await this.favoriteRepo.remove(existing);

      return {
        favorite: false,
        message: 'Removed from favorites',
      };
    }

    const favorite =
      this.favoriteRepo.create({
        userId: this.userId,
        documentId: dto.documentId,
        folderId: dto.folderId,
      });

    await this.favoriteRepo.save(favorite);

    return {
      favorite: true,
      message: 'Added to favorites',
    };
  }

  async getFavorites() {
    return this.favoriteRepo.find({
      where: {
        userId: this.userId,
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

  async getFavoriteDocuments() {
    return this.favoriteRepo.find({
      where: {
        userId: this.userId,
      },
      relations: {
        document: true,
      },
    });
  }

  async getFavoriteFolders() {
    return this.favoriteRepo.find({
      where: {
        userId: this.userId,
      },
      relations: {
        folder: true,
      },
    });
  }
}