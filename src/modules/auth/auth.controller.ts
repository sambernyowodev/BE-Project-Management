import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBaseResponse } from '../../common/decorators/api-response.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBaseResponse(AuthResponseDto)
  async register(@Body() dto: RegisterDto): Promise<BaseResponseDto<AuthResponseDto>> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBaseResponse(AuthResponseDto)
  async login(@Body() dto: LoginDto): Promise<BaseResponseDto<AuthResponseDto>> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged in user' })
  @ApiBaseResponse(UserResponseDto)
  getProfile(@CurrentUser() user: any): BaseResponseDto<UserResponseDto> {
    return { success: true, data: user };
  }
}
