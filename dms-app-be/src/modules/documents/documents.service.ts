import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
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
      ocrStatus: 'processing',
      aiStatus: 'processing',

      ownerId: '6e498a66-b48d-4dea-acb1-dda2104b6606',
    });

    // background processing
    setImmediate(() => {
      this.processDocument(document.id, file);
    });
    console.log(`Processing document ${document?.id}`);
    return document;
  }

  private parseAiTags(response: string): string[] {
    try {
      const match = response.match(/\[[\s\S]*\]/);

      if (!match) {
        return [];
      }

      return JSON.parse(match[0]);
    } catch {
      return [];
    }
  }
  async processDocument(documentId: string, file: Express.Multer.File) {
    const document = await this.documentRepository.findOneBy({
      id: documentId,
    });

    if (!document) {
      throw new Error('Document not found');
    }

    try {
      const ocrText = await this.ocrService.extractText(file);

      document.ocrText = ocrText;
      document.ocrStatus = 'completed';

      await this.documentRepository.save(document);
      console.log(`OCR completed for ${documentId}`);
      const [summary, tags, category] = await Promise.all([
        this.aiService.summarize(ocrText),
        this.aiService.generateTags(ocrText),
        this.aiService.classify(ocrText),
      ]);

      document.aiSummary = summary;

      document.aiTags = this.parseAiTags(tags);

      document.documentCategory = category;

      document.aiStatus = 'completed';

      document.aiProcessedAt = new Date();

      await this.documentRepository.save(document);
      console.log(`AI completed for ${documentId}`);
    } catch (error) {
      document.aiStatus = 'failed';
      await this.documentRepository.save(document);
      throw error;
    }
  }

  async search(query: string) {
    const documents = await this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.folder', 'folder')
      .where(
        `
      LOWER(document.fileName) LIKE LOWER(:query)
      OR LOWER(document.ocrText) LIKE LOWER(:query)
      OR LOWER(document.aiSummary) LIKE LOWER(:query)
      `,
        {
          query: `%${query}%`,
        },
      )
      .getMany();

    const foldersMap = new Map();

    for (const doc of documents) {
      // file in root
      if (!doc.folder) {
        continue;
      }

      const folderId = doc.folder.id;

      if (!foldersMap.has(folderId)) {
        foldersMap.set(folderId, {
          id: doc.folder.id,
          name: doc.folder.name,
          path: doc.folder.path,
          parentId: doc.folder.parentId,
          color: doc.folder.color,
          icon: doc.folder.icon,
          isArchived: doc.folder.isArchived,
          documentCount: 0,

          documents: [],

          children: [],
        });
      }

      foldersMap.get(folderId).documents.push({
        id: doc.id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
      });
    }

    return Array.from(foldersMap.values());
  }

  async moveToTrash(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException();
    }

    document.deletedAt = new Date();

    await this.documentRepository.save(document);

    return {
      message: 'Moved to trash',
    };
  }

  async getTrash() {
    return this.documentRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
      order: {
        deletedAt: 'DESC',
      },
    });
  }

  async restore(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    document.deletedAt = null;

    await this.documentRepository.save(document);

    return {
      message: 'Document restored successfully',
    };
  }

  async permanentDelete(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Delete from S3
    await this.awsService.deleteFile(document.fileUrl);

    // Remove from DB
    await this.documentRepository.remove(document);

    return {
      message: 'Document permanently deleted',
    };
  }
}
