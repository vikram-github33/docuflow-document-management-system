import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  IsArray,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadDocumentDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  folderId?: string;

  @IsUUID()
  @ApiPropertyOptional()
  ownerId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  fileType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional()
  fileUrl?: string;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  tags?: string[];
}
