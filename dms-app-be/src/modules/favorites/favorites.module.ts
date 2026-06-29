import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favourites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from 'src/modules/folders/folders.entity';
import { Document } from 'src/modules/documents/documents.entity';
import { User } from 'src/modules/user/user.entity';
import { DocumentActivityService } from '../document-activity/document-activity.service';
import { DocumentActivityModule } from '../document-activity/document-activity.module';

@Module({
  imports:[TypeOrmModule.forFeature([Favorite,Folder,Document,User]),DocumentActivityModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  //  exports: [
  //   DocumentActivityService,   // ✅ Export it
  // ],
})
export class FavoritesModule {}
