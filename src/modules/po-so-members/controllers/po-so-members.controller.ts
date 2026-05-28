import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PoSoMembersService } from '../providers/po-so-members.service';
import { AssignPoSoMemberDto } from '../dto/po-so-member.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../../common/decorators/api-response.decorator';
import { PoSoMemberResponseDto } from '../dto/po-so-member-response.dto';
import { BaseResponseDto } from '../../../common/dtos/response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('PO-SO Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('po-so-members')
export class PoSoMembersController {
  constructor(private readonly poSoMembersService: PoSoMembersService) { }

  @Post()
  @ApiOperation({ summary: 'Assign a member to PO/SO' })
  @ApiBaseResponse(PoSoMemberResponseDto)
  assign(
    @Body() dto: AssignPoSoMemberDto,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<PoSoMemberResponseDto>> {
    return this.poSoMembersService.assign(dto, user.sub);
  }

  @Get('po/:poId')
  @ApiOperation({ summary: 'Get members by PO' })
  @ApiBaseListResponse(PoSoMemberResponseDto)
  findByPo(@Param('poId') poId: string): Promise<BaseResponseDto<PoSoMemberResponseDto[]>> {
    return this.poSoMembersService.findByPo(+poId);
  }

  @Put(':id/actuals')
  @ApiOperation({ summary: 'Update actual mandays' })
  @ApiBaseResponse(PoSoMemberResponseDto)
  updateActuals(
    @Param('id', ParseIntPipe) id: number,
    @Body('actualMandays') mandays: number,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<PoSoMemberResponseDto>> {
    return this.poSoMembersService.updateActuals(id, mandays, user.sub);
  }
}
