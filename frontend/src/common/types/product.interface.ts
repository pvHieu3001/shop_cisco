import { ICategory } from './category.interface'

export interface IProduct {
  id: number | string
  thumbnail: string
  name: string
  content: string
  category_id: number
  is_active: number
  is_hot_deal: number
  is_new: number
  price: number
  price_sale: number
  quantity: number
  sku: string
  type_discount: null | 0 | 1
  discount: number
  total_review: number
  avg_stars: number
  public_id: string
  slug: string
}
export interface IGallery {
  id?: number | string
  productId: number
  image: string
}
