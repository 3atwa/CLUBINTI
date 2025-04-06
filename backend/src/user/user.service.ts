import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto, UserUpdateDto} from './dto';
import { User } from 'src/model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async updateUser(id: string, userDto: UpdateUserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, userDto, {
      new: true,
    });
  }


  async userUpdate(id: string, userDto: UserUpdateDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, userDto, {
      new: true,
    });
  }

  async getUserById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async getAllUsersPageSearch(
    page: number,
    pageSize: number,
    filters: any,
  ): Promise<any> {
    const query: any = {
      role: { $nin: 'admin' }, // Exclude canceled and finished bookings
    };

    if (filters.name) {
      // Case-insensitive search for the name
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.email) {
      // Case-insensitive search for the email
      query.email = { $regex: filters.email, $options: 'i' };
    }


    const users = await this.userModel
      .find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.userModel.countDocuments(query).exec();
    return {
      users: users,
      total,
      pageSize,
      page,
    };
  }

  async updateUserRole(userId: string, newRole: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(userId, { role: newRole });
  }

  async getTotalUsersCount(searchQuery: string, searchCategory: string): Promise<number> {
    // Implementation here
    const count = await this.userModel.countDocuments({
      // Add search criteria here
    }).exec();
    return count;
  }



  async followClub(userId: string, clubId: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { followedClubs: clubId } }, // $addToSet avoids duplicates
      { new: true }
    );
    if (!user) throw new Error('User not found');
    return user;
  }
  
  async unfollowClub(userId: string, clubId: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { followedClubs: clubId } },
      { new: true }
    );
    if (!user) throw new Error('User not found');
    return user;
  }
  
}
