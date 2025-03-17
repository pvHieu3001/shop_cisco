import React, { FC } from 'react'
import ButtonPrimary from '../shared/Button/ButtonPrimary'
import LikeButton from './LikeButton'
import { StarIcon } from '@heroicons/react/24/solid'
import BagIcon from './BagIcon'
import NcInputNumber from './NcInputNumber'
import { COLOR, MATERIAL } from '../../../../data/data'
import { NoSymbolIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline'
import IconDiscount from './IconDiscount'
import Prices from './Prices'
import toast from 'react-hot-toast'
import NotifyAddTocart from './NotifyAddTocart'
import { Link } from 'react-router-dom'
import { IProduct } from '@/common/types/product.interface'
import { useAddToCartMutation } from '@/services/CartEndPoinst'
import { useLocalStorage } from '@uidotdev/usehooks'
import { IAddCart, ICart } from '@/common/types/cart.interface'

export interface ProductQuickView2Props {
  className?: string
  data: IProduct
}

const ProductQuickView2: FC<ProductQuickView2Props> = ({ className = '', data }) => {
  const { name, thumbnail, slug, price, price_sale, id } = data
  const [qualitySelected, setQualitySelected] = React.useState(1)
  const [user] = useLocalStorage('user', null)
  const [addToCart] = useAddToCartMutation()

  const status = data?.is_new
    ? 'NEW'
    : data?.discount
    ? `-${data?.discount}`
    : data?.quantity
    ? 'Hết Hàng'
    : data?.is_hot_deal
    ? 'LIMITED'
    : ''

  const notifyAddTocart = async () => {
    const payload: ICart = {
      quantity: qualitySelected,
      id: id,
      name: name,
      slug: slug,
      thumbnail: thumbnail,
      user_id: user ? user.id : null,
      price: price,
      price_sale: price_sale
    }

    if (user) {
      await addToCart(payload).unwrap()
    } else {
      const cartJs = localStorage.getItem('cart')
      if (cartJs && cartJs != '[]') {
        const cart = JSON.parse(cartJs)
        const indexToUpdate = cart.findIndex((item) => item.id == id)
        if (indexToUpdate >= 0) {
          cart[indexToUpdate].quantity = qualitySelected + cart[indexToUpdate].quantity
          localStorage.setItem('cart', JSON.stringify(cart))
        } else {
          localStorage.setItem('cart', JSON.stringify([...cart, payload]))
        }
      } else {
        localStorage.setItem('cart', JSON.stringify([payload]))
      }
    }

    toast.custom(
      (t) => (
        <NotifyAddTocart
          productImage={data.thumbnail}
          qualitySelected={qualitySelected}
          show={t.visible}
          name={data.name}
          product={data}
        />
      ),
      { position: 'top-right', id: 'nc-product-notify', duration: 3000 }
    )
  }

  const renderVariants = () => {
    return (
      <div>
        <div className='flex justify-between font-medium text-lg'>
          <label htmlFor=''>
            <span className='ml-1 font-semibold'>Màu Sắc</span>
          </label>
        </div>
        <div className='grid grid-cols-4 gap-2 mt-1'>
          <div
            className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center text-xs bg-[${data?.data?.color}] uppercase font-semibold select-none overflow-hidden border-2 z-0 text-opacity-20 dark:text-opacity-20 cursor-not-allowed border-red-500 hover:bg-gray`}
          >
            {COLOR.find((x) => x.value === data?.color)?.label}
          </div>
        </div>
        <div className='flex justify-between font-medium text-lg mt-2'>
          <label htmlFor=''>
            <span className='ml-1 font-semibold'>Chất liệu</span>
          </label>
        </div>
        <div className='grid grid-cols-4 gap-2 mt-1'>
          <div className='relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center text-xs uppercase font-semibold select-none overflow-hidden border-2 z-0 text-opacity-20 dark:text-opacity-20 cursor-not-allowed border-red-500 hover:bg-gray'>
            {MATERIAL.find((x) => x.value === data?.material)?.label}
          </div>
        </div>
        <div className='flex justify-between font-medium text-lg mt-2'>
          <label htmlFor=''>
            <span className='ml-1 font-semibold'>Kích thước</span>
          </label>
        </div>
        <div className='grid grid-cols-3 gap-2 mt-1'>
          <div className='relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center text-xs uppercase font-semibold select-none overflow-hidden border-2 z-0 text-opacity-20 dark:text-opacity-20 cursor-not-allowed border-red-500 hover:bg-gray'>
            {data?.size}
          </div>
        </div>
      </div>
    )
  }

  const renderStatus = () => {
    const CLASSES =
      'absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300'
    if (data?.is_new) {
      return (
        <div className={CLASSES}>
          <SparklesIcon className='w-3.5 h-3.5' />
          <span className='ml-1 leading-none'>{status}</span>
        </div>
      )
    }
    if (data?.discount) {
      return (
        <div className={CLASSES}>
          <IconDiscount className='w-3.5 h-3.5' />
          <span className='ml-1 leading-none'>{status}</span>
        </div>
      )
    }
    if (data?.quantity == 0) {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className='w-3.5 h-3.5' />
          <span className='ml-1 leading-none'>{status}</span>
        </div>
      )
    }
    if (data?.is_hot_deal) {
      return (
        <div className={CLASSES}>
          <ClockIcon className='w-3.5 h-3.5' />
          <span className='ml-1 leading-none'>{status}</span>
        </div>
      )
    }
    return null
  }

  const renderSectionContent = () => {
    return (
      <div className='space-y-8'>
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className='text-2xl 2xl:text-3xl font-semibold'>
            <Link to='/product-detail'>{data?.name}</Link>
          </h2>

          <div className='flex items-center mt-5 space-x-4 sm:space-x-5'>
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <Prices
              contentClass='py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold'
              price_sale={data?.price_sale}
              price={data?.price}
            />

            <div className='h-6 border-l border-slate-300 dark:border-slate-700'></div>

            <div className='flex items-center'>
              <a href='#reviews' className='flex items-center text-sm font-medium'>
                <StarIcon className='w-5 h-5 pb-[1px] text-yellow-400' />
                <div className='ml-1.5 flex'>
                  <span>4.9</span>
                  <span className='block mx-2'>·</span>
                  <span className='text-slate-600 dark:text-slate-400 underline'>{data?.total_review} lượt xem</span>
                </div>
              </a>
              <span className='hidden sm:block mx-2.5'>·</span>
              <div className='hidden sm:flex items-center text-sm'>
                <SparklesIcon className='w-3.5 h-3.5' />
                <span className='ml-1 leading-none'>{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        <div className=''>{renderVariants()}</div>

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className='flex space-x-3.5'>
          <div className='flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full'>
            <NcInputNumber defaultValue={qualitySelected} onChange={setQualitySelected} />
          </div>
          <ButtonPrimary className='flex-1 flex-shrink-0' onClick={notifyAddTocart}>
            <BagIcon className='hidden sm:inline-block w-5 h-5 mb-0.5' />
            <span className='ml-3'>Thêm vào giỏ hàngs</span>
          </ButtonPrimary>
        </div>

        {/*  */}
        <hr className=' border-slate-200 dark:border-slate-700'></hr>
        {/*  */}

        <div className='text-center'>
          <Link className='text-primary-6000 hover:text-primary-500 font-medium' to={`/product-detail/${data?.slug}`}>
            Xem mô tả chi tiết
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`nc-ProductQuickView2 ${className}`}>
      {/* MAIn */}
      <div className='lg:flex'>
        {/* CONTENT */}
        <div className='w-full lg:w-[50%] '>
          {/* HEADING */}
          <div className='relative'>
            <div className='aspect-w-1 aspect-h-1'>
              <img src={data?.thumbnail} className='w-full rounded-xl object-cover' alt='product detail 1' />
            </div>

            {/* STATUS */}
            {renderStatus()}
            {/* META FAVORITES */}
            <LikeButton className='absolute right-3 top-3 ' />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className='w-full lg:w-[50%] pt-6 lg:pt-0 lg:pl-7 xl:pl-10'>{renderSectionContent()}</div>
      </div>
    </div>
  )
}

export default ProductQuickView2
