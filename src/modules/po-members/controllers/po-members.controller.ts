import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PoMembersService } from '../providers/po-members.service';
import { AssignPoMemberDto } from '../dto/po-member.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../../common/decorators/api-response.decorator';
import { PoMemberResponseDto } from '../dto/po-member-response.dto';
import { BaseResponseDto } from '../../../common/dtos/response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('PO Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('po-members')
export class PoMembersController {
  constructor(private readonly poMembersService: PoMembersService) { }

  @Post()
  @ApiOperation({ summary: 'Assign a member to PO' })
  @ApiBaseResponse(PoMemberResponseDto)
  assign(
    @Body() dto: AssignPoMemberDto,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<PoMemberResponseDto>> {
    return this.poMembersService.assign(dto, user.sub);
  }

  @Get('po/:poId')
  @ApiOperation({ summary: 'Get members by PO' })
  @ApiBaseListResponse(PoMemberResponseDto)
  findByPo(@Param('poId') poId: string): Promise<BaseResponseDto<PoMemberResponseDto[]>> {
    return this.poMembersService.findByPo(+poId);
  }

  @Put(':id/actuals')
  @ApiOperation({ summary: 'Update actual mandays' })
  @ApiBaseResponse(PoMemberResponseDto)
  updateActuals(
    @Param('id', ParseIntPipe) id: number,
    @Body('actualMandays') mandays: number,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<PoMemberResponseDto>> {
    return this.poMembersService.updateActuals(id, mandays, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove member from PO' })
  @ApiBaseResponse(BaseResponseDto)
  remove(
    @Param('id', ParseIntPipe) id: number
  ): Promise<BaseResponseDto<void>> {
    return this.poMembersService.remove(id);
  }
}

