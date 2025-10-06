import ShopeeLogo from '@/assets/images/shopee.png'

type ShopeeBannerProps = {
  link: string
  imageUrl: string
  alt?: string
  width?: string | number
  height?: string | number,
  price?: string,
  originalPrice?: string
}

const ShopeeAffiliateBanner = ({
  link,
  imageUrl,
  alt = 'Shopee Banner',
  width = '100%',
  price = '199.000',
  originalPrice = '599.000'
}: ShopeeBannerProps) => {
  return (
    <a
      href={link}
      target='_blank'
      rel='noopener noreferrer'
      className='group relative flex flex-col overflow-hidden rounded-lg shadow-lg'
      style={{ width: width }}
    >
      <img
        src={imageUrl}
        alt={alt}
        className='w-full object-cover aspect-square transition-transform duration-300 ease-in-out group-hover:scale-105'
      />

      <div 
        className='w-full bg-[#ee4d2d] px-2 py-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1'
      >
        <div className='flex items-center gap-1.5'>
          <img src={ShopeeLogo} alt='Logo Shopee' className='w-4 h-auto' />
          <span className='text-white font-bold text-sm tracking-wide'>Shopee</span>
        </div>

        <div className='flex items-baseline gap-2'>
          <span className='text-white font-bold text-xl sm:text-2xl'>
            {price}<span className='text-sm font-semibold align-super'>đ</span>
          </span>
          <span className='text-gray-200 text-xs sm:text-sm line-through'>{originalPrice}</span>
        </div>
      </div>
    </a>
  )
}

export default ShopeeAffiliateBanner
