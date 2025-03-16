import { Transition } from '@headlessui/react'
import Prices from './Prices'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { IProduct } from '@/common/types/product.interface'

interface Props {
  show: boolean
  productImage: string
  qualitySelected: number
  product: IProduct
  name: string
}

const NotifyAddTocart: FC<Props> = ({ show, productImage, qualitySelected, product, name }) => {
  const { price, price_sale } = product

  const renderProductCartOnNotify = () => {
    return (
      <div className='flex '>
        <div className='h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100'>
          <img src={productImage} alt={name} className='h-full w-full object-contain object-center' />
        </div>

        <div className='ml-4 flex flex-1 flex-col'>
          <div>
            <div className='flex justify-between '>
              <div>
                <h3 className='text-base font-medium '>{name}</h3>
              </div>
              <Prices price_sale={price_sale} price={price} className='mt-0.5' />
            </div>
          </div>
          <div className='flex flex-1 items-end justify-between text-sm'>
            <p className='text-gray-500 dark:text-slate-400'>{`Số lượng ${qualitySelected}`}</p>

            <div className='flex'>
              <Link to={'/cart'} className='font-medium text-primary-6000 dark:text-primary-500 '>
                Xem giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Transition
      appear
      show={show}
      className='p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200'
      enter='transition-all duration-150'
      enterFrom='opacity-0 translate-x-20'
      enterTo='opacity-100 translate-x-0'
      leave='transition-all duration-150'
      leaveFrom='opacity-100 translate-x-0'
      leaveTo='opacity-0 translate-x-20'
    >
      <p className='block text-base font-semibold leading-none'>Added to cart!</p>
      <hr className=' border-slate-200 dark:border-slate-700 my-4' />
      {renderProductCartOnNotify()}
    </Transition>
  )
}

export default NotifyAddTocart
