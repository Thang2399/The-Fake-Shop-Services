export interface IItem {
  _id: string;
  name: string;
  currency?: string;
  price: number;
  imageUrl?: string;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}
