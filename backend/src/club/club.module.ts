// src/club/club.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { Club, ClubSchema } from '../model/club.model';
import { User, UserSchema } from '../model/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Club.name, schema: ClubSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}