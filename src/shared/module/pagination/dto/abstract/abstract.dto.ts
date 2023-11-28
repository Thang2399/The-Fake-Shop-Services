import { ApiProperty } from '@nestjs/swagger';
import { getCurrentDateTimeIsoString } from '@/src/common/utils';

export class AbstractDto {
  @ApiProperty()
  createdAt?: string = getCurrentDateTimeIsoString();

  @ApiProperty()
  updatedAt?: string = getCurrentDateTimeIsoString();
}

export class AbstractSoftDeleteDto extends AbstractDto {
  @ApiProperty()
  deletedAt?: string;
}
