import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoSoMembersService } from './po-so-members.service';
import { PoSoMembersController } from './po-so-members.controller';
import { PoSoMember } from './entities/po-so-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoSoMember])],
  controllers: [PoSoMembersController],
  providers: [PoSoMembersService],
  exports: [PoSoMembersService],
})
export class PoSoMembersModule {}
