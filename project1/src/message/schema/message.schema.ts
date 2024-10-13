import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type MessageDocument = Message & Document;

@Schema()
export class Message {
  populate(arg0: string) {
    throw new Error('Method not implemented.');
  }
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  group: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
