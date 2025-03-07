import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';

// DTO class for updating a user
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;


  @IsOptional()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsEnum(['admin', 'user'])
  readonly role?: string;

  @IsOptional()
  @IsString()
  readonly resetPasswordToken?: string;

  @IsOptional()
  readonly resetPasswordExpires?: Date;
}
