import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../model/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto, RegisterDto } from './dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer'; // For sending emails

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(registerData: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    // Check if the user with the same email already exists
    const existingUser = await this.userModel
      .findOne({ email: registerData.email })
      .exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Save the user with the hashed password
    const newUser = new this.userModel({
      ...registerData,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async login(
    loginData: AuthDto,
  ): Promise<{ message: string; access_token: string;user: Partial<User> }> {
    const user = await this.userModel
      .findOne({ email: loginData.email })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (await this.comparePassword(loginData.password, user.password)) {
      // Call the updated signToken method and await the result
      const {message, access_token} = await this.signToken(
        user._id.toString(),
        user.name,
        user.email,
        user.role,
      );
      const { password, role, _id,...userWithoutSensitiveData } = user.toObject();
      console.log(userWithoutSensitiveData);
      return { message, access_token, user: userWithoutSensitiveData };
    } else {
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    }
  }

  async findByCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (await this.comparePassword(password, user.password)) {
      return user;
    }

    return null;
  }

  async comparePassword(
    inputPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    // Check if both inputPassword and storedPassword are provided
    if (!inputPassword || !storedPassword) {
      throw new Error('Input password and stored password are required');
    }

    // Use bcrypt to compare hashed passwords
    return await bcrypt.compare(inputPassword, storedPassword);
  }

  async signToken(
    _id: string,
    name: string,
    email: string,
    role: string,
  ): Promise<{ message: string; access_token: string }> {
    const payload = {
      sub: _id,
      name,
      email,
      role,
    };
    const secret = this.config.get<string>('JWT_SECRET');
    const expirationTime = '4h';

    const token = await this.jwt.signAsync(payload, {
      expiresIn: expirationTime, // 1440m = 1 day
      secret: secret,
    });

    return { message: 'Login successful', access_token: token };
  }

  async validateToken(token: string): Promise<any> {
    try {
      // Use JwtService to verify the token with the secret
      const payload = this.jwt.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      console.log(payload);

      // Now you have the decoded payload
      return payload;

    } catch (error) {
      // Handle errors (e.g., token is invalid)
      throw new UnauthorizedException('Invalid token');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    const expirationTime = new Date(
      Date.now() + parseInt(this.config.get('RESET_PASSWORD_EXPIRATION_TIME')),
    ); // Parse the expiration time to an integer
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expirationTime;
    await user.save();

    // Implement sending reset password email here
    await this.sendPasswordResetEmail(user.email, resetToken);
  }

  async verifyPasswordReset(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })
      .exec();
    if (!user) {
      throw new NotFoundException(
        'Password reset token is invalid or has expired',
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  private async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<void> {
    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'user@example.com',
        pass: 'password',
      },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'IsetPFE <info@yourapp.com>', // sender address
      to: email, // list of receivers
      subject: 'Password Reset Request', // Subject line
      text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`, // plain text body
      html: `<p>Click the following link to reset your password:</p><a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`, // html body
    });

    console.log('Message sent: %s', info.messageId);
  }
}
