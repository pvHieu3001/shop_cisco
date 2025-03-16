import { VND } from '@/utils/formatVietNamCurrency'
import React, { FC } from 'react'

export interface PricesProps {
  className?: string
  price: number
  price_sale: number
  contentClass?: string
}

const Prices: FC<PricesProps> = ({
  className = '',
  price,
  price_sale,
  contentClass = 'py-1 px-2 md:py-1.5 md:px-2.5 text-lg font-medium'
}) => {
  return (
    <div className={`${className}`}>
      <div className={`flex items-center rounded-lg ${contentClass}`}>
        <p className='text-red-500 font-bold !leading-none'>{VND(price)}/Bộ</p>
      </div>
      {+price_sale && +price_sale > +price && (
        <div className={`flex items-center rounded-lg ${contentClass}`}>
          <p className='text-gray-500 font-bold line-through !leading-none'>{VND(price_sale)}</p>
        </div>
      )}
    </div>
  )
}

export default Prices
