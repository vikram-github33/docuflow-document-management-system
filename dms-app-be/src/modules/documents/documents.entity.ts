import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Folder } from '../folders/folders.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'folder_id', nullable: true })
  folderId: string;

  @ManyToOne(() => Folder, (folder) => folder.documents)
  @JoinColumn({
    name: 'folder_id',
  })
  folder: Folder;

  @Column({ length: 500 })
  fileName: string;

  // @Column({
  //   name: 'original_file_name',
  //   length: 500,
  // })
  // originalFileName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  tags?: string[];

  @Column({ name: 'file_type', length: 50 })
  fileType: string;

  @Column({ length: 20, nullable: true })
  extension: string;

  @Column({
    name: 'size_bytes',
    type: 'bigint',
    nullable: true,
  })
  sizeBytes: string;

  @Column({
    name: 'checksum_sha256',
    length: 64,
    nullable: true,
  })
  checksumSha256?: string;

  // AWS S3 Information

  @Column({
    name: 'thumbnail_url',
    length: 1000,
    nullable: true,
  })
  thumbnailUrl?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({
    name: 'preview_url',
    length: 1000,
    nullable: true,
  })
  previewUrl?: string;

  @Column({
    name: 'current_version_id',
    nullable: true,
  })
  currentVersionId?: string;

  @Column({
    name: 'version_count',
    default: 1,
  })
  versionCount: number;

  @Column({ name: 'owner_id' })
  ownerId: string;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'owner_id' })
  // owner: User;
  @Column({
    name: 'file_url',
    length: 1000,
    nullable: true,
  })
  fileUrl: string;

  @Column({
    length: 30,
    default: 'active',
  })
  status: string;

  @Column({
    name: 'workflow_status',
    length: 30,
    nullable: true,
  })
  workflowStatus?: string;

  @Column({
    name: 'is_locked',
    default: false,
  })
  isLocked: boolean;

  @Column({
    name: 'locked_by',
    nullable: true,
  })
  lockedBy?: string;

  @ManyToOne(() => User, {
    nullable: true,
  })
  @JoinColumn({ name: 'locked_by' })
  lockedByUser?: User;

  @Column({
    name: 'locked_at',
    type: 'timestamptz',
    nullable: true,
  })
  lockedAt?: Date;

  @Column({
    name: 'ocr_text',
    type: 'text',
    nullable: true,
  })
  ocrText?: string;

  
  @Column({
    name: 'ocr_status',
    length: 20,
    default: 'pending',
  })
  ocrStatus: string;

  @Column({
    name: 'ocr_completed_at',
    type: 'timestamptz',
    nullable: true,
  })
  ocrCompletedAt?: Date;

  @Column({
    name: 'virus_scan_status',
    length: 20,
    default: 'pending',
  })
  virusScanStatus: string;

  @Column({
    length: 10,
    nullable: true,
  })
  language?: string;

  @Column({
    name: 'page_count',
    nullable: true,
  })
  pageCount?: number;

  @Column({
    name: 'download_count',
    default: 0,
  })
  downloadCount: number;

  @Column({
    name: 'view_count',
    default: 0,
  })
  viewCount: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt?: Date;

  @Column({
    name: 'deleted_by',
    nullable: true,
  })
  deletedBy?: string;
}
