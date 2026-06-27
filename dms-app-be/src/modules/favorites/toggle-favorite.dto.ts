import { IsOptional, IsUUID } from 'class-validator';

export class ToggleFavoriteDto {
  @IsOptional()
  @IsUUID()
  documentId?: string;

  @IsOptional()
  @IsUUID()
  folderId?: string;
}