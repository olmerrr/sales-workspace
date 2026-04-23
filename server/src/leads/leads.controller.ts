import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
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
  createLead(@Body() dto: CreateLeadDto, @Req() req: Request & { user: { userId: number } }) {
    return this.leadsService.createLead(dto, req.user.userId);
  }
}
