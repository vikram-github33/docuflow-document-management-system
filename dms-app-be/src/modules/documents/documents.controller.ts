import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UploadDocumentDto } from './upload-document.dto';
import { DocumentsService } from './documents.service';
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadDocumentDto,
  })
  async uploadDocument(
    @UploadedFile()
    file: Express.Multer.File,
    @Body()
    body: UploadDocumentDto,
  ) {
    console.log('BODY:', body);
    console.log('FILE:', file);
    return this.documentsService.upload(file, body);
  }

  @Get('search')
  searchDocuments(@Query('query') query: string) {
    return this.documentsService.search(query);
  }

  @Delete('/movetotrash/:id')
  moveToTrash(@Param('id') id: string) {
    return this.documentsService.moveToTrash(id);
  }

  @Get('trash')
  @ApiOperation({ summary: 'Get all trashed documents' })
  @ApiResponse({
    status: 200,
    description: 'Trashed documents fetched successfully',
  })
  async getTrash() {
    return await this.documentsService.getTrash();

    // return {
      // success: true,
      // message: 'Trashed documents fetched successfully',
      // documents,
      // count: documents.length,
    // };
  }

  @Post(':id/restore')
  restore(@Param('id') id: string) {
    return this.documentsService.restore(id);
  }

  @Delete(':id/permanent')
  permanentDelete(@Param('id') id: string) {
    return this.documentsService.permanentDelete(id);
  }
}
