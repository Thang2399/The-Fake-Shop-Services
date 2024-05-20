import { IItem } from '@/src/module/item/interface/item.interface';

export interface ISubCategory {
  subCategoryId?: string;
}

export interface ICategory {
  _id?: string;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
  subCategories?: { subCategoryId?: string }[];
  brands?: { brandId: string }[];
  listFavoriteItems?: IItem[];
}
