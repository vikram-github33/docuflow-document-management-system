import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
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
}
