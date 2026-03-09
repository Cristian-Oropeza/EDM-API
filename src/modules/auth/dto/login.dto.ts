import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class LoginDto{
    @IsNotEmpty()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
    username: string;

    @IsNotEmpty()
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @MaxLength(100, { message: 'La contraseña no puede tener más de 100 caracteres' })
    //@IsStrongPassword({ minLength: 6, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 }, { message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo' })
    password: string;
    
}