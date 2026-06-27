import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FoldersModule } from './modules/folders/folders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from './modules/storage/storage.module';
// import { AiModule } from './ai/ai.module';
import { AIModule } from './modules/ai/ai.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    DocumentsModule,
    FoldersModule,
    StorageModule,
    AIModule,
    FavoritesModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
