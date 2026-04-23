import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLeadDto } from './create-lead.dto';
import { Lead } from './lead.entity';
import { RabbitService } from '../rabbit/rabbit.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepository: Repository<Lead>,
    private readonly rabbitService: RabbitService,
  ) {}

  getAllLeads() {
    return this.leadsRepository.find({
      relations: {
        owner: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createLead(dto: CreateLeadDto, ownerId: number) {
    const lead = this.leadsRepository.create({ ...dto, ownerId });
    const createdLead = await this.leadsRepository.save(lead);
    await this.rabbitService.publishLeadCreated({
      leadId: createdLead.id,
      ownerId,
      name: createdLead.name,
      status: createdLead.status,
      value: createdLead.value,
      source: createdLead.source,
    });
    return createdLead;
  }
}
