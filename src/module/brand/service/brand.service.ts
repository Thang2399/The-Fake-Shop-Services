import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from '@/src/schema/brand.schema';
import { Model } from 'mongoose';
import { Item, ItemDocument } from '@/src/schema/item.schema';
import { ItemsServices } from '@/src/module/item/service/items.service';
import { CreateBrandDto } from '@/src/module/brand/dto/create-brand.dto';
import { Response } from 'express';
import { BRAND_MESSAGE } from '@/src/common/message/brand/brand.message';
import { UpdateBrandDto } from '@/src/module/brand/dto/update-brand.dto';
import { GetListBrandsDto } from '@/src/module/brand/dto/get-list-brands.dto';
import { GetDetailBrandDto } from '@/src/module/brand/dto/get-detail-brand.dto';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';
import { getCurrentDateTimeIsoString } from '@/src/common/utils';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private itemsServices: ItemsServices,
    private paginationService: PaginationService,
  ) {}

  async createNewBrandIfNotExit(dto: CreateBrandDto) {
    const newBrand = new this.brandModel(dto);
    await newBrand.save();
    return newBrand;
  }

  async getListBrands(query: GetListBrandsDto, res: Response) {
    const listBrands = await this.paginationService.getPaginationData(
      this.brandModel,
      query,
    );

    return res.json(listBrands);
  }

  async getDetailBrand(id: string, query: GetDetailBrandDto, res: Response) {
    const specificBrand = await this.brandModel.findById(id).exec();

    if (!specificBrand) {
      throw new NotFoundException({
        message: BRAND_MESSAGE.NOT_FOUND_BRAND_NAME,
      });
    } else {
      const responseSpecificBrand = specificBrand.toObject();
      const brandName = specificBrand.brandName;

      const queryOptions = {
        ...query,
        brand: brandName,
      };

      const listItems = await this.paginationService.getPaginationData(
        this.itemModel,
        queryOptions,
      );

      const response = {
        ...responseSpecificBrand,
        listItems,
      };

      return res.json({ data: response });
    }
  }

  async createBrand(dto: CreateBrandDto, res: Response) {
    const { brandName } = dto;
    const specificBrand = await this.brandModel.findOne({ brandName }).exec();

    if (!specificBrand) {
      const newBrand = await this.createNewBrandIfNotExit(dto);
      const newBrandRes = newBrand.toObject();
      return res.json({ ...newBrandRes });
    } else {
      throw new BadRequestException({
        message: BRAND_MESSAGE.DUPLICATE_BRAND_NAME,
      });
    }
  }

  async updateBrand(id: string, dto: UpdateBrandDto, res: Response) {
    const { brandName } = dto;
    const existedBrandWithDtoBrandName = await this.brandModel
      .findOne({ brandName })
      .exec();
    const existedBrandWithDtoBrandNameId =
      existedBrandWithDtoBrandName?._id.toString() || '';

    const specificBrand = await this.brandModel.findById(id).exec();

    // case 1: not found brand with required id
    if (!specificBrand) {
      throw new NotFoundException({
        message: BRAND_MESSAGE.NOT_FOUND_BRAND_NAME,
      });
    }
    // case 2: update with another duplicate name, symbol
    else if (
      existedBrandWithDtoBrandName &&
      existedBrandWithDtoBrandNameId !== id
    ) {
      throw new BadRequestException({
        message: BRAND_MESSAGE.DUPLICATE_BRAND_NAME,
      });
    } else {
      const updatedBrand = await this.brandModel
        .findByIdAndUpdate(
          id,
          {
            ...dto,
            updatedAt: getCurrentDateTimeIsoString(),
          },
          { new: true },
        )
        .exec();
      return res.json(updatedBrand);
    }
  }
}
