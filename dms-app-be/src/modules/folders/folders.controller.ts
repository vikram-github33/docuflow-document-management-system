import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './../../dto/folder/create-folder.dto';
import { UpdateFolderDto } from './../../dto/folder/update-folder.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('folders')
// @UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateFolderDto, @Request() req) {
    // console.log(req.user);
    const folder = this.foldersService.createFolder(dto, req.user.id);
    return {
      success: true,
      message: 'Folder created successfully.',
      data: folder,
    };
  }
  @Get()
  getRootFolders() {
    return this.foldersService.getRootFolders();
  }

  @Get('tree')
  getTree() {
    return this.foldersService.getFolderTreeWithFiles();
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
    return this.foldersService.updateFolder(
      id,
      dto,
      req.user?.id ?? 'anonymous',
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.foldersService.deleteFolder(id, req.user?.id ?? 'anonymous');
  }
}
