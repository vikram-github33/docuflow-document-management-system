import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports: [TypeOrmModule.forFeature([Storage]) ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
