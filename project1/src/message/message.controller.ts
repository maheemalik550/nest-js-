import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { Types } from 'mongoose';

@Controller('messages')
export class MessageController {
  constructor(private readonly messagesService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get('group/:groupId')
  async findByGroup(@Param('groupId') groupId: string) {
    return this.messagesService.findByGroup(new Types.ObjectId(groupId));
  }
}
