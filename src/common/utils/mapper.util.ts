import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * Helper to map plain objects (like TypeORM entities) to DTO instances.
 * This ensures that decorators like @Type(() => Date) are executed.
 */
export function mapToDto<T, V>(dto: ClassConstructor<T>, plain: V): T {
  return plainToInstance(dto, plain, {
    excludeExtraneousValues: false,
    enableImplicitConversion: true,
  });
}

/**
 * Helper to map arrays of plain objects to DTO instances.
 */
export function mapToDtoArray<T, V>(dto: ClassConstructor<T>, plain: V[]): T[] {
  return plainToInstance(dto, plain, {
    excludeExtraneousValues: false,
    enableImplicitConversion: true,
  });
}

/**
 * Helper to map plain objects to DTO instances strictly.
 * Only properties decorated with @Expose() in the DTO will be included.
 */
export function mapToDtoStrict<T, V>(dto: ClassConstructor<T>, plain: V): T {
  return plainToInstance(dto, plain, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}

/**
 * Helper to map arrays of plain objects to DTO instances strictly.
 */
export function mapToDtoArrayStrict<T, V>(
  dto: ClassConstructor<T>,
  plain: V[],
): T[] {
  return plainToInstance(dto, plain, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}

export function parseRelationIds(value: any): number[] {
  if (Array.isArray(value)) return value.map(Number);
  if (typeof value === 'string') {
    return value
      .split(',')
      .filter((v) => v.trim() !== '')
      .map((v) => Number(v.trim()));
  }
  return value ? [Number(value)] : [];
}
