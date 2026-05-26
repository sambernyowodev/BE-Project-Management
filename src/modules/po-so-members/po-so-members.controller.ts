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

@ApiTags('PO-SO Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('po-so-members')
export class PoSoMembersController {
  constructor(private readonly poSoMembersService: PoSoMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Assign a member to PO/SO' })
  assign(@Body() dto: AssignPoSoMemberDto) {
    return this.poSoMembersService.assign(dto);
  }

  @Get('po/:poId')
  @ApiOperation({ summary: 'Get members by PO' })
  findByPo(@Param('poId') poId: string) {
    return this.poSoMembersService.findByPo(+poId);
  }

  @Put(':id/actuals')
  @ApiOperation({ summary: 'Update actual mandays' })
  updateActuals(
    @Param('id') id: string,
    @Body('actualMandays') mandays: number,
  ) {
    return this.poSoMembersService.updateActuals(+id, mandays);
  }
}
