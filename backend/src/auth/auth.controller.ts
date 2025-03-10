import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './dto';
import { Get, Request, UseGuards } from '@nestjs/common';

import { User } from '../model/user.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    try {
      // Call AuthService to register a new user
      const user = await this.authService.register(registerData);

      return { message: 'Registration successful', user };
    } catch (error) {
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() loginData: AuthDto) {
    try {
      // Call AuthService instance method
      const { message, access_token, user } = await this.authService.login(loginData);

      return { message, access_token, user };
    } catch (error) {
      throw error;
    }
  }

  @Post('validateToken')
  async validateToken(@Body('token') token: string): Promise<any> {
    try {
      const payload = await this.authService.validateToken(token);
      return payload;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('requestPasswordReset')
  async requestPasswordReset(@Body('email') email: string): Promise<any> {
    try {
      await this.authService.requestPasswordReset(email);
      return { message: 'Password reset email sent' };
    } catch (error) {
      throw error;
    }
  }

  @Post('verifyPasswordReset')
  async verifyPasswordReset(
    @Body() data: { token: string; newPassword: string },
  ): Promise<any> {
    try {
      await this.authService.verifyPasswordReset(data.token, data.newPassword);
      return { message: 'Password reset successful' };
    } catch (error) {
      throw error;
    }
  }
 


}
