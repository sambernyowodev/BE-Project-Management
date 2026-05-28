import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PoSoMembersService } from './po-so-members.service';
import { AssignPoSoMemberDto } from './dto/po-so-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../common/decorators/api-response.decorator';
import { PoSoMemberResponseDto } from './dto/po-so-member-response.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';

@ApiTags('PO-SO Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('po-so-members')
export class PoSoMembersController {
  constructor(private readonly poSoMembersService: PoSoMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Assign a member to PO/SO' })
  @ApiBaseResponse(PoSoMemberResponseDto)
  assign(@Body() dto: AssignPoSoMemberDto): Promise<BaseResponseDto<PoSoMemberResponseDto>> {
    return this.poSoMembersService.assign(dto);
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
    @Param('id') id: string,
    @Body('actualMandays') mandays: number,
  ): Promise<BaseResponseDto<PoSoMemberResponseDto>> {
    return this.poSoMembersService.updateActuals(+id, mandays);
  }
}
