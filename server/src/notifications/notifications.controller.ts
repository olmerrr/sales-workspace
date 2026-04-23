import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getMyNotifications(@Req() req: Request & { user: { userId: number } }) {
    return this.notificationsService.getUserNotifications(req.user.userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req: Request & { user: { userId: number } }) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Patch('read-all')
  markAllAsRead(@Req() req: Request & { user: { userId: number } }) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }
}
