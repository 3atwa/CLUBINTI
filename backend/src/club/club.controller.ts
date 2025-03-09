// src/club/club.controller.ts
import {
    Controller,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Get,
  } from '@nestjs/common';
  import { ClubService } from './club.service';
  import { CreateClubDto } from './dto/create-club.dto';
  import { UpdateClubDto } from './dto/update-club.dto';
  import { AddMemberDto } from './dto/add-member.dto';
  import { ApproveMemberDto } from './dto/approve-member.dto';
  import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';






  
  @Controller('clubs')
  export class ClubController {
    constructor(private readonly clubService: ClubService) {}
  
    @Post()
    async createClub(@Body() createClubDto: CreateClubDto) {
      return this.clubService.createClub(createClubDto);
    }
  
    @Post(':clubId/members')
    async addMember(
      @Param('clubId') clubId: string,
      @Body() addMemberDto: AddMemberDto,
    ) {
      return this.clubService.addMember(clubId, addMemberDto);
    }
  
    @Patch(':clubId/members/:userId/approve')
    async approveMember(
      @Param('clubId') clubId: string,
      @Body() approveMemberDto: ApproveMemberDto,
    ) {
      return this.clubService.approveMember(clubId, approveMemberDto);
    }
  
    @Delete(':clubId/members/:userId')
    async removeMember(
      @Param('clubId') clubId: string,
      @Param('userId') userId: string,
    ) {
      return this.clubService.removeMember(clubId, userId);
    }
  
    @Patch(':clubId')
    async updateClub(
      @Param('clubId') clubId: string,
      @Body() updateClubDto: UpdateClubDto,
    ) {
      return this.clubService.updateClub(clubId, updateClubDto);
    }
  
    @Delete(':clubId')
    async deleteClub(@Param('clubId') clubId: string) {
      return this.clubService.deleteClub(clubId);
    }
  
    @Get(':clubId')
    async getClub(@Param('clubId') clubId: string) {
      return this.clubService.getClub(clubId);
    }
    
    @Get()
    async getClubs() {
      return this.clubService.getClubs();
    }

    @Post('posts/:postId/comments')
    async createComment(
      @Param('postId') postId: string,
      @Body() createCommentDto: CreateCommentDto,
    ) {
      return this.clubService.createComment(postId, createCommentDto);
    }
  
    @Get('posts/:postId/comments')
    async getPostComments(@Param('postId') postId: string) {
      return this.clubService.getPostComments(postId);
    }

    @Get(':clubId/posts')
    async getClubPosts(@Param('clubId') clubId: string) {
      return this.clubService.getClubPosts(clubId);
    }

  @Post(':clubId/posts')
  async createPost(
    @Param('clubId') clubId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.clubService.createPost(clubId, createPostDto);
  }

    
  }