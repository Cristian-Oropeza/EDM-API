import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name!: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  @MaxLength(250, { message: 'La descripción no puede tener más de 250 caracteres' })
  description!: string;

  @IsBoolean({ message: 'La prioridad debe ser true o false' })
  @IsNotEmpty({ message: 'La prioridad es obligatoria' })
  priority!: boolean;

  @IsNumber({}, { message: 'El user_id debe ser un número' })
  @IsInt({ message: 'El user_id debe ser un número entero' })
  @IsNotEmpty({ message: 'El user_id es obligatorio' })
  user_id!: number;
}