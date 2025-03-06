import { IsEmail, IsNotEmpty, IsString, MinLength,IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional() // Allow phone to be optional
  @IsString()
  phone: string | null;
  
  @IsNotEmpty()
  @MinLength(6)
  password: string;

}
