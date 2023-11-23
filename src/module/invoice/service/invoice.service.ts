import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from '@/src/module/invoice/dto/create-invoice.dto';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from '@/src/schema/invoice.schema';
import { Model } from 'mongoose';
import { ItemsServices } from '@/src/module/item/service/items.service';
import { Item, ItemDocument } from '@/src/schema/item.schema';
import { IPurchaseItem } from '@/src/module/invoice/interface/invoice.interface';
import { ITEMS_MESSAGE } from '@/src/common/message/items/items.message';
import * as dayjs from 'dayjs';
import { PaginationDefaultEnum } from '@/src/common/enum/pagination.enum';
import { GetListInvoicesDto } from '@/src/module/invoice/dto/get-list-invoices.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private itemsServices: ItemsServices,
  ) {}

  createInvoiceId() {
    return dayjs().format('YYYYMMDDHHmmss');
  }

  async createNewInvoice(dto: CreateInvoiceDto) {
    const newInvoice = new this.invoiceModel(dto);
    await newInvoice.save();
    return newInvoice;
  }

  async getListPurchasedItemsData(queryList: IPurchaseItem[][]) {
    // Flatten the array of criteria to get an array of item IDs
    const itemIds = [
      ...new Set(
        [].concat(
          queryList.map((criteria) => criteria.map((item) => item.itemId)),
        ),
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
                (query: IPurchaseItem) => {
                  return query.itemId == item._id ? query : null;
                },
              );
              const toObjItem = item.toObject();
              const itemWithQueryQuantity = {
                ...toObjItem,
                quantity: specificItemFromQuery.itemQuantity,
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

  async createInvoice(dto: CreateInvoiceDto, res: Response) {
    const { listPurchaseItems } = dto;
    const listItemsFromDatabase =
      await this.itemsServices.getListItemsByIdsAndQuantities(
        listPurchaseItems,
      );

    const listFoundItemsIds = listItemsFromDatabase.map((item: any) =>
      item._id.toString(),
    );

    if (listItemsFromDatabase.length < listPurchaseItems.length) {
      const listNotFoundItems = listPurchaseItems.filter(
        (item: IPurchaseItem) => {
          const notFoundItem = !listFoundItemsIds.includes(item.itemId);
          return notFoundItem;
        },
      );
      throw new BadRequestException({
        message: ITEMS_MESSAGE.GET_ITEM.ITEM_OUT_OF_STOCK,
        data: listNotFoundItems,
      });
    } else {
      const invoiceId = this.createInvoiceId();

      const listFoundItems = listPurchaseItems.filter((item: IPurchaseItem) => {
        const foundItem = listFoundItemsIds.includes(item.itemId);
        return foundItem;
      });
      const newInvoiceObj = {
        invoiceId,
        ...dto,
        listPurchaseItems: listFoundItems,
      };
      const newInvoice = await this.createNewInvoice(newInvoiceObj);
      const newInvoiceRes = {
        _id: newInvoice._id,
        ...newInvoiceObj,
      };
      return res.json({
        ...newInvoiceRes,
      });
    }
  }

  async getListInvoices(query: GetListInvoicesDto, res: Response) {
    const { email, phoneNumber, page, limit, orderBy, orderType } = query;
    const skip = (page - 1) * limit;

    const queryOptions: any = {};
    if (email) {
      queryOptions.email = email;
    }
    if (phoneNumber) {
      queryOptions.phoneNumber = phoneNumber;
    }

    const sortOptions: any = {};

    sortOptions[`${orderType}`] = orderBy || PaginationDefaultEnum.OrderBy;

    const listInvoices = await this.invoiceModel
      .find(queryOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const listPurchasedItems = listInvoices.map((item: InvoiceDocument) => {
      return item.listPurchaseItems;
    });

    const listPurchasedItemsData = await this.getListPurchasedItemsData(
      listPurchasedItems,
    );

    const convertListInvoicesWithPurchasedItemsData = await Promise.all(
      listInvoices.map((invoice: InvoiceDocument, index: number) => {
        const objectInvoice = invoice.toObject();
        const specificListPurchasedItemsData = listPurchasedItemsData[index];
        return {
          ...objectInvoice,
          listPurchaseItems: specificListPurchasedItemsData,
        };
      }),
    );

    return res.json(convertListInvoicesWithPurchasedItemsData);
  }
}
