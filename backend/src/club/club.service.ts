// src/club/club.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club } from '../model/club.model';
import { User } from '../model/user.model';

import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ApproveMemberDto } from './dto/approve-member.dto';
@Injectable()
export class ClubService {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<Club>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Create a new club
  async createClub(createClubDto: CreateClubDto): Promise<Club> {
    const newClub = new this.clubModel({
      id: this.generateClubId(), // Generate a unique ID for the club
      ...createClubDto,
      memberCount: 1, // Start with the owner as the first member
      role: 'Owner',
    });
    return newClub.save();
  }

  // Add a member to the club
  async addMember(clubId: string, addMemberDto: AddMemberDto): Promise<Club> {
    const user = await this.userModel.findById(addMemberDto.userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const club = await this.clubModel.findOne({ id: clubId }).exec();
    if (!club) {
      throw new Error('Club not found');
    }

    // Add the user to the club's pending members
    club.memberCount += 1;
    club.pendingMembers = club.pendingMembers || [];
    club.pendingMembers.push({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });

    return club.save();
  }

  // Approve a pending member
  async approveMember(clubId: string, approveMemberDto: ApproveMemberDto): Promise<Club> {
    const club = await this.clubModel.findOne({ id: clubId }).exec();
    if (!club) {
      throw new Error('Club not found');
    }

    // Remove the user from pendingMembers and add them as a full member
    club.pendingMembers = club.pendingMembers.filter(
      (member) => member.id !== approveMemberDto.userId,
    );
    club.memberCount += 1;

    return club.save();
  }

  // Remove a member from the club
  async removeMember(clubId: string, userId: string): Promise<Club> {
    const club = await this.clubModel.findOne({ id: clubId }).exec();
    if (!club) {
      throw new Error('Club not found');
    }

    // Remove the user from the club's members
    club.memberCount -= 1;
    club.pendingMembers = club.pendingMembers.filter(
      (member) => member.id !== userId,
    );

    return club.save();
  }

  // Update club details
  async updateClub(clubId: string, updateClubDto: UpdateClubDto): Promise<Club> {
    const club = await this.clubModel.findOne({ id: clubId }).exec();
    if (!club) {
      throw new Error('Club not found');
    }

    Object.assign(club, updateClubDto);
    return club.save();
  }

  // Delete a club
  async deleteClub(clubId: string): Promise<void> {
    await this.clubModel.deleteOne({ id: clubId }).exec();
  }

  // Get club details
  async getClub(clubId: string): Promise<Club> {
    const club = await this.clubModel.findOne({ id: clubId }).exec();
    if (!club) {
      throw new Error('Club not found');
    }
    return club;
  }

  // Helper function to generate a unique club ID
  private generateClubId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}