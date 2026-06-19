import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseUUIDPipe, Request,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './../../dto/folder/create-folder.dto';
import { UpdateFolderDto } from './../../dto/folder/update-folder.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('folders')
// @UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateFolderDto, @Request() req: any) {
    const ownerId = req.user?.id ?? '8f6d1d1f-5f6b-4d1c-a7f2-9b8d3e7c4a21';
    return this.foldersService.createFolder(dto, ownerId);
  }

  @Get()
  getRootFolders() {
    return this.foldersService.getRootFolders();
  }

  @Get('tree')
  getTree() {
    return this.foldersService.getFolderTree();
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.foldersService.getFolderById(id);
  }

  @Get(':id/children')
  getChildren(@Param('id', ParseUUIDPipe) id: string) {
    return this.foldersService.getFolderChildren(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFolderDto,
    @Request() req: any,
  ) {
    return this.foldersService.updateFolder(id, dto, req.user?.id ?? 'anonymous');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.foldersService.deleteFolder(id, req.user?.id ?? 'anonymous');
  }
}
