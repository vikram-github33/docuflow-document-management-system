import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DocumentShare } from '../document-share/document-share.entity';
@Module({
  imports: [ TypeOrmModule.forFeature([User,DocumentShare]) ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
