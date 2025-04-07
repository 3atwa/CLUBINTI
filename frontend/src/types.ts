export interface Club {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  logo: string;
  memberCount: number;
  category: string;
  activities: Activity[];
  commonMembers?: CommonMember[];
  ownerId?: string;
  pendingMembers?: UserProfile[];
  role?: string;
}

export interface CommonMember {
  id: string;
  name: string;
  avatar: string;
}

export interface Activity {
  id: string;
  clubId: string;
  clubName: string;
  clubAvatar: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  likes: string[];
  isLiked?: boolean;
  isFollowed?: boolean;
  comments?: Comment[];
}

export interface Comment {
  _id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  occupation?: string;
  joinDate?: string;
  joinedClubs: Club[];
  ownedClubs: Club[];
  moderatedClubs?: Club[];
  points: Record<string, number>;
}