import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  username!: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  password!: string;
}