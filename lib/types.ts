export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image_url: string | null;
  file_url: string | null;
  is_active: boolean;
  stock_quantity: number;
}
