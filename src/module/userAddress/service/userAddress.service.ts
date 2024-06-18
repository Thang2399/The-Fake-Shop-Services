import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserAddress,
  UserAddressDocument,
} from '@/src/schema/userAddress.schema';
import { Model } from 'mongoose';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';
import { CreateUserAddressDto } from '@/src/module/userAddress/dto/create-user-address.dto';
import { Response } from 'express';
import { USER_ADDRESS_MESSAGE } from '@/src/common/message/userAddress/userAddress.message';
import { GetListUserAddressesDto } from '@/src/module/userAddress/dto/get-list-user-addresses.dto';
import { DeleteUserAddressesDto } from '@/src/module/userAddress/dto/delete-user-addresses.dto';
import { UpdateUserAddressDto } from '@/src/module/userAddress/dto/update-user-address.dto';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectModel(UserAddress.name)
    private userAddressModel: Model<UserAddressDocument>,
    private paginationService: PaginationService,
  ) {}

  async getListUserAddresses(query: GetListUserAddressesDto, res: Response) {
    const listUserAddresses = await this.paginationService.getPaginationData(
      this.userAddressModel,
      query,
    );
    return res.json(listUserAddresses);
  }

  async getDetailUserAddress(id: string, res: Response) {
    const specificUserAddress = await this.userAddressModel.findById(id).exec();

    if (!specificUserAddress) {
      throw new NotFoundException({
        message: USER_ADDRESS_MESSAGE.NOT_FOUND_USER_ADDRESS,
      });
    } else {
      const response = specificUserAddress.toObject();
      return res.json(response);
    }
  }

  async createUserAddressIfNotExist(dto: CreateUserAddressDto) {
    const newAddress = new this.userAddressModel(dto);
    await newAddress.save();
    return newAddress;
  }

  async updateRelatedUserDefaultAddress(userId: string) {
    await this.userAddressModel
      .updateMany(
        { userId },
        { $set: { isDefaultAddress: false } },
        { new: true },
      )
      .exec();
  }

  async createUserAddress(dto: CreateUserAddressDto, res: Response) {
    const isDefaultAddress = dto.isDefaultAddress;
    const userId = dto.userId;
    const existedUserAddress = await this.userAddressModel.findOne({
      userId: dto.userId,
      userName: dto.userName,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      district: dto.district,
      city: dto.city,
      nation: dto.nation,
    });

    if (existedUserAddress) {
      throw new BadRequestException({
        message: USER_ADDRESS_MESSAGE.DUPLICATE_USER_ADDRESS,
      });
    } else {
      if (isDefaultAddress) {
        await this.updateRelatedUserDefaultAddress(userId);
      }
      const newUserAddress = await this.createUserAddressIfNotExist(dto);
      const newUserAddressRes = newUserAddress.toObject();
      return res.json({ ...newUserAddressRes });
    }
  }

  async deleteUserAddress(dto: DeleteUserAddressesDto, res: Response) {
    const ids = dto.ids;

    const defaultUserAddress = await this.userAddressModel
      .findOne({ userId: dto.userId, isDefaultAddress: true })
      .exec();
    const defaultUserAddressId = defaultUserAddress.toObject()._id.toString();
    const isDeleteDefaultAddress = ids.includes(defaultUserAddressId);

    if (isDeleteDefaultAddress) {
      const listUserAddressNotDeleted = await this.userAddressModel
        .find({
          _id: { $nin: ids },
        })
        .exec();

      const firstUserAddressId = listUserAddressNotDeleted[0]._id;
      await this.userAddressModel
        .findByIdAndUpdate(
          firstUserAddressId,
          {
            isDefaultAddress: true,
          },
          { new: true },
        )
        .exec();
    }

    await this.userAddressModel.deleteMany({ _id: { $in: ids } }).exec();

    return res.json({
      message: USER_ADDRESS_MESSAGE.DELETE_USER_ADDRESS_SUCCESS,
      statusCode: HttpStatus.NO_CONTENT,
    });
  }

  async updateUserAddress(
    id: string,
    dto: UpdateUserAddressDto,
    res: Response,
  ) {
    const specificUserAddress = await this.userAddressModel.findById(id).exec();
    const isDefaultAddress = dto.isDefaultAddress;

    if (!specificUserAddress) {
      throw new NotFoundException({
        message: USER_ADDRESS_MESSAGE.NOT_FOUND_USER_ADDRESS,
      });
    } else {
      if (isDefaultAddress) {
        await this.updateRelatedUserDefaultAddress(dto.userId);
      }
      const updatedUserAddress = await this.userAddressModel
        .findByIdAndUpdate(id, { ...dto }, { new: true })
        .exec();
      return res.json(updatedUserAddress);
    }
  }
}
