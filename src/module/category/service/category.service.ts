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
import {
  ICategory,
  ISubCategory,
} from '@/src/module/category/interface/category.interface';
import { GetListCategoriesDto } from '@/src/module/category/dto/get-list-categories.dto';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';
import { GetCategoriesWithTypicalItemsDto } from '@/src/module/category/dto/get-categories-typical-items.dto';
import { UpdateCategoryDto } from '@/src/module/category/dto/update-category.dto';
import { Brand, BrandDocument } from '@/src/schema/brand.schema';
import { ItemsServices } from '@/src/module/item/service/items.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    private paginationService: PaginationService,
    private itemsServices: ItemsServices,
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
        return {
          _id: subCategory._id,
          categoryName: subCategory.categoryName,
          brandId:
            subCategory.brands.length > 0 ? subCategory.brands[0].brandId : '',
        };
      }),
    );

    return listSubCategoriesData;
  }

  async getBrandsData(brands: { brandId: string }[]) {
    const listBrandsData = await Promise.all(
      brands.map(async (brand: { brandId: string }) => {
        const specificBrand = await this.brandModel
          .findById(brand.brandId)
          .exec();

        return {
          _id: brand.brandId,
          brandName: specificBrand.brandName,
        };
      }),
    );

    return listBrandsData;
  }

  async updateSubCategoriesData(
    rootCategoryId: string,
    subCategories: ISubCategory[],
  ) {
    const listSubCategoriesIds = subCategories.map(
      (sub: ISubCategory) => sub.subCategoryId,
    );

    const updatedListSubCategoriesData = await Promise.all(
      listSubCategoriesIds.map(async (subId: string) => {
        const newSubCategory = await this.categoryModel
          .findByIdAndUpdate(
            subId,
            {
              rootCategoryId: rootCategoryId,
            },
            { new: true },
          )
          .exec();

        return newSubCategory;
      }),
    );

    return updatedListSubCategoriesData;
  }

  async updateListBrands(categoryId: string, brands: { brandId: string }[]) {
    const updatedListBrands = await Promise.all(
      brands.map(async (brand: { brandId: string }) => {
        const specificBrand = await this.brandModel
          .findById(brand.brandId)
          .exec();
        const categoryIdList = specificBrand.categoryIdList;
        const isUpdateCategoryIdExistInBrand = categoryIdList.some(
          (item: { categoryId: string }) => item.categoryId === categoryId,
        );

        if (!isUpdateCategoryIdExistInBrand) {
          categoryIdList.push({ categoryId: categoryId });
          const updateBrandDto = {
            ...specificBrand,
            categoryIdList,
          };

          await this.brandModel
            .findByIdAndUpdate(specificBrand._id, updateBrandDto, { new: true })
            .exec();

          return updateBrandDto;
        }

        return specificBrand;
      }),
    );

    return updatedListBrands;
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

  async getCategoriesWithTypicalItems(
    query: GetCategoriesWithTypicalItemsDto,
    res: Response,
  ) {
    const listCategories = await this.paginationService.getPaginationData(
      this.categoryModel,
      query,
    );

    const data = await Promise.all(
      listCategories.data.map(async (category: ICategory) => {
        const subCategories = category.subCategories;
        let subCategoriesData = [];
        if (subCategories.length > 0) {
          subCategoriesData = await this.getSubCategoriesData(subCategories);
        }

        let brandsData = [];
        const brands = category.brands;
        if (brands.length > 0) {
          brandsData = await this.getBrandsData(brands);
          brandsData = brandsData.map(
            (brand: { _id: string; brandName: string }) => {
              const subCategoriesWithSpecificBrandId = subCategoriesData.filter(
                (subCategory: {
                  _id: string;
                  categoryName: string;
                  brandId: string;
                }) => {
                  if (subCategory.brandId === brand._id) {
                    return {
                      _id: subCategory._id,
                      categoryName: subCategory.categoryName,
                    };
                  }
                },
              );
              return {
                ...brand,
                subCategories: subCategoriesWithSpecificBrandId,
              };
            },
          );
        }

        const listFavoriteItems = await this.itemsServices.getListFavoriteItems(
          category._id,
        );

        return {
          _id: category._id,
          categoryName: category.categoryName,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          brands: brandsData,
          listFavoriteItems: listFavoriteItems.data,
        };
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

  async updateCategory(id: string, dto: UpdateCategoryDto, res: Response) {
    const specificCategory = await this.getCategoryById(id);
    if (!specificCategory) {
      throw new NotFoundException({
        message: CATEGORY_MESSAGE.NOT_FOUND_CATEGORY_NAME,
      });
    } else {
      const rootCategoryId = dto.rootCategoryId;
      const brands = dto.brands;
      if (brands.length > 0) {
        await this.updateListBrands(id, brands);
      }
      const subCategories = dto.subCategories;

      if (!rootCategoryId && subCategories.length > 0) {
        await this.updateSubCategoriesData(id, subCategories);
      }

      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, { ...dto }, { new: true })
        .exec();

      const response = updatedCategory.toObject();

      return res.json({ ...response });
    }
  }
}
