export enum Permission {
  USER_READ = 'user.read',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',

  ROLE_READ = 'role.read',
  ROLE_ASSIGN = 'role.assign',

  FOLDER_READ = 'folder.read',
  FOLDER_CREATE = 'folder.create',
  FOLDER_UPDATE = 'folder.update',
  FOLDER_DELETE = 'folder.delete',
  FOLDER_SHARE = 'folder.share',

  DOCUMENT_READ = 'document.read',
  DOCUMENT_CREATE = 'document.create',
  DOCUMENT_UPDATE = 'document.update',
  DOCUMENT_DELETE = 'document.delete',

  DOCUMENT_SHARE = 'document.share',
}

import { UserRole } from '../../user/user.entity';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,

    Permission.ROLE_READ,
    Permission.ROLE_ASSIGN,

    Permission.FOLDER_READ,
    Permission.FOLDER_CREATE,
    Permission.FOLDER_UPDATE,
    Permission.FOLDER_DELETE,
    Permission.FOLDER_SHARE,

    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_CREATE,
    Permission.DOCUMENT_UPDATE,
    Permission.DOCUMENT_DELETE,
    Permission.DOCUMENT_SHARE,
  ],

  [UserRole.MANAGER]: [
    Permission.USER_READ,

    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_CREATE,
    Permission.DOCUMENT_UPDATE,
    Permission.DOCUMENT_SHARE,

    Permission.FOLDER_READ,
    Permission.FOLDER_CREATE,
    Permission.FOLDER_UPDATE,
    Permission.FOLDER_DELETE,
    Permission.FOLDER_SHARE,
  ],

  [UserRole.USER]: [
    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_CREATE,
    Permission.DOCUMENT_UPDATE,

    Permission.FOLDER_READ,
    Permission.FOLDER_CREATE,
    Permission.FOLDER_UPDATE,
    Permission.FOLDER_DELETE,
    Permission.FOLDER_SHARE,
  ],
};
