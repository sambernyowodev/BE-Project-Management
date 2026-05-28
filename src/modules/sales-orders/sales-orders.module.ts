import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrdersService } from './providers/sales-orders.service';
import { SalesOrdersController } from './controllers/sales-orders.controller';
import { SalesOrder } from './entities/sales-order.entity';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder]), PurchaseOrdersModule],
  controllers: [SalesOrdersController],
  providers: [SalesOrdersService],
  exports: [SalesOrdersService],
})
export class SalesOrdersModule { }
