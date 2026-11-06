import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { UploadDocumentDto } from './upload-document.dto';
import { AwsService } from '../aws/aws.service';
import path from 'path';
import { Document } from './documents.entity';
import { OcrService } from '../ocr/ocr.service';
import { AiService } from '../ai/ai.service';
import { DocumentActivity } from '../document-activity/documentactivity.entity';
import { ActivityType } from 'src/enum/activity.enum';
import { User } from '../user/user.entity';
import { DocumentActivityService } from '../document-activity/document-activity.service';
import { DocumentVersion } from '../document-version/document-version.entity';
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    // @InjectRepository(DocumentActivity)
    // private readonly activityRepository: Repository<DocumentActivity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly awsService: AwsService,
    private readonly ocrService: OcrService,
    private readonly aiService: AiService,
    private readonly documentActivityService: DocumentActivityService,
    @InjectRepository(DocumentVersion)
    private readonly documentVersionRepository: Repository<DocumentVersion>,
  ) {}
  async upload(
    file: Express.Multer.File,
    body: UploadDocumentDto,
    userId: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fileKey = `document/${Date.now()}-${file.originalname}`;
    const uploadResult = await this.awsService.uploadFile(file, fileKey);

    const document = await this.documentRepository.save({
      fileName: file.originalname,
      fileUrl: uploadResult,
      fileType: file.mimetype,
      sizeBytes: String(file.size),
      folderId: body.folderId,
      ocrStatus: 'processing',
      aiStatus: 'processing',
      ownerId: userId,
      versionCount: 1,
    });
    const version = await this.documentVersionRepository.save({
      documentId: document.id,
      versionNumber: 1,
      fileName: file.originalname,
      fileUrl: uploadResult,
      fileType: file.mimetype,
      sizeBytes: String(file.size),
      uploadedBy: userId,
      changeDescription: 'Initial upload',
    });
    document.currentVersionId = version.id;

    await this.documentRepository.save(document);

    await this.documentActivityService.createActivity(
      user,
      document,
      ActivityType.UPLOADED,
    );

    setImmediate(() => {
      this.processDocument(document.id, file);
    });
    console.log('Version created:', version);

    return document;
  }

  async uploadnewVersion(
    documentId,
    file: Express.Multer.File,
    userId: string,
    changeDescription?: string,
  ) {
    const document = await this.documentRepository.findOne({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Find the user uploading this version
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fileKey = `documents/${documentId}-versions-${Date.now()}-${file.originalname}`;
    // Upload new file to S3
    const uploadResult = await this.awsService.uploadFile(file, fileKey);

    const nextVersionNumber = document.versionCount + 1;
    // Create new version
    const version = await this.documentVersionRepository.save({
      documentId: document.id,
      versionNumber: nextVersionNumber,
      fileName: file.originalname,
      fileUrl: uploadResult,
      fileType: file.mimetype,
      sizeBytes: String(file.size),
      uploadedBy: userId,
      changeDescription: changeDescription || 'Document updated',
    });
    // Update current document
    document.fileName = file.originalname;
    document.fileUrl = uploadResult;
    document.fileType = file.mimetype;
    document.sizeBytes = String(file.size);

    document.currentVersionId = version.id;
    document.versionCount = nextVersionNumber;

    // Reset processing status for new file
    document.ocrText = undefined;
    document.ocrStatus = 'processing';

    document.aiSummary = undefined;
    document.aiTags = undefined;
    document.documentCategory = undefined;
    document.aiStatus = 'processing';
    document.aiProcessedAt = undefined;

    await this.documentActivityService.createActivity(
      user,
      document,
      ActivityType.MOVED_TO_TRASH,
    );
  }

  async downloadVersion(documentId: string, versionId: string, user: any) {
    const document = await this.documentRepository.findOne({
      where: {
        id: documentId,
      },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    const version = await this.documentVersionRepository.findOne({
      where: {
        documentId,
        id: versionId,
      },
    });

    if (!version) {
      throw new NotFoundException('Document version not found');
    }
    // Download file from S3
    const buffer = await this.awsService.downloadFile(version.fileUrl);
    await this.documentActivityService.createActivity(
      user,
      document,
      ActivityType.VERSION_DOWNLOADED,
      // description:  `Downloaded version ${version.versionNumber}`,
    );
    return {
      fileName: version.fileName,
      fileType: version.fileType,
      buffer,
    };
  }

  async getVersionHistory(documentId: string, userId: string) {
    // Check whether document exists
    const document = await this.documentRepository.findOne({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // TODO: Check document ownership or user's permission
    // before returning version history.

    const versions = await this.documentVersionRepository.find({
      where: {
        documentId,
      },
      relations: {
        uploader: true,
      },
      order: {
        versionNumber: 'DESC',
      },
    });

    return {
      documentId: document.id,
      fileName: document.fileName,
      currentVersionId: document.currentVersionId,
      versionCount: document.versionCount,
      versions: versions.map((version) => ({
        id: version.id,
        versionNumber: version.versionNumber,
        fileName: version.fileName,
        fileType: version.fileType,
        sizeBytes: version.sizeBytes,
        checksumSha256: version.checksumSha256,
        uploadedBy: version.uploadedBy,
        uploadedByName: userId,
        changeDescription: version.changeDescription,
        createdAt: version.createdAt,
      })),
    };
  }

  async restoreVersion(
    documentId: string,
    versionId: string,
    user: any,
    changeDescription?: string,
  ) {
    // 1. Find document
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // TODO: Verify user ownership or restore permission.

    // 2. Find requested historical version
    const oldVersion = await this.documentVersionRepository.findOne({
      where: {
        id: versionId,
        documentId,
      },
    });

    if (!oldVersion) {
      throw new NotFoundException('Document version not found');
    }

    // 3. Download old file from S3
    const buffer = await this.awsService.downloadFile(oldVersion.fileUrl);

    // 4. Create a new Multer-compatible file object
    const file = {
      originalname: oldVersion.fileName,
      mimetype: oldVersion.fileType,
      buffer,
      size: buffer.length,
    } as Express.Multer.File;

    // 5. Generate new S3 key
    const nextVersionNumber = document.versionCount + 1;

    const s3Key =
      `documents/${documentId}/versions/` +
      `${Date.now()}-${oldVersion.fileName}`;

    // 6. Upload restored file as a NEW S3 object
    const fileUrl = await this.awsService.uploadFile(file, s3Key);

    // 7. Create new version record
    const newVersion = this.documentVersionRepository.create({
      documentId,
      versionNumber: nextVersionNumber,
      fileName: oldVersion.fileName,
      fileUrl,
      fileType: oldVersion.fileType,
      sizeBytes: String(buffer.length),
      checksumSha256: oldVersion.checksumSha256,
      uploadedBy: user.id,
      changeDescription:
        changeDescription ||
        `Restored from version ${oldVersion.versionNumber}`,
    });

    const savedVersion = await this.documentVersionRepository.save(newVersion);

    // 8. Update main document
    document.fileName = oldVersion.fileName;
    document.fileUrl = fileUrl;
    document.fileType = oldVersion.fileType;
    document.sizeBytes = String(buffer.length);
    document.checksumSha256 = oldVersion.checksumSha256;
    document.currentVersionId = savedVersion.id;
    document.versionCount = nextVersionNumber;

    const updatedDocument = await this.documentRepository.save(document);
    await this.documentActivityService.createActivity(
      user,
      document,
      ActivityType.VERSION_RESTORED,
      // description: `Restored version ${oldVersion.versionNumber} as version ${savedVersion.versionNumber}`,
    );

    return {
      document: updatedDocument,
      restoredFromVersion: oldVersion.versionNumber,
      newVersion: savedVersion,
    };
  }

  async compareVersions(
    documentId:string,
      version1:string,
      version2:string,
  ){ 
const versions = await this.documentVersionRepository.find({
  where:[
    {id:version1,documentId},
    {id:version2,documentId}
  ],
  relations:{
    uploader:true
  }
})
 if (versions.length !== 2) {
    throw new NotFoundException('One or both versions not found');
  }

  const[first,second] = versions;
   return {
    documentId,
    version1: {
      id: first.id,
      versionNumber: first.versionNumber,
      fileName: first.fileName,
      fileType: first.fileType,
      sizeBytes: first.sizeBytes,
      checksumSha256: first.checksumSha256,
      uploadedBy: first.uploader,
      createdAt: first.createdAt,
    },
    version2: {
      id: second.id,
      versionNumber: second.versionNumber,
      fileName: second.fileName,
      fileType: second.fileType,
      sizeBytes: second.sizeBytes,
      checksumSha256: second.checksumSha256,
      uploadedBy: second.uploader,
      createdAt: second.createdAt,
    },
    changes: {
      fileNameChanged: first.fileName !== second.fileName,
      fileSizeChanged: first.sizeBytes !== second.sizeBytes,
      contentChanged:
        first.checksumSha256 !== second.checksumSha256,
      fileTypeChanged: first.fileType !== second.fileType,
    },
  };
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
      relations: {
        owner: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    document.deletedAt = new Date();

    await this.documentRepository.save(document);

    // Fetch user (or use document.owner if already loaded)
    const user = await this.userRepository.findOne({
      where: {
        id: document.ownerId,
      },
    });

    if (user) {
      await this.documentActivityService.createActivity(
        user,
        document,
        ActivityType.MOVED_TO_TRASH,
      );
    }

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
      relations: {
        owner: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    document.deletedAt = null;

    await this.documentRepository.save(document);
    if (document.owner) {
      await this.documentActivityService.createActivity(
        document.owner,
        document,
        ActivityType.RESTORED,
      );
    }

    return {
      message: 'Document restored successfully',
    };
  }

  async permanentDelete(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: {
        owner: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }
    // // Create activity BEFORE deleting
    // if (document.owner) {
    //   await this.documentActivityService.createActivity(
    //     document.owner,
    //     document,
    //     ActivityType.PERMANENTLY_DELETED,
    //   );
    // }
    // Delete from S3
    await this.awsService.deleteFile(document.fileUrl);

    // Remove from DB
    await this.documentRepository.remove(document);

    return {
      message: 'Document permanently deleted',
    };
  }
}
