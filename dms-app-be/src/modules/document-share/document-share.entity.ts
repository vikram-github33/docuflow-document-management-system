import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Document } from '../documents/documents.entity';
import { SharePermission } from 'src/enum/share-permission.enum';

@Entity('document_shares')
export class DocumentShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Document being shared
  @ManyToOne(() => Document, (document) => document.shares, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'document_id',
  })
  document: Document;

  // Owner / Person who shared
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'shared_by',
  })
  sharedBy: User;

  // User receiving access
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'shared_with',
  })
  sharedWith: User;

  @Column({
    type: 'enum',
    enum: SharePermission,
    default: SharePermission.VIEW,
  })
  permission: SharePermission;

  @Column({ name: 'document_id' })
  documentId: string;

  @Column({ name: 'shared_by' })
  sharedById: string;

  @Column({ name: 'shared_with' })
  sharedWithId: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;
}
