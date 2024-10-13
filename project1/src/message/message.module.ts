import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schema/message.schema';
import { UserSchema } from 'src/users/schema/user.schema';
import { ConversationSchema } from 'src/conversation/schema/conversation.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: "Message", schema: MessageSchema },
      { name: "User", schema: UserSchema },
      { name: "Conversation", schema: ConversationSchema },
    ])
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
