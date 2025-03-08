// src/club/interfaces/club.interface.ts
import { Document } from 'mongoose';

export interface Club extends Document {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  logo: string;
  memberCount: number;
  category: string;
  role: string;
  ownerId?: string;
  pendingMembers?: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
  }>;
}