import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrdersService } from './providers/purchase-orders.service';
import { PurchaseOrdersController } from './controllers/purchase-orders.controller';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PoProject } from './entities/po-project.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PoProject, Project])],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService],
})
export class PurchaseOrdersModule { }
