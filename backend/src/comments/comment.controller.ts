// src/comments/comments.controller.ts
import { Controller, Post, Body ,Get } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { Comment } from '../model/comment.model';

@Controller('comments') // Route prefix is 'comments'
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post() // Handles POST /comments
  async createComment(
    @Body('content') content: string,
    @Body('postId') postId: string,
    @Body('authorId') authorId: string,
    @Body('userName') userName: string,
    @Body('userAvatar') userAvatar: string,


  ): Promise<Comment> {
    return this.commentsService.createComment(content, postId, authorId, userName, userAvatar);
  }

  @Get('test')
  testRoute() {
    return 'Comments controller is working!';
}
}