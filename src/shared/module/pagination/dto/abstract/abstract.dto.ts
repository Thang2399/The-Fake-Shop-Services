import { ApiProperty } from '@nestjs/swagger';

export class AbstractDto {
  @ApiProperty()
  createdAt?: string = new Date().toISOString();

  @ApiProperty()
  updatedAt?: string = new Date().toISOString();
}

export class AbstractSoftDeleteDto extends AbstractDto {
  @ApiProperty()
  deletedAt?: string;
}
