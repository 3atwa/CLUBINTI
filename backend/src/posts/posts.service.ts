import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model , Types} from 'mongoose';
import { Post } from '../model/post.model';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}

  async likePost(userId: string, postId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
  
    post.likes.push(new Types.ObjectId(userId));
    return await post.save();
  }

  async unlikePost(userId: string, postId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
  
    post.likes = post.likes.filter(id => id.toString() !== userId);
    return await post.save();
  }


    // Delete a post by postId
    async deletePost(postId: string): Promise<void> {
      const post = await this.postModel.findById(postId);
      if (!post) throw new NotFoundException('Post not found');
  
      // Remove the post from the database
      await this.postModel.deleteOne({ _id: postId }).exec();
    }
}