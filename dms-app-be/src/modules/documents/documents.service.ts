import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadDocumentDto } from './upload-document.dto';
import { AwsService } from '../aws/aws.service';
import path from 'path';
import { Document } from './documents.entity';
import { OcrService } from '../ocr/ocr.service';
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly awsService: AwsService,
    private readonly ocrService: OcrService,
  ) {}
  async upload(file: Express.Multer.File, body: UploadDocumentDto) {
    const fileKey = `documents/${Date.now()}-${file.originalname}`;
    console.log('process.env.AWS_BUCKET_NAME', process.env.AWS_S3_BUCKET);
    const uploadResult: any = await this.awsService.uploadFile(file, fileKey);

    let ocrText = '';
    let ocrStatus = 'completed';

    try {
      ocrText = await this.ocrService.extractText(file);
    } catch (error) {
      console.error('OCR failed', error);
      ocrStatus = 'failed';
    }

    const document = this.documentRepository.create({
      fileName: file.originalname,
      fileUrl: uploadResult,
      // fileSize: file.size,
      fileType: file.mimetype,
      tags: body.tags,
      description: body.description,
      folderId: body.folderId,
      ownerId: '8f6d1d1f-5f6b-4d1c-a7f2-9b8d3e7c4a21',

       ocrText,
    ocrStatus,
    ocrCompletedAt:
      ocrStatus === 'completed' ? new Date() : undefined,
    });
    return this.documentRepository.save(document);
  }
}
