import { IsString, IsOptional, IsUUID, MaxLength, MinLength, IsHexColor } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFolderDto {
  @IsString()
  @MinLength(1, { message: 'Folder name is required' })
  @MaxLength(255, { message: 'Folder name must not exceed 255 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;

  @IsOptional()
  @IsUUID('4', { message: 'parentId must be a valid UUID' })
  parentId?: string | null;

  @IsOptional()
  @IsHexColor({ message: 'color must be a valid hex color e.g. #1976d2' })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;
}
