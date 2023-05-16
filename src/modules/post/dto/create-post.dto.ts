import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from 'src/entities/category.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsOptional()
  categoryId: number;

  @IsOptional()
  @IsString()
  mainImageUrl: string;

  @IsOptional()
  category: Category;
}
