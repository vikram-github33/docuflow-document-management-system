import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favourites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from 'src/modules/folders/folders.entity';
import { Document } from 'src/modules/documents/documents.entity';
import { User } from 'src/modules/user/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Favorite,Folder,Document,User])],
  controllers: [FavoritesController],
  providers: [FavoritesService]
})
export class FavoritesModule {}
