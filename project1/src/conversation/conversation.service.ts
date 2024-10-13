import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './schema/conversation.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';


@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,  
  ) {}

async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const createdConversation = new this.conversationModel(createConversationDto);
    return createdConversation.save();
 }
 
  async findAll(): Promise<Conversation[]> {
    return this.conversationModel.find().populate('members').exec();
  }

  async findByName(name: string): Promise<Conversation | undefined> {
    console.log(name,"name");
    
    return this.conversationModel.findOne({ name}).populate('members').exec();
  }

  async addMember(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<Conversation> {
    return this.conversationModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true },
    ).exec();
  }

}
