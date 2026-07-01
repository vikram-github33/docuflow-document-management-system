import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FavoritesService } from './favorites.service';
import { ToggleFavoriteDto } from './toggle-favorite.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

@ApiTags('favourites')
@Controller('favourites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  toggle(
    @Body() dto: ToggleFavoriteDto,
    @Request() req
  ) {
    return this.favoritesService.toggle(dto,req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getFavorites(@Request() req) {
    return this.favoritesService.getFavorites(req.user.id);
  }

  @Get('documents')
  @UseGuards(JwtAuthGuard)
  getFavoriteDocuments(@Request() req) {
    return this.favoritesService.getFavoriteDocuments(req.user.id);
  }

  @Get('folders')
  @UseGuards(JwtAuthGuard)
  getFavoriteFolders(@Request() req) {
    return this.favoritesService.getFavoriteFolders(req.user.id);
  }
}