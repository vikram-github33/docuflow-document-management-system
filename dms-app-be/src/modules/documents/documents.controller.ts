import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
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
import { AuthGuard } from '@nestjs/passport';
import { Permissionguard } from '../common/guards/permission.guards';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { Permission } from '../common/permissions/permission';
import type { Express } from 'express';
import type { Response } from 'express';
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @Post('upload')
  @UseGuards(AuthGuard('jwt'), Permissionguard)
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
    @Request() req,
  ) {
    // console.log('BODY:', body);
    // console.log('FILE:', file);
    const document = await this.documentsService.upload(
      file,
      body,
      req.user.id,
    );
    return {
      success: true,
      message: 'Document Uploaded successfully.',
      data: document,
    };
  }

  @Get(':id/versions')
  @UseGuards(JwtAuthGuard)
  async getVersionHistory(@Param('id') documentId: string, @Request() req) {
    const history = await this.documentsService.getVersionHistory(
      documentId,
      req.user.id,
    );
    return {
      success: true,
      message: 'Document version history retrived succeffully',
      data: history,
    };
  }

  @Get(':id/versions/:versionId/download')
  @UseGuards(JwtAuthGuard)
  async downloadVersion(
    @Param('id') documentId: string,
    @Param('versionId') versionId: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const file = await this.documentsService.downloadVersion(
      documentId,
      versionId,
      req.user,
    );

    res.setHeader('Content-Type', file.fileType);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.fileName)}"`,
    );

    return res.send(file.buffer);
  }

  @Put(':id/versions')
  @RequirePermissions(Permission.USER_READ)
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new document version' })
  async uploadnewVersion(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('Change Description') changeDescription: string,
    @Request() req,
  ) {
    const document = await this.documentsService.uploadnewVersion(
      id,
      file,
      req.user.id,
      changeDescription,
    );

    return {
      succss: true,
      message: 'Document version uploaded successfully',
      data: document,
    };
  }

  @Get(':id/verions/compare')
  // @UseGuards(AuthGuard)
  async compareVersions(
    @Param('id') documentId: string,
    @Query('version1') version1: string,
    @Query('version2') version2: string,
  ) {
    const result = await this.documentsService.compareVersions(
      documentId,
      version1,
      version2,
    );

     return {
    success: true,
    message: 'Versions compared successfully',
    data: result,
  };
  }
  @Post(':id/versions/:versionId/restore')
  @UseGuards(JwtAuthGuard)
  async restoreVersion(
    @Param('id') documentId: string,
    @Param('versionId') versionId: string,
    @Body('changeDescription') changeDescription: string,
    @Request() req,
  ) {
    const result = await this.documentsService.restoreVersion(
      documentId,
      versionId,
      req.user,
      changeDescription,
    );

    return {
      success: true,
      message: 'Document version restored successfully',
      data: result,
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
