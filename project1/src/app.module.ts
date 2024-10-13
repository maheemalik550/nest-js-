import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chatApp'),
    
    UsersModule, ConversationModule, MessageModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
