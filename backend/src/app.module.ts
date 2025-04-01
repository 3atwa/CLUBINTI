import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClubModule } from './club/club.module';
<<<<<<< HEAD
import { PostsModule } from './posts/posts.module';
=======
import { CommentsModule } from './comments/comment.module';
>>>>>>> 7f6617df5b4f302ad2aa3ab88b2231afc213211c

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule accessible everywhere in the app
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri:'mongodb+srv://CLUBINTI:fIUjuj3sAwRaiLVK@clubinti.mg8mq.mongodb.net/',

        
      }),
      inject: [ConfigService], // Inject ConfigService into the useFactory function
    }),
    UserModule,
    AuthModule,
    ClubModule,
<<<<<<< HEAD
    PostsModule
=======
    CommentsModule,
>>>>>>> 7f6617df5b4f302ad2aa3ab88b2231afc213211c

  ],
  controllers: [],
})
export class AppModule {}
