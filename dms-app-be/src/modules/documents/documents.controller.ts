import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
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
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @Post('upload') 
  @UseGuards(JwtAuthGuard)
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
    @Request() req
  ) {
    // console.log('BODY:', body);
    // console.log('FILE:', file);
    const document =  this.documentsService.upload(file, body,req.user.id);
     return {
      success: true,
      message: 'Document Uploaded successfully.',
      data: document,
    };
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
