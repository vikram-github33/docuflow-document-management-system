import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AiService } from './ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
  ) {}

  @Post('summarize')
  @ApiOperation({
    summary: 'Generate document summary',
  })
  summarize(
    @Body('text') text: string,
  ) {
    return this.aiService.summarize(
      text,
    );
  }

  @Post('tags')
  @ApiOperation({
    summary: 'Generate document tags',
  })
  generateTags(
    @Body('text') text: string,
  ) {
    return this.aiService.generateTags(
      text,
    );
  }

  @Post('classify')
  @ApiOperation({
    summary: 'Classify document',
  })
  classify(
    @Body('text') text: string,
  ) {
    return this.aiService.classify(
      text,
    );
  }
}