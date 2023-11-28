export interface ISubCategory {
  subCategoryName?: string;
  subCategoryId?: string;
}

export interface ICategory {
  _id?: string;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
  subCategories?: ISubCategory[];
}
