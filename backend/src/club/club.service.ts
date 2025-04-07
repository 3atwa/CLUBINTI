// src/club/club.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club } from '../model/club.model';
import { User } from '../model/user.model';
import { Post } from '../model/post.model';
import { Comment } from '../model/comment.model';


import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ApproveMemberDto } from './dto/approve-member.dto';
import { CreatePostDto } from './dto/create-post.dto';
@Injectable()
export class ClubService {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<Club>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,

  ) {}

  // Create a new club
  async createClub(createClubDto: CreateClubDto): Promise<Club> {
    const { ownerId, ...clubData } = createClubDto;
  
    // Step 1: Create the new club
    const newClub = new this.clubModel({
      id: this.generateClubId(),
      ...clubData,
      ownerId,
      memberCount: 1,
      role: 'Owner',
    });
    const savedClub = await newClub.save();
  
    // Step 2: Update the user's ownedClubs array
    const updatedUser = await this.userModel.findByIdAndUpdate(
      ownerId,
      { $push: { ownedClubs: savedClub } },
      { new: true }
    );
  
    if (!updatedUser) {
      throw new Error('User not found or failed to update ownedClubs');
    }
  
    return savedClub;
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
    const club = await this.clubModel.findOne({ _id: clubId }).exec();
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
    const club = await this.clubModel.findOne({ _id: clubId }).exec();
    if (!club) {
      throw new Error('Club not found');
    }
    return club;
  }


  async getClubs(): Promise<Club[]> {
    const club = await this.clubModel.find().exec();
    if (!club) {
      throw new Error('Club not found');
    }
    return club;
  }

  // Helper function to generate a unique club ID
  private generateClubId(): string {
    return Math.random().toString(36).substring(2, 15);
  }




  async createPost(clubId: string, createPostDto: CreatePostDto): Promise<Post> {
    const { title,description ,image, authorId } = createPostDto;

    // Create the post
    const newPost = new this.postModel({
      title,
      description,
      image,
      clubId,
      authorId,
    });
    const savedPost = await newPost.save();

    // Add the post to the club's posts array
    await this.clubModel.findByIdAndUpdate(clubId, {
      $push: { posts: savedPost._id },
    });

    return savedPost;
  }

  async createComment(postId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, authorId, userName, userAvatar } = createCommentDto;
    console.log(content,authorId, userName, userAvatar);
    // Create the comment
    const newComment = new this.commentModel({
      content,
      postId,
      authorId,
      userName,  // Add the userName
      userAvatar, // Add the userAvatar
    });
    const savedComment = await newComment.save();

    // Add the comment to the post's comments array
    await this.postModel.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id },
    });

    return savedComment;
  }


// src/club/club.service.ts
async getClubPosts(clubId: string): Promise<Post[]> {
    const club = await this.clubModel
      .findById(clubId)
      .populate('posts') // Populate the posts field
      .exec();
  
    if (!club) {
      throw new Error('Club not found');
    }
  
    // Cast the populated posts to Post[]
    return club.posts as unknown as Post[];
  }
// src/club/club.service.ts
async getPostComments(postId: string): Promise<Comment[]> {
    const post = await this.postModel
      .findById(postId)
      .populate('comments') // Populate the comments field
      .exec();
  
    if (!post) {
      throw new Error('Post not found');
    }
  
    // Cast the populated comments to Comment[]
    return post.comments as unknown as Comment[];
  }


  async getSuggestedPosts(userId: string): Promise<Post[]> {
    // Fetch the user and the clubs they are following
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    // Get the list of clubs the user is following
    const followedClubIds = user.followedClubs.map((club) => club.toString());

    // Find clubs the user is not following
    const clubsNotFollowed = await this.clubModel
      .find({ _id: { $nin: followedClubIds } })
      .exec();

    if (!clubsNotFollowed.length) {
      throw new Error('No clubs found that the user is not following');
    }

    // Get the posts from these clubs
    const posts = await this.postModel
      .find({ clubId: { $in: clubsNotFollowed.map((club) => club._id) } })
      .exec();

    return posts;
  }

}