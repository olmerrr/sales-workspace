import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './users/logger.middleware';

@Module({
  imports: [
    RabbitModule,
    AuthModule,
    LeadsModule,
    NotificationsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'app_user',
      password: process.env.DB_PASSWORD ?? 'app_pass_123',
      database: process.env.DB_NAME ?? 'app_db',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC ? process.env.DB_SYNC === 'true' : true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
