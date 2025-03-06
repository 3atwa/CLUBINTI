// src/schemas/user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Club, ClubSchema } from './club.model'; // Import the Club schema

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: false })
  phone: string;
  
  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['admin', 'user'], default: 'user', required: true })
  role: string;


  @Prop({default: 'Avatar',})
  avatar: string;

  @Prop({default: '',})
  bio: string;

  @Prop({default: '',})
  location: string;

  @Prop({default: '',})
  occupation: string;

  @Prop({ type: Date, default: Date.now })
  joinDate: Date;

  @Prop({ type: [ClubSchema], default: [] })
  joinedClubs: Club[];

  @Prop({ type: [ClubSchema], default: [] })
  ownedClubs: Club[];

  @Prop({ type: [ClubSchema], default: [] })
  moderatedClubs: Club[];

  @Prop({ type: Map, of: Number, default: {} })
  points: Map<string, number>; // Points per club, where the key is the club ID

  // For the forget password option
  @Prop()
  resetPasswordToken: string;

  @Prop({ type: Date,default: new Date})
  resetPasswordExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);