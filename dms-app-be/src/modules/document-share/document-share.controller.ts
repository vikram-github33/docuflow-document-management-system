import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateDocumentShareDto } from 'src/dto/create-document-share.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { DocumentShareService } from './document-share.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateDocumentShareDto } from 'src/dto/update-share-document.dto';

@Controller('document-share')
export class DocumentShareController {
  constructor(private readonly documentShareService: DocumentShareService) {}
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':documentId/share')
  async shareDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: CreateDocumentShareDto,
    @Request() req,
  ) {
    const share = await this.documentShareService.shareDocument(
      documentId,
      req.user.id,
      dto,
    );

    return {
      success: true,
      message: 'Document shared successfully.',
      data: share,
    };
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':documentId/share')
  @Get('shared-with-me')
  getSharedWithMe(@Request() req) {
    return this.documentShareService.getSharedWithMe(req.user.id);
  }

  @Patch(':shareId')
  @UseGuards(JwtAuthGuard)
  updatePermission(
    @Param('shareId') shareId: string,
    @Body() dto: UpdateDocumentShareDto,
    @Request() req,
  ) {
    return this.documentShareService.updatePermission(
      shareId,
      dto.permission,
      req.user.id,
    );
  }

  @Delete(':shareId')
  @UseGuards(JwtAuthGuard)
  removeShare(@Param('shareId') shareId: string, @Request() req) {
    return this.documentShareService.removeShare(shareId, req.user.id);
  }
}
