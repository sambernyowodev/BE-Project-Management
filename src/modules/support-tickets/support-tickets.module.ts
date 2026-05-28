import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicketsService } from './providers/support-tickets.service';
import { SupportTicketsController } from './controllers/support-tickets.controller';
import { SupportTicket } from './entities/support-ticket.entity';
import { SupportTicketDetail } from './entities/support-ticket-detail.entity';
import { ProjectsModule } from '../project/projects.module';
import { MasterProjectsModule } from '../master/project/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportTicket, SupportTicketDetail]),
    ProjectsModule,
    MasterProjectsModule,
  ],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService],
  exports: [SupportTicketsService],
})
export class SupportTicketsModule { }
