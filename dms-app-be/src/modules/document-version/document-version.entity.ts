import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Document } from '../documents/documents.entity';
import { User } from '../user/user.entity';

@Entity('document_versions')
@Index(['documentId', 'versionNumber'], { unique: true })
export class DocumentVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'document_id' })
  documentId: string;

  @ManyToOne(() => Document, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ name: 'version_number' })
  versionNumber: number;

  @Column({ name: 'file_name', length: 500 })
  fileName: string;

  @Column({ name: 'file_url', type: 'text' })
  fileUrl: string;

  @Column({ name: 'file_type', type: 'text' })
  fileType: string;

  @Column({
    name: 'size_bytes',
    type: 'bigint',
    nullable: true,
  })
  sizeBytes?: string;

  @Column({
    name: 'checksum_sha256',
    length: 64,
    nullable: true,
  })
  checksumSha256?: string;

  @Column({ name: 'uploaded_by' })
  uploadedBy: string;

  @ManyToOne(() => User, (user) => user.uploadedDocumentVersions)
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;

  @Column({
    name: 'change_description',
    type: 'text',
    nullable: true,
  })
  changeDescription?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;
}
