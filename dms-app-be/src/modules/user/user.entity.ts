import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Folder } from '../folders/folders.entity';
import { Document } from '../documents/documents.entity';
import { Favorite } from 'src/modules/favorites/favourites.entity';
import { RefreshToken } from '../auth/refresh-token/refresh-token.entity';
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({
    name: 'employee_id',
    length: 50,
    nullable: true,
  })
  employeeId?: string;

  @Column({
    length: 20,
    nullable: true,
  })
  phone?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  department?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  designation?: string;

  @Column({
    name: 'avatar_url',
    length: 500,
    nullable: true,
  })
  avatarUrl?: string;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'last_login_at',
    type: 'timestamptz',
    nullable: true,
  })
  lastLoginAt?: Date;

  @Column({
    name: 'last_login_ip',
    nullable: true,
  })
  lastLoginIp?: string;

  @Column({
    name: 'password_changed_at',
    type: 'timestamptz',
    nullable: true,
  })
  passwordChangedAt?: Date;

  @OneToMany(() => Folder, (folder) => folder.owner)
  folders: Folder[];

  @OneToMany(() => Document, (document) => document.owner)
  documents: Document[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];

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
