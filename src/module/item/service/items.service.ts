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
import {
  IPurchaseItem,
  IStoredPurchasedItem,
} from '@/src/module/invoice/interface/invoice.interface';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';
import { getCurrentDateTimeIsoString } from '@/src/common/utils';

@Injectable()
export class ItemsServices {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private paginationService: PaginationService,
  ) {}
  async getListItems(query: GetListItemsDto, res: Response) {
    const listItems = await this.paginationService.getPaginationData(
      this.itemModel,
      query,
    );

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
    listItems:
      | { itemId: string; itemQuantity: number }[]
      | IStoredPurchasedItem[],
    isNewCreateInvoice = false,
  ) {
    let query: any;
    if (!isNewCreateInvoice) {
      query = listItems.map((item) => ({
        _id: item.itemId,
        quantity: { $gte: item.itemQuantity },
      }));
    } else {
      query = listItems.map((item) => ({
        _id: item.id,
        quantity: { $gte: item.quantity },
      }));
    }

    const listFoundItemsByIds = await this.itemModel
      .find({ $or: query })
      .exec();
    return listFoundItemsByIds;
  }

  async getListPurchasedItemsData(queryList: IStoredPurchasedItem[][]) {
    // Flatten the array of criteria to get an array of item IDs
    const itemIds = [
      ...new Set(
        [].concat(queryList.map((criteria) => criteria.map((item) => item.id))),
      ),
    ];

    const listFoundItems = await Promise.all(
      itemIds.map(async (itemsIds: string[]) => {
        const items = await this.itemModel
          .find({ _id: { $in: itemsIds } })
          .exec();
        return items;
      }),
    );

    const listFoundItemsWithQueryQuantity = [
      ...new Set(
        [].concat(
          listFoundItems.map((foundItems: any[]) => {
            const list = foundItems.map((item: any, index: number) => {
              const specificItemFromQuery = queryList[index].find(
                (query: IStoredPurchasedItem) => {
                  return query.id == item._id ? query : null;
                },
              );
              const toObjItem = item.toObject();
              const itemWithQueryQuantity = {
                ...toObjItem,
                quantity: specificItemFromQuery.quantity,
              };
              return itemWithQueryQuantity;
            });
            return list;
          }),
        ),
      ),
    ];
    return listFoundItemsWithQueryQuantity;
  }

  async getSinglePurchasedItemsData(queryList: IStoredPurchasedItem[]) {
    // Flatten the array of criteria to get an array of item IDs
    const itemIds = queryList.map((query: IStoredPurchasedItem) => query.id);

    const listFoundItems = await Promise.all(
      itemIds.map(async (itemsId: string) => {
        const items = await this.itemModel
          .find({ _id: { $in: itemsId } })
          .exec();
        return items;
      }),
    );
    const listFoundItemsWithQueryQuantity = listFoundItems.map(
      (foundItem: any[]) => {
        const foundItemObjId = foundItem[0]._id.toString();
        const foundItemObj = foundItem[0].toObject();
        const specificItemFromQuery = queryList.find(
          (query: IStoredPurchasedItem) =>
            query.id === foundItemObjId ? query : null,
        );
        const updateFoundItemWithQuantity = {
          ...foundItemObj,
          quantity: specificItemFromQuery.quantity,
        };
        return updateFoundItemWithQuantity;
      },
    );
    return listFoundItemsWithQueryQuantity;
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
    const { name } = dto;
    const existedItemWithDtoName = await this.itemModel
      .findOne({ name })
      .exec();
    const existedItemWithDtoNameId =
      existedItemWithDtoName?._id.toString() || '';

    if (!specificItem) {
      throw new NotFoundException({
        message: ITEMS_MESSAGE.GET_ITEM.NOT_FOUND_ITEM,
      });
    } else if (existedItemWithDtoName && existedItemWithDtoNameId !== id) {
      throw new BadRequestException({
        message: ITEMS_MESSAGE.CREATE_ITEM.DUPLICATE_NAME,
      });
    } else {
      const updatedItem = await this.itemModel
        .findByIdAndUpdate(
          id,
          { ...dto, updatedAt: getCurrentDateTimeIsoString() },
          { new: true },
        )
        .exec();
      return res.json(updatedItem);
    }
  }
}
