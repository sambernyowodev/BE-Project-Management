import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoSoMember } from './entities/po-so-member.entity';
import { AssignPoSoMemberDto } from './dto/po-so-member.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';
import { PoSoMemberResponseDto } from './dto/po-so-member-response.dto';
import { mapToDto, mapToDtoArray } from '../../common/utils/mapper.util';

@Injectable()
export class PoSoMembersService {
  constructor(
    @InjectRepository(PoSoMember)
    private readonly memberRepo: Repository<PoSoMember>,
  ) {}

  async assign(dto: AssignPoSoMemberDto): Promise<BaseResponseDto<PoSoMemberResponseDto>> {
    const member = this.memberRepo.create(dto);
    const saved = await this.memberRepo.save(member);
    return { success: true, data: mapToDto(PoSoMemberResponseDto, saved) };
  }

  async findByPo(poId: number): Promise<BaseResponseDto<PoSoMemberResponseDto[]>> {
    const data = await this.memberRepo.find({
      where: { poId },
      relations: { projectMember: { user: true }, role: true }
    });
    return { success: true, data: mapToDtoArray(PoSoMemberResponseDto, data) };
  }

  async updateActuals(id: number, actualMandays: number): Promise<BaseResponseDto<PoSoMemberResponseDto>> {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`PoSoMember ${id} not found`);
    }
    member.actualMandays = actualMandays;
    const saved = await this.memberRepo.save(member);
    return { success: true, data: mapToDto(PoSoMemberResponseDto, saved) };
  }
}
