import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  password?: string;
}