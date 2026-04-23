import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitService } from '../rabbit/rabbit.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitService: RabbitService,
    private readonly notificationsService: NotificationsService,
  ) {}

  onModuleInit() {
    this.rabbitService.registerLeadCreatedHandler((event) =>
      this.notificationsService.handleLeadCreated(event),
    );
  }
}
