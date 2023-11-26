import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PaginationDefaultEnum } from '@/src/shared/module/pagination/enum/pagination.enum';

@Injectable()
export class PaginationService {
  constructor() {}

  async getPaginationData(model: Model<any>, query: any) {
    const {
      page = PaginationDefaultEnum.Current_Page,
      limit = PaginationDefaultEnum.Page_Size,
      search = PaginationDefaultEnum.Search,
      orderBy = PaginationDefaultEnum.OrderBy,
      orderType = PaginationDefaultEnum.OrderType,
      brand = '',
      email = '',
      phoneNumber = '',
    } = query;

    const skip = (page - 1) * limit;

    const queryOptions: any = {};
    if (search) {
      queryOptions.name = { $regex: new RegExp(search, 'i') };
    }

    if (brand) {
      queryOptions.brand = brand;
    }

    if (email) {
      queryOptions.email = email;
    }
    if (phoneNumber) {
      queryOptions.phoneNumber = phoneNumber;
    }

    const sortOptions: any = {};

    sortOptions[`${orderType}`] = orderBy || PaginationDefaultEnum.OrderBy;

    const result = await model
      .find(queryOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = (await model.countDocuments(queryOptions)) || 0;
    const totalPages = Math.ceil(totalCount / limit) || 0;

    return {
      data: result,
      search,
      page,
      limit,
      totalCount,
      totalPages,
    };
  }
}
