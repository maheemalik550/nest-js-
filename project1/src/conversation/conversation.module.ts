import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSchema } from './schema/conversation.schema';
import { UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: "Conversation", schema: ConversationSchema },
      { name: "User", schema: UserSchema },
    ])
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
