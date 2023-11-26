import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from '@/src/module/invoice/dto/create-invoice.dto';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from '@/src/schema/invoice.schema';
import mongoose, { Model } from 'mongoose';
import { ItemsServices } from '@/src/module/item/service/items.service';
import { Item, ItemDocument } from '@/src/schema/item.schema';
import { IPurchaseItem } from '@/src/module/invoice/interface/invoice.interface';
import { ITEMS_MESSAGE } from '@/src/common/message/items/items.message';
import * as dayjs from 'dayjs';
import { PaginationDefaultEnum } from '@/src/shared/module/pagination/enum/pagination.enum';
import { GetListInvoicesDto } from '@/src/module/invoice/dto/get-list-invoices.dto';
import { UpdateInvoiceStatusDto } from '@/src/module/invoice/dto/update-invoice-status.dto';
import { INVOICE_MESSAGE } from '@/src/common/message/invoice/invoice.message';
import { Invoice_Status } from '@/src/module/invoice/enum/invoice.enum';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private itemsServices: ItemsServices,
    private paginationService: PaginationService,
  ) {}

  createInvoiceId() {
    return dayjs().format('YYYYMMDDHHmmss');
  }

  async createNewInvoice(dto: CreateInvoiceDto) {
    const newInvoice = new this.invoiceModel(dto);
    await newInvoice.save();
    return newInvoice;
  }

  async handleOutOfStockItems(
    listPurchaseItems: IPurchaseItem[],
    listFoundItemsIds: string[],
  ) {
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
      return await this.handleOutOfStockItems(
        listPurchaseItems,
        listFoundItemsIds,
      );
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
    const listInvoicesData = await this.paginationService.getPaginationData(
      this.invoiceModel,
      query,
    );

    const listInvoices = listInvoicesData.data;

    const listPurchasedItems = listInvoices.map((item: InvoiceDocument) => {
      return item.listPurchaseItems;
    });

    const listPurchasedItemsData =
      await this.itemsServices.getListPurchasedItemsData(listPurchasedItems);

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

    const response = {
      ...listInvoicesData,
      data: convertListInvoicesWithPurchasedItemsData,
    };

    return res.json(response);
  }

  async updateInvoiceStatus(
    id: string,
    dto: UpdateInvoiceStatusDto,
    res: Response,
  ) {
    const { invoiceNewStatus } = dto;
    const specificInvoice = await this.invoiceModel.findById(id);

    if (!specificInvoice) {
      throw new NotFoundException({
        message: INVOICE_MESSAGE.NOT_FOUND_INVOICE,
      });
    } else {
      const { listPurchaseItems, invoiceStatus } = specificInvoice;

      const listItemsFromDatabase =
        await this.itemsServices.getListItemsByIdsAndQuantities(
          listPurchaseItems,
        );

      // check whether the invoice has not been handled yet
      // the items ordered in the invoice were out of stock
      if (
        listItemsFromDatabase.length < listPurchaseItems.length &&
        invoiceStatus === Invoice_Status.RECEIVED_ORDER
      ) {
        const updatedCancelInvoice = await this.invoiceModel
          .findByIdAndUpdate(
            id,
            {
              invoiceStatus: Invoice_Status.CANCELED_OUT_OF_STOCK,
              updatedAt: new Date().toISOString(),
            },
            { new: true },
          )
          .exec();
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: INVOICE_MESSAGE.ITEMS_OUT_OF_STOCK,
          data: updatedCancelInvoice,
        });
      } else {
        //   packing items: minus the items quantities in the database with the quantity of ordered items
        const bulkUpdateOps = [];
        if (invoiceNewStatus === Invoice_Status.PREPARING_ITEMS) {
          // In MongoDB, the $inc operator is an update operator that increments the value of a field by a specified amount

          listPurchaseItems.forEach((item: IPurchaseItem) => {
            bulkUpdateOps.push({
              updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item.itemId) },
                update: { $inc: { quantity: -item.itemQuantity } },
              },
            });
          });

          // bulkWrite: execute a series of write operations on a MongoDB collection as a single batch
          await this.itemModel.bulkWrite(bulkUpdateOps);
        }
        //   refund items: add the items quantities in the database with the quantity of ordered items
        else if (invoiceNewStatus === Invoice_Status.FAILED) {
          listPurchaseItems.forEach((item: IPurchaseItem) => {
            bulkUpdateOps.push({
              updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item.itemId) },
                update: { $inc: { quantity: +item.itemQuantity } },
              },
            });
          });
          await this.itemModel.bulkWrite(bulkUpdateOps);
        }
        // update other invoice status
        const updateInvoice = await this.invoiceModel
          .findByIdAndUpdate(
            id,
            {
              invoiceStatus: invoiceNewStatus,
              updatedAt: new Date().toISOString(),
            },
            { new: true },
          )
          .exec();

        return res
          .status(
            invoiceNewStatus === Invoice_Status.FAILED
              ? HttpStatus.BAD_REQUEST
              : HttpStatus.ACCEPTED,
          )
          .json({
            message: `${INVOICE_MESSAGE[invoiceNewStatus]}`,
            data: updateInvoice,
          });
      }
    }
  }
}
