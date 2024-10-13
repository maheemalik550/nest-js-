import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';

import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('groups')
export class ConversationController {
  constructor(private readonly ConversationService:ConversationService) {}

  @Post()
  async create(@Body() CreateConversationDto: CreateConversationDto) {
    const existingGroup = await this.ConversationService.findByName(CreateConversationDto.name);
    if (existingGroup) {
      throw new HttpException('Group name already exists', HttpStatus.BAD_REQUEST);
    }
  return this.ConversationService.create(CreateConversationDto);
  }

  @Get()
  async findAll() {
    return this.ConversationService.findAll();
  }

  @Get(':name')
  async findByName(@Param('name') name: string) {
    const group = await this.ConversationService.findByName(name);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    return group;
  }
}
