import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SharePermission } from 'src/enum/share-permission.enum';

export class UpdateDocumentShareDto {
  @ApiProperty({
    enum: SharePermission,
  })
  @IsEnum(SharePermission)
  permission: SharePermission;
}