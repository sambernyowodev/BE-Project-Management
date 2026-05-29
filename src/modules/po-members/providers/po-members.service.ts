import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { PoMember } from '../entities/po-member.entity';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { AssignPoMemberDto } from '../dto/po-member.dto';
import { BaseResponseDto } from '../../../common/dtos/response.dto';
import { PoMemberResponseDto } from '../dto/po-member-response.dto';
import { mapToDto, mapToDtoArray } from '../../../common/utils/mapper.util';

@Injectable()
export class PoMembersService {
  constructor(
    @InjectRepository(PoMember)
    private readonly memberRepo: Repository<PoMember>,
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
  ) { }

  async assign(dto: AssignPoMemberDto, userId: number): Promise<BaseResponseDto<PoMemberResponseDto>> {
    const member = this.memberRepo.create({
      ...dto,
      createdAt: new Date(),
      createdBy: userId
    });
    const saved = await this.memberRepo.save(member);
    return { success: true, data: mapToDto(PoMemberResponseDto, saved) };
  }

  async findByPo(poId: number): Promise<BaseResponseDto<PoMemberResponseDto[]>> {
    const data = await this.memberRepo.find({
      where: { poId },
      relations: { projectMember: { user: true }, role: true }
    });
    return { success: true, data: mapToDtoArray(PoMemberResponseDto, data) };
  }

  async updateActuals(id: number, actualMandays: number, userId: number): Promise<BaseResponseDto<PoMemberResponseDto>> {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`PoMember ${id} not found`);
    }
    member.actualMandays = actualMandays;
    member.updatedAt = new Date();
    member.updatedBy = userId;
    const saved = await this.memberRepo.save(member);
    return { success: true, data: mapToDto(PoMemberResponseDto, saved) };
  }

  async remove(id: number): Promise<BaseResponseDto<void>> {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`PoMember ${id} not found`);
    }
    const poId = member.poId;
    await this.memberRepo.remove(member);
    return { success: true, data: undefined };
  }
}

