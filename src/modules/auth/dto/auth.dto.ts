import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @ApiProperty({ example: 'Password123' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'Password harus mengandung huruf besar, huruf kecil, dan angka',
  })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;
}
