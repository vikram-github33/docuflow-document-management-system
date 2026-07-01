import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { UseGuards } from '@nestjs/common';

@Controller('dashboard')
// @UseGuards(JwtAuthGuard) // ← uncomment once auth is wired
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // ── GET /dashboard ──────────────────────────────────────────────────────────
  // Single call that returns stats + storage + recent files + recent folders.
  // This is what your DashboardPage.tsx should call.
  @Get()
  @ApiOperation({ summary: 'Get full dashboard payload (stats, storage, recent items)' })
  @ApiResponse({ status: 200, description: 'Dashboard data fetched successfully' })
  async getDashboard(@Request() req: any) {
    const userId = req.user?.id; // remove fallback once auth guard is active
    const data = await this.dashboardService.getDashboard(userId);

    return {
      success: true,
      message: 'Dashboard data fetched successfully',
      data,
    };
  }

  // ── GET /dashboard/stats ────────────────────────────────────────────────────
  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard KPI stat cards only' })
  @ApiResponse({ status: 200, description: 'Stats fetched successfully' })
  async getStats(@Request() req: any) {
    const data = await this.dashboardService.getStats(req.user?.id);
    return { success: true, message: 'Stats fetched successfully', data };
  }

  // ── GET /dashboard/storage ──────────────────────────────────────────────────
  @Get('storage')
  @ApiOperation({ summary: 'Get storage usage and breakdown' })
  @ApiResponse({ status: 200, description: 'Storage stats fetched successfully' })
  async getStorage() {
    const data = await this.dashboardService.getStorageStats();
    return { success: true, message: 'Storage stats fetched successfully', data };
  }

  // ── GET /dashboard/recent-files ─────────────────────────────────────────────
  @Get('recent-files')
  @ApiOperation({ summary: 'Get recently modified documents' })
  @ApiResponse({ status: 200, description: 'Recent files fetched successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecentFiles(@Query('limit') limit: string, @Request() req: any) {
    const data = await this.dashboardService.getRecentDocuments(
      limit ? parseInt(limit, 10) : 8,
      req.user?.id,
    );
    return { success: true, message: 'Recent files fetched successfully', data };
  }

  // ── GET /dashboard/recent-folders ───────────────────────────────────────────
  @Get('recent-folders')
  @ApiOperation({ summary: 'Get recently modified folders' })
  @ApiResponse({ status: 200, description: 'Recent folders fetched successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecentFolders(@Query('limit') limit: string) {
    const data = await this.dashboardService.getRecentFolders(
      limit ? parseInt(limit, 10) : 6,
    );
    return { success: true, message: 'Recent folders fetched successfully', data };
  }
}
