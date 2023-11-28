import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '@/src/schema/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from '@/src/module/category/dto/create-category.dto';
import { Response } from 'express';
import { CATEGORY_MESSAGE } from '@/src/common/message/category/category.message';
import { getCurrentDateTimeIsoString } from '@/src/common/utils';
import { ISubCategory } from '@/src/module/category/interface/category.interface';
import { GetListCategoriesDto } from '@/src/module/category/dto/get-list-categories.dto';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private paginationService: PaginationService,
  ) {}

  async createCategoryIfNotExist(dto: CreateCategoryDto) {
    const newCategory = new this.categoryModel(dto);
    await newCategory.save();
    return newCategory;
  }

  async getCategoryById(id: string) {
    const specificCategory = await this.categoryModel.findById(id);
    if (!specificCategory) {
      throw new NotFoundException({
        message: CATEGORY_MESSAGE.NOT_FOUND_CATEGORY_NAME,
      });
    } else {
      return specificCategory;
    }
  }

  async updateRootCategoryWithNewSubCategory(
    newCategoryId: string,
    rootCategoryId: string,
    categoryName: string,
  ) {
    const rootCategory = await this.getCategoryById(rootCategoryId);

    if (rootCategory) {
      const subCategoryPayload = {
        subCategoryId: newCategoryId,
        subCategoryName: categoryName,
      };
      const rootCategorySubCategories = rootCategory.subCategories;
      const updatedRootCategorySubCategories = [
        ...rootCategorySubCategories,
        subCategoryPayload,
      ];
      await this.categoryModel
        .findByIdAndUpdate(
          rootCategoryId,
          {
            subCategories: updatedRootCategorySubCategories,
            updatedAt: getCurrentDateTimeIsoString(),
          },
          { new: true },
        )
        .exec();
    }
  }

  async getSubCategoriesData(subCategories: ISubCategory[]) {
    const listSubCategoriesIds = subCategories.map(
      (sub: ISubCategory) => sub.subCategoryId,
    );

    const listSubCategoriesData = await Promise.all(
      listSubCategoriesIds.map(async (subId: string) => {
        const subCategory = await this.categoryModel.findById(subId).exec();
        return subCategory;
      }),
    );

    return listSubCategoriesData;
  }

  async createCategory(dto: CreateCategoryDto, res: Response) {
    const { categoryName, rootCategoryId } = dto;
    const existedCategory = await this.categoryModel
      .findOne({ categoryName })
      .exec();

    if (existedCategory) {
      throw new BadRequestException({
        message: CATEGORY_MESSAGE.DUPLICATE_CATEGORY_NAME,
      });
    } else {
      const newCategory = await this.createCategoryIfNotExist(dto);
      const newCategoryId = newCategory._id.toString();
      const response = newCategory.toObject();

      if (rootCategoryId) {
        await this.updateRootCategoryWithNewSubCategory(
          newCategoryId,
          rootCategoryId,
          categoryName,
        );
      }

      return res.json({ ...response });
    }
  }

  async getListCategories(query: GetListCategoriesDto, res: Response) {
    const listCategories = await this.paginationService.getPaginationData(
      this.categoryModel,
      query,
      { filterRootCategoryId: true },
    );
    const listCategoriesData = listCategories.data;
    const data = await Promise.all(
      listCategoriesData.map(async (category: any) => {
        const subCategories = category.subCategories;
        const subCategoriesData = await this.getSubCategoriesData(
          subCategories,
        );
        category['subCategories'] = subCategoriesData;
        return category;
      }),
    );
    const response = {
      ...listCategories,
      data,
    };
    return res.json({ ...response });
  }

  async getDetailCategory(id: string, res: Response) {
    const specificCategory = await this.getCategoryById(id);
    const subCategories = specificCategory.subCategories;

    const response = specificCategory.toObject();
    if (subCategories.length > 0) {
      const subCategoriesData = await this.getSubCategoriesData(subCategories);
      return res.json({
        ...response,
        subCategories: subCategoriesData,
      });
    }
    return res.json({ ...response });
  }
}
