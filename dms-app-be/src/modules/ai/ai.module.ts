import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OllamaProvider } from './ollama.provider.';
import { GeminiProvider } from './gemini.provider';

@Module({
  imports: [],
  controllers: [AiController],
  providers: [AiService, OllamaProvider, GeminiProvider],
   exports: [AiService],
})
export class AIModule {}
