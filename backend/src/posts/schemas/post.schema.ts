import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop()
  image?: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);