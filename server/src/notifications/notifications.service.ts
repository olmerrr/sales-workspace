import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { LeadCreatedEvent } from '../rabbit/rabbit.service';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  getUserNotifications(userId: number) {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: number) {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId, userId },
    });
    if (!notification) {
      return { ok: false };
    }
    if (!notification.readAt) {
      notification.readAt = new Date();
      await this.notificationsRepository.save(notification);
    }
    return { ok: true };
  }

  async markAllAsRead(userId: number) {
    await this.notificationsRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ readAt: new Date() })
      .where('userId = :userId', { userId })
      .andWhere('readAt IS NULL')
      .execute();
    return { ok: true };
  }

  async handleLeadCreated(event: LeadCreatedEvent) {
    const admins = await this.usersRepository.find({
      where: { role: UserRole.ADMIN },
      select: { id: true },
    });

    const recipientIds = new Set<number>([event.ownerId, ...admins.map((user) => user.id)]);
    const notifications = Array.from(recipientIds).map((userId) =>
      this.notificationsRepository.create({
        userId,
        type: 'lead.created',
        title: 'New lead created',
        message: `${event.name} from ${event.source} was added`,
        payload: { ...event },
        readAt: null,
      }),
    );

    await this.notificationsRepository.save(notifications);
  }
}
