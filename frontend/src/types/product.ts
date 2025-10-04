export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

export const getDisplayPrice = (product: Product): number => {
  if (typeof product.discount === 'number' && product.discount > 0 && product.discount < 1) {
    return product.price * (1 - product.discount);
  }
  return product.price;
};