import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLeadDto } from './create-lead.dto';
import { Lead } from './lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepository: Repository<Lead>,
  ) {}

  getAllLeads() {
    return this.leadsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  createLead(dto: CreateLeadDto) {
    const lead = this.leadsRepository.create(dto);
    return this.leadsRepository.save(lead);
  }
}
