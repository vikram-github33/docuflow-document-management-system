import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadDocumentDto } from './upload-document.dto';
import { AwsService } from '../aws/aws.service';
import path from 'path';
import { Document } from './documents.entity';
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly awsService: AwsService
  ) {}
  async upload(file: Express.Multer.File, body: UploadDocumentDto) {
    const fileKey = `documents/${body.folderId}/${Date.now()}-${file.originalname}`;
      console.log("process.env.AWS_BUCKET_NAME",process.env.AWS_S3_BUCKET)
    await this.awsService.uploadFile(file, fileKey);

    const document = this.documentRepository.create({
      file: file.originalname,
     fileType: file.mimetype,
      extension: path.extname(file.originalname),
      sizeBytes: file.size.toString(),
      s3Key: fileKey,
      s3Bucket: process.env.AWS_S3_BUCKET,
      s3Region: process.env.AWS_REGION,
      folderId: body.folderId,
    //   ownerId: body.ownerId,
    });

    return this.documentRepository.save(document);
  }
}
