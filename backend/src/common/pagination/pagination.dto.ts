import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be a integer' })
  @Min(1, { message: 'Page no. must be 1 or more' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be a integer' })
  @Min(1, { message: 'Limit must be 1 or more' })
  @Max(100, { message: 'Limit cannnott exceed 100' })
  limit?: number;
}
