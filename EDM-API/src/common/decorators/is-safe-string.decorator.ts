import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

const DANGEROUS_CHARS = /[<>"'\\/;{}()]/;
const DANGEROUS_CHARS_PASSWORD = /[<>"';]/;

export function IsSafeString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSafeString',
      target: object.constructor,
      propertyName,
      options: {
        message: `El campo $property contiene caracteres no permitidos (< > " ' / \\ ; { } ( ))`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return true;
          return !DANGEROUS_CHARS.test(value);
        },
      },
    });
  };
}

export function IsSafePassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSafePassword',
      target: object.constructor,
      propertyName,
      options: {
        message: `El campo $property contiene caracteres no permitidos (< > " ' ;)`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return true;
          return !DANGEROUS_CHARS_PASSWORD.test(value);
        },
      },
    });
  };
}