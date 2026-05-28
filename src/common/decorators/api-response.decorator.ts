import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { BaseResponseDto, PaginatedResponseDto } from '../dtos/response.dto';

export const ApiBaseResponse = <TModel extends Type<any>>(model: TModel) =>
    applyDecorators(
        ApiExtraModels(BaseResponseDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(BaseResponseDto) },
                    {
                        properties: {
                            data: { $ref: getSchemaPath(model) },
                        },
                    },
                ],
            },
        }),
    );

export const ApiBaseListResponse = <TModel extends Type<any>>(model: TModel) =>
    applyDecorators(
        ApiExtraModels(BaseResponseDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(BaseResponseDto) },
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) =>
    applyDecorators(
        ApiExtraModels(PaginatedResponseDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginatedResponseDto) },
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
