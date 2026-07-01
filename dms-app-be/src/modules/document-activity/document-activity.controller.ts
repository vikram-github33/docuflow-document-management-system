import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DocumentActivityService } from './document-activity.service';
import { ActivityType } from 'src/enum/activity.enum';

@Controller('document-activity')
export class DocumentActivityController {
  constructor(
    private readonly documentActivityService: DocumentActivityService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all document activities (filterable, paginated)' })
  @ApiResponse({ status: 200, description: 'Activities fetched successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'activityType', required: false, enum: ActivityType })
  @ApiQuery({ name: 'entityType', required: false, enum: ['document', 'folder'] })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  async getAllActivities(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('activityType') activityType?: ActivityType,
    @Query('entityType') entityType?: 'document' | 'folder',
    @Query('userId') userId?: string,
    @Query('search') search?: string,
    @Query('dateFrom') dateFrom?: string,
  ) {
    const result = await this.documentActivityService.getAllActivities({
      page:  page  ? parseInt(page, 10)  : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      activityType,
      entityType,
      userId,
      search,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    });

    return {
      success: true,
      message: 'Activities fetched successfully',
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get activity counts grouped by type — for dashboard stat cards' })
  @ApiResponse({ status: 200, description: 'Activity summary fetched successfully' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  async getActivitySummary(@Query('dateFrom') dateFrom?: string) {
    const counts = await this.documentActivityService.getActivitySummary(
      dateFrom ? new Date(dateFrom) : undefined,
    );

    return {
      success: true,
      message: 'Activity summary fetched successfully',
      data: counts,
    };
  }
}
