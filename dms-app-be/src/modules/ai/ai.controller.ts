import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService:AiService) {}

  @Get()
  @ApiOperation({ summary: 'Get AI response' })
  getAiResponse() {
    return this.aiService.ask('what is react');
  }
}