import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClubModule } from './club/club.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule accessible everywhere in the app
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Fetch Mongo URI from .env file
      }),
      inject: [ConfigService], // Inject ConfigService into the useFactory function
    }),
    UserModule,
    AuthModule,
    ClubModule,
    PostsModule,
  ],
  controllers: [],
})
export class AppModule {}
