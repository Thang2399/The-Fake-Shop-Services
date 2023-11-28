import { Prop } from '@nestjs/mongoose';
import { getCurrentDateTimeIsoString } from '@/src/common/utils';

export class AbstractSchema {
  @Prop({ default: getCurrentDateTimeIsoString() }) // Set the default value to the current ISO date and time
  createdAt?: string;

  @Prop({ default: getCurrentDateTimeIsoString() })
  updatedAt?: string;
}
