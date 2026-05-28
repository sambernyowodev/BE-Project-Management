import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../providers/users.service';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { ApiBaseResponse, ApiBaseListResponse } from '../../../../common/decorators/api-response.decorator';
import { UserResponseDto } from '../dto/user-response.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../../../common/dtos/response.dto';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiBaseListResponse(UserResponseDto)
  findAll(@Query() query: PaginationDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiBaseResponse(UserResponseDto)
  findOne(@Param('id') id: string): Promise<BaseResponseDto<UserResponseDto>> {
    return this.usersService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user/member' })
  @ApiBaseResponse(UserResponseDto)
  create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: JwtPayload)
    : Promise<BaseResponseDto<UserResponseDto>> {
    return this.usersService.createUser(dto, user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiBaseResponse(UserResponseDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: JwtPayload)
    : Promise<BaseResponseDto<UserResponseDto>> {
    return this.usersService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate user (soft delete)' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload): Promise<BaseResponseDto<null>> {
    return this.usersService.remove(id, user.sub);
  }
}
