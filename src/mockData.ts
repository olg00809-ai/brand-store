export interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  article?: string | null;
  images?: string[] | null;
  photo_file_ids?: string | null;
  brand?: string; // Для отображения бренда (мы добавим его позже)
}
export interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  article?: string | null;
  images?: string[] | null;
  photo_file_ids?: string | null;
  brand_name?: string | null;
}

export interface Variant {
  id: number;
  size: string;
  color: string | null;
  price: number | null;
  stock: number | null;
}

export interface ProductDetail extends Product {
  description: string | null;
  brand_name: string | null;
  variants: Variant[];
}