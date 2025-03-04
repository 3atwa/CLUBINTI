import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: {
            // findOne: jest.fn().mockResolvedValue({userMock}), // Mock the findOne function to return the mock User
          },
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('login', () => {
  //   it('should return access token when valid login data is provided', async () => {
  //     // Mock login data
  //     const loginData: AuthDto = {
  //       email: 'example@gmail.com',
  //       password: 'password',
  //     };
      

  //     const response = await controller.login(loginData);

  //     // Assert that the response contains access token
  //     expect(response.access_token).toBeDefined();
  //   });
  // });
});
