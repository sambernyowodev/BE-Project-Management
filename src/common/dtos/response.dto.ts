import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

/**
 * Metadata for paginated responses.
 */
export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

/**
 * Standard success-only response.
 */
export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation successful', required: false })
  message?: string;
}

/**
 * Base wrapper for single resource responses.
 * T is the resource DTO.
 */
export class BaseResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiHideProperty()
  data: T;

  @ApiProperty({ example: 'Operation successful', required: false })
  message?: string;
}

/**
 * Base wrapper for paginated list responses.
 * T is the resource DTO.
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiHideProperty()
  data: T[];

  @ApiProperty()
  meta: PaginationMetaDto;

  @ApiProperty({ example: 'Fetch successful', required: false })
  message?: string;
}
