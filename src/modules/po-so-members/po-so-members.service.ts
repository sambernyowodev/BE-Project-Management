import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoSoMember } from './entities/po-so-member.entity';
import { AssignPoSoMemberDto } from './dto/po-so-member.dto';

@Injectable()
export class PoSoMembersService {
  constructor(
    @InjectRepository(PoSoMember)
    private readonly memberRepo: Repository<PoSoMember>,
  ) {}

  async assign(dto: AssignPoSoMemberDto): Promise<PoSoMember> {
    const member = this.memberRepo.create(dto);
    return this.memberRepo.save(member);
  }

  async findByPo(poId: number): Promise<PoSoMember[]> {
    return this.memberRepo.find({
      where: { poId },
      relations: { projectMember: { user: true }, role: true }
    });
  }

  async updateActuals(id: number, actualMandays: number): Promise<PoSoMember> {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`PoSoMember ${id} not found`);
    }
    member.actualMandays = actualMandays;
    return this.memberRepo.save(member);
  }
}
