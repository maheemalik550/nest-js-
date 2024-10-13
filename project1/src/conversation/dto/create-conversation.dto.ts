import { IsString, IsNotEmpty, ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    description: 'The name of the conversation',
    example: 'Project Discussion',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Array of User IDs who are members of the conversation',
    example: ['613b6c5f3c39b1b3445d7ef9', '613b6c5f3c39b1b3445d7ef8'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true }) // Ensures every element in the array is a valid MongoDB ObjectId
  members: string[];
}
