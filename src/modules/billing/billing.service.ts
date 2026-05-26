import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';
import { BillingInvoice } from './entities/billing-invoice.entity';
import { BillingInvoiceDetail } from './entities/billing-invoice-detail.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { PoSoMember } from '../po-so-members/entities/po-so-member.entity';
import { RoleRate } from '../role-rates/entities/role-rate.entity';
import { GenerateInvoiceDto } from './dto/billing.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(BillingInvoice)
    private readonly invoiceRepo: Repository<BillingInvoice>,
    @InjectRepository(BillingInvoiceDetail)
    private readonly detailRepo: Repository<BillingInvoiceDetail>,
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PoSoMember)
    private readonly poSoMemberRepo: Repository<PoSoMember>,
    @InjectRepository(RoleRate)
    private readonly roleRateRepo: Repository<RoleRate>,
  ) {}

  async generatePreview(dto: GenerateInvoiceDto) {
    const po = await this.poRepo.findOne({
      where: { id: dto.poId },
      relations: { project: true },
    });

    if (!po) throw new NotFoundException('PO not found');

    const members = await this.poSoMemberRepo.find({
      where: { poId: dto.poId, isBillable: true },
      relations: { role: true, projectMember: { user: true } },
    });

    const rateMap = new Map<number, number>();
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    for (const member of members) {
      // Find project-specific rate active during this period
      let rate = await this.roleRateRepo.createQueryBuilder('rate')
        .where('rate.roleId = :roleId', { roleId: member.roleId })
        .andWhere('rate.projectId = :projectId', { projectId: dto.projectId })
        .andWhere('rate.isActive = true')
        .andWhere('rate.effectiveFrom <= :end', { end })
        .andWhere('(rate.effectiveUntil >= :start OR rate.effectiveUntil IS NULL)', { start })
        .orderBy('rate.effectiveFrom', 'DESC')
        .getOne();

      // Fallback to global rate
      if (!rate) {
        rate = await this.roleRateRepo.createQueryBuilder('rate')
          .where('rate.roleId = :roleId', { roleId: member.roleId })
          .andWhere('rate.projectId IS NULL')
          .andWhere('rate.isActive = true')
          .andWhere('rate.effectiveFrom <= :end', { end })
          .andWhere('(rate.effectiveUntil >= :start OR rate.effectiveUntil IS NULL)', { start })
          .orderBy('rate.effectiveFrom', 'DESC')
          .getOne();
      }

      rateMap.set(member.roleId, rate ? Number(rate.ratePerManday) : 0);
    }

    const breakdown: any = {};
    for (const member of members) {
      const rate = rateMap.get(member.roleId) || 0;
      const cost = Number(member.actualMandays) * rate;
      const roleCode = member.role.code;

      if (!breakdown[roleCode]) {
        breakdown[roleCode] = {
          roleId: member.roleId,
          roleCode,
          roleName: member.role.name,
          mandays: 0,
          rate,
          subtotal: 0,
          members: [],
        };
      }
      breakdown[roleCode].mandays += Number(member.actualMandays);
      breakdown[roleCode].subtotal += cost;
      breakdown[roleCode].members.push({
        name: member.projectMember.user.fullName,
        mandays: Number(member.actualMandays),
        cost,
      });
    }

    const roleBreakdown = Object.values(breakdown);
    const totalMandays = roleBreakdown.reduce((s: number, r: any) => s + Number(r.mandays), 0) as number;
    const totalAmount = roleBreakdown.reduce((s: number, r: any) => s + Number(r.subtotal), 0) as number;
    const taxRate = dto.taxRate || 0;
    const taxAmount = (totalAmount * taxRate) / 100;
    const grandTotal = totalAmount + taxAmount;

    return {
      po,
      project: po.project,
      period: { start: dto.startDate, end: dto.endDate },
      roleBreakdown,
      totalMandays,
      totalAmount,
      taxAmount,
      grandTotal,
      taxRate,
    };
  }

  async createInvoice(dto: GenerateInvoiceDto, userId: number) {
    const preview = await this.generatePreview(dto);

    const now = new Date();
    const prefix = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-`;
    const lastInv = await this.invoiceRepo.createQueryBuilder('inv')
      .where('inv.invoiceNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('inv.invoiceNumber', 'DESC')
      .getOne();

    let nextNum = 1;
    if (lastInv && lastInv.invoiceNumber) {
      const sequence = parseInt(lastInv.invoiceNumber.split('-')[2], 10);
      if (!isNaN(sequence)) nextNum = sequence + 1;
    }
    const invoiceNumber = `${prefix}${nextNum.toString().padStart(3, '0')}`;

    const invoice = this.invoiceRepo.create({
      invoiceNumber,
      poId: dto.poId,
      projectId: dto.projectId,
      billingPeriodStart: new Date(dto.startDate),
      billingPeriodEnd: new Date(dto.endDate),
      totalMandays: preview.totalMandays,
      totalAmount: preview.totalAmount,
      taxAmount: preview.taxAmount,
      grandTotal: preview.grandTotal,
      createdById: userId,
    });

    const savedInvoice = await this.invoiceRepo.save(invoice);

    const details = preview.roleBreakdown.map((r: any) => {
      return this.detailRepo.create({
        invoiceId: savedInvoice.id,
        roleId: r.roleId,
        memberName: r.members.map((m: any) => m.name).join(', '),
        roleName: r.roleName,
        mandays: r.mandays,
        ratePerManday: r.rate,
        subtotal: r.subtotal,
      });
    });

    await this.detailRepo.save(details);
    return this.findOne(savedInvoice.id);
  }

  async findAll() {
    return this.invoiceRepo.find({ relations: { po: true, project: true } });
  }

  async findOne(id: number) {
    const inv = await this.invoiceRepo.findOne({ where: { id }, relations: { po: true, project: true } });
    if (!inv) throw new NotFoundException('Invoice not found');
    const details = await this.detailRepo.find({ where: { invoiceId: id } });
    return { ...inv, details };
  }
}
