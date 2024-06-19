import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserAddress,
  UserAddressSchema,
} from '@/src/schema/userAddress.schema';
import { PaginationModule } from '@/src/shared/module/pagination/pagination.module';
import { UserAddressController } from '@/src/module/userAddress/controller/userAddress.controller';
import { UserAddressService } from '@/src/module/userAddress/service/userAddress.service';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserAddress.name,
        schema: UserAddressSchema,
      },
    ]),
    PaginationModule,
  ],
  controllers: [UserAddressController],
  providers: [UserAddressService, PaginationService],
})
export class UserAddressModule {}
