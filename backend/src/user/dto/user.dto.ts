import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength, IsUrl
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

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;
}
