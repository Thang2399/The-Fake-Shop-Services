import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class DeleteUserAddressesDto {
  @ApiProperty({ type: [String], description: 'Array of user address id' })
  @IsArray()
  @IsString({ each: true }) // Validates that each element in the array is a string
  readonly ids: string[];

  @ApiProperty({ type: String, description: 'User Id', required: true })
  @IsString()
  userId: string;
}
