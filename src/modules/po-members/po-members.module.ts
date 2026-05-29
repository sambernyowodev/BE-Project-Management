import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoMembersService } from './providers/po-members.service';
import { PoMembersController } from './controllers/po-members.controller';
import { PoMember } from './entities/po-member.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoMember, PurchaseOrder])],
  controllers: [PoMembersController],
  providers: [PoMembersService],
  exports: [PoMembersService],
})
export class PoMembersModule { }
