// src/model/comment.model.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types  } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Post' })
  postId: string; // Reference to the post being commented on

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  authorId: string; // Reference to the user who created the comment

  @Prop({ required: true })
  userName: string; // User name of the commenter

  @Prop({ required: true })
  userAvatar: string; // Avatar URL of the commenter
    
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);