import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadDocumentDto } from './upload-document.dto';
import { AwsService } from '../aws/aws.service';
import path from 'path';
import { Document } from './documents.entity';
import { OcrService } from '../ocr/ocr.service';
import { AiService } from '../ai/ai.service';
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly awsService: AwsService,
    private readonly ocrService: OcrService,
    private readonly aiService: AiService,
  ) {}
  async upload(file: Express.Multer.File, body: UploadDocumentDto) {
     const fileKey = `documents/${Date.now()}-${file.originalname}`;
    const uploadResult = await this.awsService.uploadFile(file, fileKey);

    const document = await this.documentRepository.save({
      fileName: file.originalname,
      fileUrl: uploadResult,
      fileType: file.mimetype,
      folderId: body.folderId,

      ocrStatus: 'pending',
      aiStatus: 'pending',

      ownerId: '6e498a66-b48d-4dea-acb1-dda2104b6606',
    });

    // background processing
    this.processDocument(document.id, file);

    return document;
  }

  private parseAiTags(
  response: string,
): string[] {
  try {
    const match =
      response.match(
        /\[[\s\S]*\]/,
      );

    if (!match) {
      return [];
    }

    return JSON.parse(match[0]);
  } catch {
    return [];
  }
}
  async processDocument(documentId: string, file: Express.Multer.File) {
    const document:any = await this.documentRepository.findOneBy({
      id: documentId,
    });

    try {
      const ocrText = await this.ocrService.extractText(file);

      document.ocrText = ocrText;
      document.ocrStatus = 'completed';

      await this.documentRepository.save(document);

      const summary = await this.aiService.summarize(ocrText);

      const tags = await this.aiService.generateTags(ocrText);

      const category = await this.aiService.classify(ocrText);

      document.aiSummary = summary;

      document.aiTags = this.parseAiTags(tags);

      document.documentCategory = category;

      document.aiStatus = 'completed';

      document.aiProcessedAt = new Date();

      await this.documentRepository.save(document);
    } catch (error) {
      document.aiStatus = 'failed';

      await this.documentRepository.save(document);
    }
  }
}
