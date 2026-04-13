import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsSafeString } from '../../../common/decorators/is-safe-string.decorator';

export class CreateTaskDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  @IsSafeString()
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  @MaxLength(250, { message: 'La descripción no puede tener más de 250 caracteres' })
  @IsSafeString()
  description!: string;

  @IsBoolean({ message: 'La prioridad debe ser true o false' })
  @IsNotEmpty({ message: 'La prioridad es obligatoria' })
  priority!: boolean;
}