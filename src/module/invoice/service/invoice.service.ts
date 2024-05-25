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
import {
  IInvoice,
  IPurchaseItem,
  IStoredPurchasedItem,
} from '@/src/module/invoice/interface/invoice.interface';
import { ITEMS_MESSAGE } from '@/src/common/message/items/items.message';
import * as dayjs from 'dayjs';
import { GetListInvoicesDto } from '@/src/module/invoice/dto/get-list-invoices.dto';
import { UpdateInvoiceStatusDto } from '@/src/module/invoice/dto/update-invoice-status.dto';
import { INVOICE_MESSAGE } from '@/src/common/message/invoice/invoice.message';
import {
  Invoice_Status,
  Payment_Method_Enum,
} from '@/src/module/invoice/enum/invoice.enum';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';
import { getCurrentDateTimeIsoString } from '@/src/common/utils';
import { PaymentService } from '@/src/module/payment/service/payment.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private itemsServices: ItemsServices,
    private paginationService: PaginationService,
    private paymentService: PaymentService,
  ) {}

  createInvoiceId() {
    return dayjs().format('YYYYMMDDHHmmss');
  }

  async createNewInvoice(dto: IInvoice) {
    const newInvoice = new this.invoiceModel(dto);
    await newInvoice.save();
    return newInvoice;
  }

  async handleOutOfStockItems(
    listPurchaseItems: IPurchaseItem[],
    convertListFoundItems: { id: string; name: string; price: number }[],
  ) {
    const listFoundItemsIds = convertListFoundItems.map(
      (item: { id: string; name: string; price: number }) => item.id,
    );
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
    const { listPurchaseItems, paymentMethod, currency } = dto;
    const listFoundPurchasedItemsFromDatabase =
      await this.itemsServices.getListItemsByIdsAndQuantities(
        listPurchaseItems,
      );

    const convertListFoundItems = listFoundPurchasedItemsFromDatabase.map(
      (item: any) => ({
        id: item._id.toString(),
        name: item.name,
        price: item.price,
      }),
    );

    if (listFoundPurchasedItemsFromDatabase.length < listPurchaseItems.length) {
      return await this.handleOutOfStockItems(
        listPurchaseItems,
        convertListFoundItems,
      );
    } else {
      const invoiceId = this.createInvoiceId();

      const listFoundItems = convertListFoundItems.map(
        (foundItem: { id: string; name: string; price: number }) => {
          const specificPurchasedOrderItem = listPurchaseItems.find(
            (purchaseItem: IPurchaseItem) => {
              if (purchaseItem.itemId === foundItem.id) {
                return purchaseItem;
              }
            },
          );
          return {
            ...foundItem,
            quantity: specificPurchasedOrderItem.itemQuantity,
          };
        },
      );

      const totalPrice = listFoundItems.reduce(
        (totalPrice: number, curr: IStoredPurchasedItem) => {
          const quantity = curr.quantity;
          const price = curr.price;
          const itemPrice = quantity * price;

          totalPrice += itemPrice;

          return totalPrice;
        },
        0,
      );

      const newInvoiceObj = {
        invoiceId,
        ...dto,
        listPurchaseItems: listFoundItems,
        totalPrice,
      };
      delete newInvoiceObj['redirectUrl'];
      const newInvoice = await this.createNewInvoice(newInvoiceObj);
      const newInvoiceRes = {
        _id: newInvoice._id,
        ...newInvoiceObj,
      };
      // handle payment method: by COD
      if (paymentMethod !== Payment_Method_Enum.CARD) {
        return res.json({
          message: INVOICE_MESSAGE.CREATE_INVOICE_SUCCESS,
          data: newInvoiceRes,
        });
      }
      // handle payment method: CARD
      else {
        const line_items = listFoundItems.map((item: IStoredPurchasedItem) => {
          const price_data = {
            currency: currency,
            unit_amount: item.price * 100,
            product_data: {
              name: item.name,
            },
          };

          return {
            price_data,
            quantity: item.quantity,
          };
        });
        const createPaymentDto = {
          invoiceId: newInvoice._id.toString(),
          totalInvoicePrice: totalPrice,
          line_items,
          redirectUrl: dto.redirectUrl,
        };
        return this.paymentService.createPayment(createPaymentDto, res);
      }
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

  async getDetailInvoice(id: string, res: Response) {
    const specificInvoice = await this.invoiceModel.findById(id).exec();

    if (!specificInvoice) {
      throw new NotFoundException({
        message: INVOICE_MESSAGE.NOT_FOUND_INVOICE,
      });
    } else {
      const listPurchaseItems = specificInvoice.listPurchaseItems;

      const listPurchasedItemsData =
        await this.itemsServices.getSinglePurchasedItemsData(listPurchaseItems);

      const specificInvoiceObj = specificInvoice.toObject();
      const response = {
        ...specificInvoiceObj,
        listPurchaseItems: listPurchasedItemsData,
      };
      return res.json(response);
    }
  }

  async updateInvoiceStatus(
    id: string,
    dto: UpdateInvoiceStatusDto,
    res: Response,
  ) {
    const {
      invoiceNewStatus,
      paymentNewStatus,
      isNewCreateInvoice,
      redirectUrl,
    } = dto;
    const specificInvoice = await this.invoiceModel.findById(id);

    if (!specificInvoice) {
      throw new NotFoundException({
        message: INVOICE_MESSAGE.NOT_FOUND_INVOICE,
      });
    } else {
      const { listPurchaseItems, invoiceStatus, paymentStatus } =
        specificInvoice;

      const listItemsFromDatabase =
        await this.itemsServices.getListItemsByIdsAndQuantities(
          listPurchaseItems,
          isNewCreateInvoice,
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
              updatedAt: getCurrentDateTimeIsoString(),
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

          listPurchaseItems.forEach((item: IStoredPurchasedItem) => {
            bulkUpdateOps.push({
              updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item.id) },
                update: { $inc: { quantity: -item.quantity } },
              },
            });
          });

          // bulkWrite: execute a series of write operations on a MongoDB collection as a single batch
          await this.itemModel.bulkWrite(bulkUpdateOps);
        }
        //   refund items: add the items quantities in the database with the quantity of ordered items
        else if (invoiceNewStatus === Invoice_Status.FAILED) {
          listPurchaseItems.forEach((item: IStoredPurchasedItem) => {
            bulkUpdateOps.push({
              updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item.id) },
                update: { $inc: { quantity: +item.quantity } },
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
              paymentStatus: paymentNewStatus || paymentStatus,
              updatedAt: getCurrentDateTimeIsoString(),
            },
            { new: true },
          )
          .exec();

        const responseMessage = isNewCreateInvoice
          ? INVOICE_MESSAGE.CREATE_INVOICE_PAYMENT_SUCCESS
          : INVOICE_MESSAGE[invoiceNewStatus];

        if (!redirectUrl) {
          return res
            .status(
              invoiceNewStatus === Invoice_Status.FAILED
                ? HttpStatus.BAD_REQUEST
                : HttpStatus.ACCEPTED,
            )
            .json({
              message: `${responseMessage}`,
              data: updateInvoice,
            });
        } else {
          const resRedirectUrl = new URL(redirectUrl);
          return res.redirect(`${resRedirectUrl.toString()}/${id}`);
        }
      }
    }
  }
}
