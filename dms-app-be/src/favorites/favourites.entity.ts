import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../modules/user/user.entity';
import { Document } from '../modules/documents/documents.entity';
import { Folder } from '../modules/folders/folders.entity';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column({
    name: 'document_id',
    nullable: true,
  })
  documentId?: string;

  @ManyToOne(() => Document, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'document_id',
  })
  document?: Document;

  @Column({
    name: 'folder_id',
    nullable: true,
  })
  folderId?: string;

  @ManyToOne(() => Folder, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'folder_id',
  })
  folder?: Folder;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}