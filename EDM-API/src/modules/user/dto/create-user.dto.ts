import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name!: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El apellido no puede tener más de 100 caracteres' })
  lastName!: string;

  @IsString({ message: 'El username debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El username es obligatorio' })
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El username no puede tener más de 100 caracteres' })
  username!: string;

  @IsStrongPassword(
    { minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 },
    { message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo' }
  )
  password!: string;
}