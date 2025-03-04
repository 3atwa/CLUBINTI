import { IsString, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'email cannot be empty' })
  @IsString({ message: 'email must be a string' })
  email: string;

  @IsNotEmpty({ message: 'MotDePasse cannot be empty' })
  @IsString({ message: 'MotDePasse must be a string' })
  password: string;
}