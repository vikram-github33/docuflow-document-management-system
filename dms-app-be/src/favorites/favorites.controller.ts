import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FavoritesService } from './favorites.service';
import { ToggleFavoriteDto } from './toggle-favorite.dto';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post('toggle')
  toggle(
    @Body() dto: ToggleFavoriteDto,
  ) {
    return this.favoritesService.toggle(dto);
  }

  @Get()
  getFavorites() {
    return this.favoritesService.getFavorites();
  }

  @Get('documents')
  getFavoriteDocuments() {
    return this.favoritesService.getFavoriteDocuments();
  }

  @Get('folders')
  getFavoriteFolders() {
    return this.favoritesService.getFavoriteFolders();
  }
}