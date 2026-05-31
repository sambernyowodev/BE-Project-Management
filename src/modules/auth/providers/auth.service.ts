import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../master/users/providers/users.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from '../dto/auth.dto';
import { BaseResponseDto, SuccessResponseDto } from '../../../common/dtos/response.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../../master/users/dto/user-response.dto';
import { mapToDto } from '../../../common/utils/mapper.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto): Promise<BaseResponseDto<AuthResponseDto>> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser = await this.usersService.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      isActive: true,
    });

    // Automatically log in after registration
    return { success: true, data: this.generateToken(newUser) };
  }

  async login(dto: LoginDto): Promise<BaseResponseDto<AuthResponseDto>> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akun Anda tidak aktif');
    }

    return { success: true, data: this.generateToken(user) };
  }

  private generateToken(user: any): AuthResponseDto {
    const payload = {
      email: user.email,
      sub: user.id,
      fullName: user.fullName,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: mapToDto(UserResponseDto, {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      }),
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<BaseResponseDto<SuccessResponseDto>> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Password lama salah');
    }

    if (dto.newPassword === dto.oldPassword) {
      throw new BadRequestException(
        'Password baru tidak boleh sama dengan password lama',
      );
    }

    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.usersService.updatePassword(userId, newPasswordHash, userId);

    return { success: true, data: { success: true }, message: 'Password berhasil diubah' };
  }
}
