// src/schemas/club.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema() // _id: false to avoid generating an _id for subdocuments
export class Club extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  coverImage: string;

  @Prop({ required: true })
  logo: string;

  @Prop({ required: true })
  memberCount: number;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  activities: string[];

  @Prop({ required: true, enum: ['Owner', 'Admin', 'Moderator', 'Member'] })
  role: string;

  @Prop()
  ownerId?: string; // Only present if the user owns the club

  @Prop({ type: [{ id: String, name: String, email: String, avatar: String }] })
  pendingMembers?: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
  }>;
}

export const ClubSchema = SchemaFactory.createForClass(Club);