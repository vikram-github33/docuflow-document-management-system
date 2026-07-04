import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { SharePermission } from 'src/enum/share-permission.enum';

export class CreateDocumentShareDto {
  @ApiProperty({
    example: '2e13fbb2-6b3f-4b91-b4d6-4cbe8d0a3b7a',
  })
  @IsUUID()
  sharedWithUserId: string;

  @ApiProperty({
    enum: SharePermission,
    example: SharePermission.VIEW,
  })
  @IsEnum(SharePermission)
  permission: SharePermission;
}