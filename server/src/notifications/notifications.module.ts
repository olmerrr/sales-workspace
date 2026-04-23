import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Notification } from './notification.entity';
import { NotificationsConsumer } from './notifications.consumer';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsConsumer],
  exports: [NotificationsService],
})
export class NotificationsModule {}
