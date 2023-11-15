import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class DeleteItemsDto {
  @ApiProperty({ type: [String], description: 'Array of items id' })
  @IsArray()
  @IsString({ each: true }) // Validates that each element in the array is a string
  readonly ids: string[];
}
