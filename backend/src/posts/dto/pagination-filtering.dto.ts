import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination.dto';

export class FindPostQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name search cannnot exceed 100 chracters' })
  name?: string;
}
