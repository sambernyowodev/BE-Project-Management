import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '../dtos/pagination.dto';

/**
 * Utility to apply standard pagination, searching, and filtering to a TypeORM SelectQueryBuilder.
 */
export function applyPagination<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationDto,
  searchFields: string[] = [],
) {
  const { page, perPage, search, filter } = paginationDto;

  // 1. Apply Search
  if (search && searchFields.length > 0) {
    queryBuilder.andWhere(
      '(' +
      searchFields
        .map((field, idx) => {
          const fullField = field.includes('.') ? field : `${queryBuilder.alias}.${field}`;
          return `${fullField} LIKE :search_${idx}`;
        })
        .join(' OR ') +
      ')',
      searchFields.reduce((acc, _, idx) => {
        acc[`search_${idx}`] = `%${search}%`;
        return acc;
      }, {} as Record<string, string>),
    );
  }

  // 2. Apply Filters
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const fullKey = key.includes('.') ? key : `${queryBuilder.alias}.${key}`;
        const paramName = key.replace(/\./g, '_');

        const isIdField = key.toLowerCase().endsWith('id') || key === 'id';
        const isStatusOrType = key.toLowerCase().endsWith('status') || 
                               key.toLowerCase().endsWith('type') || 
                               ['status', 'type', 'isactive'].includes(key.toLowerCase());

        if (Array.isArray(value)) {
          queryBuilder.andWhere(`${fullKey} IN (:...${paramName})`, { [paramName]: value });
        } else if (typeof value === 'string' && !isIdField && !isStatusOrType) {
          queryBuilder.andWhere(`${fullKey} LIKE :${paramName}`, { [paramName]: `%${value}%` });
        } else {
          // Handle boolean strings '1'/'0' or 'true'/'false'
          let finalValue = value;
          if (value === '1' || value === 'true') finalValue = true;
          if (value === '0' || value === 'false') finalValue = false;
          
          queryBuilder.andWhere(`${fullKey} = :${paramName}`, { [paramName]: finalValue });
        }
      }
    });
  }

  // 3. Apply Sorting
  let finalSortBy = 'id'; // Default column
  let finalSortOrder: 'ASC' | 'DESC' = 'DESC'; // Default order

  if (paginationDto.sort) {
    const sortStr = paginationDto.sort;
    if (sortStr.startsWith('-')) {
      finalSortBy = sortStr.substring(1);
      finalSortOrder = 'DESC';
    } else {
      finalSortBy = sortStr;
      finalSortOrder = 'ASC';
    }
  }

  const fullSortField = finalSortBy.includes('.') ? finalSortBy : `${queryBuilder.alias}.${finalSortBy}`;
  queryBuilder.orderBy(fullSortField, finalSortOrder);

  // 4. Apply Skip and Take
  if (page && perPage) {
    queryBuilder.skip((page - 1) * perPage).take(perPage);
  }

  return queryBuilder;
}
