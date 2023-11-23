import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { GetListItemsDto } from '@/src/module/item/dto/get-list-items.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemDocument } from '@/src/schema/item.schema';
import { Model } from 'mongoose';
import { CreateItemDto } from '@/src/module/item/dto/create-item.dto';
import {
  CREATE_ITEM_MESSAGE,
  ITEMS_MESSAGE,
} from '@/src/common/message/items/items.message';
import { Response } from 'express';
import { DeleteItemsDto } from '@/src/module/item/dto/delete-items.dto';
import { UpdateItemDto } from '@/src/module/item/dto/update-item.dto';
import { PaginationDefaultEnum } from '@/src/common/enum/pagination.enum';

@Injectable()
export class ItemsServices {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}
  async getListItems(query: GetListItemsDto, res: Response) {
    const { page, limit, search, orderBy, orderType } = query;

    const skip = (page - 1) * limit;

    const queryOptions: any = {};

    if (search) {
      queryOptions.name = { $regex: new RegExp(search, 'i') };
    }

    const sortOptions: any = {};

    sortOptions[`${orderType}`] = orderBy || PaginationDefaultEnum.OrderBy;

    const listItems = await this.itemModel
      .find(queryOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    return res.json(listItems);
  }

  async getDetailItem(id: string) {
    const specificItem = await this.itemModel.findById(id);
    if (!specificItem) {
      throw new NotFoundException({
        message: ITEMS_MESSAGE.GET_ITEM.NOT_FOUND_ITEM,
      });
    }
    return specificItem;
  }

  async getListItemsByIdsAndQuantities(
    listItems: { itemId: string; itemQuantity: number }[],
  ) {
    const query = listItems.map((item) => ({
      _id: item.itemId,
      quantity: { $gte: item.itemQuantity },
    }));

    const listFoundItemsByIds = await this.itemModel
      .find({ $or: query })
      .exec();
    return listFoundItemsByIds;
  }

  async deleteItems(dto: DeleteItemsDto) {
    const ids = dto.ids;
    return await this.itemModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  async createItemIfNotExit(dto: CreateItemDto) {
    const newItem = new this.itemModel(dto);
    await newItem.save();
    return newItem;
  }

  async createItem(dto: CreateItemDto, res: Response) {
    const name = dto.name;
    const brand = dto.brand;
    const specificItem = await this.itemModel
      .findOne({
        name: name,
        brand: brand,
      })
      .exec();

    if (!specificItem) {
      const newItem = await this.createItemIfNotExit(dto);
      const newItemResponse = {
        _id: newItem._id,
        ...dto,
      };
      return res.json({
        ...newItemResponse,
      });
    } else {
      throw new BadRequestException({
        message: CREATE_ITEM_MESSAGE.DUPLICATE_NAME,
      });
    }
  }
  async updateItem(id: string, dto: UpdateItemDto, res: Response) {
    const specificItem = await this.getDetailItem(id);
    if (specificItem) {
      const updatedItem = await this.itemModel
        .findByIdAndUpdate(
          id,
          { ...dto, updatedAt: new Date().toISOString() },
          { new: true },
        )
        .exec();
      return res.json(updatedItem);
    }
  }
}
