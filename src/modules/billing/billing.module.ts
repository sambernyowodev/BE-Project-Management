import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './providers/billing.service';
import { BillingController } from './controllers/billing.controller';
import { BillingInvoice } from './entities/billing-invoice.entity';
import { BillingInvoiceDetail } from './entities/billing-invoice-detail.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { PoSoMember } from '../po-so-members/entities/po-so-member.entity';
import { RoleRate } from '../master/role-rates/entities/role-rate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BillingInvoice,
      BillingInvoiceDetail,
      PurchaseOrder,
      PoSoMember,
      RoleRate,
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule { }
