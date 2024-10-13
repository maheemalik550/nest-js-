import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

import { Types } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';
import { UsersService } from 'src/users/users.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // Security ke liye origin restrict karen
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private ConversationService: ConversationService,
    private usersService: UsersService,
    private messagesService: MessageService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Initialized');
    console.log('WebSocket Initialized');
    
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    console.log(`Client connected: ${client.id}`);
    
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    console.log(`Client disconnected: ${client.id}`);
    
    // Additional cleanup if required
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(
    @MessageBody() data: { username: string; groupName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username, groupName } = data;

    // Find user
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      client.emit('error', { message: 'User not found' });
      return;
    }

    // Find or create group
    let group = await this.ConversationService.findByName(groupName);
    if (!group) {
      group = await this.ConversationService.create({ name: groupName, creator: user._id });
    }

    // Add user to group
    if (!group.members.includes(user._id)) {
      group = await this.ConversationService.addMember(group._id, user._id);
    }

    // Join Socket.IO room
    client.join(group.name);

    // Notify others in the group
    client.to(group.name).emit('userJoined', { username, groupName });

    // Send existing messages to the user
    const messages = await this.messagesService.findByGroup(group._id);
    client.emit('previousMessages', messages);

    this.logger.log(`${username} joined group ${groupName}`);
    console.log(`${username} joined group ${groupName}`);
    
  }


  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { username: string; groupName: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username, groupName, content } = data;
  
    // Find user
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      client.emit('error', { message: 'User not found' });
      this.logger.warn(`Message send failed: User ${username} not found`);
      console.log(`Message send failed: User ${username} not found `)
      
      return;
    }
  
    // Find group
    const group = await this.ConversationService.findByName(groupName);
    if (!group) {
      client.emit('error', { message: 'Group not found' });
      this.logger.warn(`Message send failed: Group ${groupName} not found`);
      console.log(`Message send failed: Group ${groupName} not found`);
      
      return;
    }
  
    // Create message
    const createMessageDto: CreateMessageDto = {
      content,
      sender: user._id.toString(),
      group: group._id.toString(),
    };
  
    const message = await this.messagesService.create(createMessageDto);
  
    // Populate sender field (Mongoose 6.x compatible)
    await message.populate('sender');
  
    // Broadcast message to group
    this.server.to(group.name).emit('newMessage', {
      content: message.content,
      sender: (message.sender as any).username,
      groupName: group.name,
      createdAt: message.createdAt,
    });
  
    // Log the message event
    this.logger.log(`Message from ${username} (${user._id}) in group ${group.name}: ${content}`);
    console.log(`Message from ${username} (${user._id}) in group ${group.name}: ${content}`);
    
  }
  







  @SubscribeMessage('leaveGroup')
  async handleLeaveGroup(
    @MessageBody() data: { username: string; groupName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username, groupName } = data;

    // Find user
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      client.emit('error', { message: 'User not found' });
      return;
    }

    // Find group
    const group = await this.ConversationService.findByName(groupName);
    if (!group) {
      client.emit('error', { message: 'Group not found' });
      return;
    }

    // Leave Socket.IO room
    client.leave(group.name);

    // Notify others in the group
    this.server.to(group.name).emit('userLeft', { username, groupName });

    this.logger.log(`${username} left group ${group.name}`);
    console.log(`${username} left group ${group.name}`);
    
  }
}
