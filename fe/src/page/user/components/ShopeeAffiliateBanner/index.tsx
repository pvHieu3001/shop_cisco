type ShopeeBannerProps = {
  link: string
  imageUrl: string
  alt?: string
  width?: string | number
  height?: string | number
}

const ShopeeAffiliateBanner = ({
  link,
  imageUrl,
  alt = 'Shopee Banner',
  width = '100%',
  height = 'auto'
}: ShopeeBannerProps) => {
  return (
    <a href={link} target='_blank' rel='noopener noreferrer'>
      <img src={imageUrl} alt={alt} style={{ width, height }} />
    </a>
  )
}

export default ShopeeAffiliateBanner
