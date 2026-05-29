import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicketsService } from './providers/support-tickets.service';
import { SupportTicketsController } from './controllers/support-tickets.controller';
import { SupportTicket } from './entities/support-ticket.entity';
import { SupportTicketAssignee } from './entities/support-ticket-assignee.entity';
import { ProjectsModule } from '../projects/projects.module';
import { MasterProjectsModule } from '../master/project/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportTicket, SupportTicketAssignee]),
    ProjectsModule,
    MasterProjectsModule,
  ],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService],
  exports: [SupportTicketsService],
})
export class SupportTicketsModule { }
