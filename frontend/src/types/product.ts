export interface Product {
  productId: number;
  supplierId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  discount?: number;
}
