import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './providers/billing.service';
import { BillingController } from './controllers/billing.controller';
import { Billing } from './entities/billing.entity';
import { BillingDetail } from './entities/billing-detail.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { PoMember } from '../po-members/entities/po-member.entity';
import { RoleRate } from '../master/role-rates/entities/role-rate.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { SupportTicket } from '../support-tickets/entities/support-ticket.entity';
import { ProjectActivity } from '../project-activities/entities/project-activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Billing,
      BillingDetail,
      PurchaseOrder,
      PoMember,
      RoleRate,
      Project,
      ProjectMember,
      SupportTicket,
      ProjectActivity,
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule { }


