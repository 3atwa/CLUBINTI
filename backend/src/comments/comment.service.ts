// src/comments/comments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../model/comment.model';
import { User } from '../model/user.model'; // Import User model
import { Post } from '../model/post.model'; // Import Post model

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('User') private readonly userModel: Model<User>, // Inject User model
    @InjectModel('Post') private readonly postModel: Model<Post>, // Inject Post model
  ) {}

  async createComment(
    content: string,
    postId: string,
    authorId: string,
  ): Promise<Comment> {
    // Check if the post exists
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if the user exists
    const user = await this.userModel.findById(authorId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create the comment
    const newComment = new this.commentModel({ content, postId, authorId });
    return newComment.save();
  }
}