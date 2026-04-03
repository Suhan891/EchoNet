import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination.dto';

export class FindReelQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: 'Caption must be a string' })
  @MaxLength(100, { message: 'Caption search cannnot exceed 100 chracters' })
  caption?: string;
}
