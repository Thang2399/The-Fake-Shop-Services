export interface IItem {
  _id: string;
  name: string;
  currency?: string;
  price: number;
  imageUrl?: string;
  brand: string;
  category: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}
