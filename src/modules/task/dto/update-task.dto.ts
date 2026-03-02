import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3)
  @MaxLength(250)
  description?: string;

  @IsOptional()
  @IsBoolean()
  priority?: boolean;

  @IsOptional()
  @IsNumber()
  @IsInt()
  user_id?: number;
}