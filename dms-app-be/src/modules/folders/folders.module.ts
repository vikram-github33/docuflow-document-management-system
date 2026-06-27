import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './folders.entity';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { Document } from '../documents/documents.entity';
import { Favorite } from 'src/favorites/favourites.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder,Document,Favorite,User]),],
  controllers: [FoldersController],
  providers: [FoldersService],
  exports: [FoldersService],
})
export class FoldersModule {}
