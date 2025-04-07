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
  Patch,
  Req,
  ForbiddenException
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto ,UserUpdateDto} from './dto';
import { User } from 'src/model/user.model';
import { AdminGuard, JwtGuard } from 'src/auth/guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

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

  @UseGuards(JwtGuard)
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


  @UseGuards(JwtGuard)
  @Patch('/update/:id')
  @ApiOperation({ summary: 'Update user profile (only self)' }) // Describes the endpoint in Swagger
  @ApiBearerAuth('access-token') // Adds Authorization header (JWT)
  @ApiBody({ type: UpdateUserDto }) // Defines the expected request body
    async updateUserBySelf(
    @Param('id') id: string,
    @Body() userUpdateDto: Partial<UserUpdateDto>,
    @Req() req: any, // Get user from JWT token
  ): Promise<User> {
    // Ensure user can only update their own profile

  
    // Restrict updatable fields
    const allowedUpdates = ['name', 'avatar', 'bio', 'location', 'occupation'];
    const filteredUpdates: Partial<UserUpdateDto> = {};
  
    for (const key of allowedUpdates) {
      if (userUpdateDto[key] !== undefined) {
        filteredUpdates[key] = userUpdateDto[key];
      }
    }
  
    return await this.userService.userUpdate(id, filteredUpdates);
  }
  
  @Patch(':id/follow/:clubId')
  @ApiOperation({ summary: 'Follow a club' })
  @ApiBearerAuth('access-token')
  async followClub(
    @Param('id') userId: string,
    @Param('clubId') clubId: string,
    @Req() req: any,
  ): Promise<User> {
    const tokenUserId = req.user._id.toString(); // The user in the token

    // Check if user is trying to follow for their own account
    if (tokenUserId !== userId) {
      throw new ForbiddenException('You cannot perform this action for another user');
    }
  
    return await this.userService.followClub(userId, clubId);
  }

}


