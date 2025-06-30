export interface Product {
  name: string;
  stockId: string;
  price: number;
  stock: number;
  brand: string;
  color?: string;
  imageUrl: string;
  quantity?: number;
}
