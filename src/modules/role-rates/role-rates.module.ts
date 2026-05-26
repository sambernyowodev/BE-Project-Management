import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRatesService } from './role-rates.service';
import { RoleRatesController } from './role-rates.controller';
import { RoleRate } from './entities/role-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRate])],
  controllers: [RoleRatesController],
  providers: [RoleRatesService],
  exports: [RoleRatesService],
})
export class RoleRatesModule {}
