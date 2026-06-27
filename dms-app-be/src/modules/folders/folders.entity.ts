import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Document } from '../documents/documents.entity';
import { Favorite } from 'src/favorites/favourites.entity';
@Entity('folders')
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'parent_id',
    nullable: true,
  })
  parentId?: string;

  @ManyToOne(() => Folder, (folder) => folder.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'parent_id',
  })
  parent?: Folder;

  @OneToMany(() => Folder, (folder) => folder.parent)
  children: Folder[];

  @Column({
    length: 500,
    unique: true,
  })
  path: string;

  @Column({
    name: 'owner_id',
    nullable: true,
  })
  ownerId?: string;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'owner_id',
  })
  owner?: User;

  @Column({
    name: 'inherit_permissions',
    default: true,
  })
  inheritPermissions: boolean;

  @Column({
    length: 7,
    nullable: true,
  })
  color?: string;

  @Column({
    length: 50,
    nullable: true,
  })
  icon?: string;

  @Column({
    name: 'is_archived',
    default: false,
  })
  isArchived: boolean;

  @Column({
    name: 'document_count',
    default: 0,
  })
  documentCount: number;

  @OneToMany(() => Document, (document) => document.folder)
  documents: Document[];

  @OneToMany(() => Favorite, (favorite) => favorite.folder)
  favorites: Favorite[];

  @Column({
    name: 'size_bytes',
    type: 'bigint',
    default: 0,
  })
  sizeBytes: string;

  @Column({
    name: 'retention_days',
    nullable: true,
  })
  retentionDays?: number;

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
}
