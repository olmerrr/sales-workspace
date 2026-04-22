import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLeadDto } from './create-lead.dto';
import { LeadsService } from './leads.service';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  getAllLeads() {
    return this.leadsService.getAllLeads();
  }

  @Post()
  createLead(@Body() dto: CreateLeadDto) {
    return this.leadsService.createLead(dto);
  }
}
