import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { User } from 'src/model/user.model';
import { AdminGuard, JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Get('users')
  async getAllUsersPageSearch(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
  ): Promise<any> {
    try {
      return await this.userService.getAllUsersPageSearch(
        page || 1,
        pageSize || 10,
        {
          name,
          email,
        },
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('total')
  async getTotalUsersCount(
    @Query('searchQuery') searchQuery: string,
    @Query('searchCategory') searchCategory: string,
  ): Promise<number> {
    try {
      return await this.userService.getTotalUsersCount(searchQuery, searchCategory);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ): Promise<User> {
    return await this.userService.updateUserRole(id, role);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post(':id/update')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateUserDto);
  }
}
