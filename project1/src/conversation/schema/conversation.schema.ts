import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  members: mongoose.Types.ObjectId[]
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
