import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how are you?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID of the sender (User)',
    example: '60f6a4f1d634b62f8848c3f1',
  })
  @IsMongoId()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({
    description: 'ID of the group where the message was sent',
    example: '60f6a4f1d634b62f8848c3f2',
  })
  @IsMongoId()
  @IsNotEmpty()
  group: string;
}
