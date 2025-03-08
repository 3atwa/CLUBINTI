// src/club/club.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { Club, ClubSchema } from '../model/club.model';
import { User, UserSchema } from '../model/user.model';
import { Post, PostSchema } from '../model/post.model';
import { Comment, CommentSchema } from '../model/comment.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Club.name, schema: ClubSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}