import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El nombre no puede tener más de 80 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El apellido no puede tener más de 80 caracteres' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'El username debe ser una cadena de texto' })
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El username no puede tener más de 80 caracteres' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;
}