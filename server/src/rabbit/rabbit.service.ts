import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Channel, ChannelModel, connect, ConsumeMessage } from 'amqplib';

export interface LeadCreatedEvent {
  leadId: number;
  ownerId: number;
  name: string;
  status: string;
  value: number;
  source: string;
}

type LeadCreatedHandler = (event: LeadCreatedEvent) => Promise<void>;

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitService.name);
  private readonly queueName = process.env.RABBITMQ_QUEUE ?? 'sales_workspace.leads';
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private leadCreatedHandler: LeadCreatedHandler | null = null;

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL;
    if (!url) {
      this.logger.warn('RABBITMQ_URL is not set. RabbitMQ integration is disabled.');
      return;
    }

    try {
      const connection = await connect(url);
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });
      await channel.consume(this.queueName, (message) => this.handleMessage(message), { noAck: false });
      this.connection = connection;
      this.channel = channel;
      this.logger.log(`RabbitMQ connected. Listening on queue: ${this.queueName}`);
    } catch (error) {
      this.logger.error(`RabbitMQ init failed: ${(error as Error).message}`);
      this.channel = null;
      this.connection = null;
    }
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  async publishLeadCreated(event: LeadCreatedEvent) {
    if (!this.channel) {
      return;
    }
    const payload = Buffer.from(JSON.stringify({ type: 'lead.created', payload: event }));
    this.channel.sendToQueue(this.queueName, payload, { persistent: true });
  }

  registerLeadCreatedHandler(handler: LeadCreatedHandler) {
    this.leadCreatedHandler = handler;
  }

  private async handleMessage(message: ConsumeMessage | null) {
    if (!message || !this.channel) {
      return;
    }

    try {
      const parsed = JSON.parse(message.content.toString()) as {
        type: string;
        payload: LeadCreatedEvent;
      };
      if (parsed.type === 'lead.created' && this.leadCreatedHandler) {
        await this.leadCreatedHandler(parsed.payload);
      }
      this.channel.ack(message);
    } catch (error) {
      this.logger.error(`RabbitMQ message handling failed: ${(error as Error).message}`);
      this.channel.nack(message, false, false);
    }
  }
}
