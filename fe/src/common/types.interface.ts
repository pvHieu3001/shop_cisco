export interface IProduct {
  isDisplayHot: string // blank: all, 0: false, 1: true
  id: string
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
  categoryId: number | string
  category: ICategory
  description: string
  content: string
  productBenefits: string
  imageUrl: string
  language: string
  level: string
  name: string
  price: number
  rating: number
  slug: string
  sourceUrl: string
  status: string
  totalRating: number
  totalStudents: number
}

export interface ICategory {
  id: number
  parentId: number
  name: string
  slug: string
  description: string
  content: string
  image: string
  status: boolean
  isQuickView: boolean
  numberProduct: number
}

export interface IQuickViewProduct {
  listProduct: IProduct[]
  category: ICategory
}

export interface ILogin {
  username: string
  password: string
}

export interface IRegister {
  firstname: string
  username: string
  password: string
  lastname: string
  email: string
}

export interface IUser {
  id: number
  firstname: string
  username: string
  password: string
  lastname: string
  email: string
  createAt: string
}

export interface IOrder {
  id: number
  subTotal: number
  discountAmount: number
  totalAmount: number
  couponId: number
  status: string
}

export interface ILog {
  id: number
  userId: number
  productId: number
  name: string
  action: string
  ipAddress: string
  userAgent: string
}

export interface IError {
  data: string
  code: number
  message: number
}

export interface IBlog {
  id: number
  title: string
  description: string
  content: string
  image: string
  slug: string
  status: boolean
  type: string
  updatedAt: string
  updatedBy: IUser
  isDisplayHot: string // blank: all, 0: false, 1: true
}

export interface IAffiliate {
  id: number
  productId: string
  affiliateCode: string
  targetUrl: string
  expiredAt: string
  clickCount: number
  conversionCount: number
  status: boolean
  price: string
  updatedAt: string
  updatedBy: IUser
  discount: string
  image: string
}

export type ContextType = {
  setIsShowRecommendProducts: (value: boolean) => void
}
