import {
  Controller,
  Patch,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtGuard } from 'src/auth/guard';
import { Types } from 'mongoose';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Patch(':postId/like/:userId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Like a post' })
  async likePost(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
    @Req() req: any
  ) {
    const tokenUserId = req.user._id.toString();
    if (tokenUserId !== userId) {
      throw new ForbiddenException('You can only like posts as yourself');
    }

    return await this.postsService.likePost(userId, postId);
  }

  @Patch(':postId/unlike/:userId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Unlike a post' })
  async unlikePost(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
    @Req() req: any
  ) {
    const tokenUserId = req.user._id.toString();
    if (tokenUserId !== userId) {
      throw new ForbiddenException('You can only unlike posts as yourself');
    }

    return await this.postsService.unlikePost(userId, postId);
  }
}
