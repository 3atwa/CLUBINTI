// src/comments/comments.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comment.controller';
import { CommentsService } from './comment.service';
import { Comment, CommentSchema } from '../model/comment.model';
import { User, UserSchema } from '../model/user.model'; // Import User model
import { Post, PostSchema } from '../model/post.model'; // Import Post model

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Register User model
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]), // Register Post model
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}