import React, { FC } from 'react'
import HeaderFilterSection from './components/HeaderFilterSection'
import ProductCard from './components/ProductCard'
import { Product } from '../../../data/data'
import { useFilterCatProductQuery, useFilterFeatProductQuery } from '../../../services/ProductsEndpoints'

//
export interface SectionGridFeatureItemsProps {
  data?: Product[]
}

const SectionGridFeatureItems: FC<SectionGridFeatureItemsProps> = () => {
  const [filter, setFilter] = React.useState('is_hot_deal')
  const [price, setFilterPrice] = React.useState<number[]>()
  const { data: dataHot } = useFilterFeatProductQuery('is_hot_deal')
  const { data: dataNew } = useFilterFeatProductQuery('is_new')
  const { data: dataGood } = useFilterCatProductQuery('LIVR')
  const { data: dataHome } = useFilterCatProductQuery('BEDR')

  return (
    <>
      <div className='nc-SectionGridFeatureItems relative'>
        <HeaderFilterSection
          title='Sản phẩm bán chạy'
          setFilterSale={(sale) => setFilter(sale)}
          setFilterPrice={(price) => setFilterPrice(price)}
        />
        <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}>
          {dataHot?.data?.map((item, index) => (
            <ProductCard data={item} key={index} />
          ))}
        </div>
      </div>
      <div className='nc-SectionGridFeatureItems relative'>
        <HeaderFilterSection
          title='Sản phẩm mới'
          setFilterSale={(sale) => setFilter(sale)}
          setFilterPrice={(price) => setFilterPrice(price)}
        />
        <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}>
          {dataNew?.data?.map((item, index) => (
            <ProductCard data={item} key={index} />
          ))}
        </div>
      </div>
      <div className='nc-SectionGridFeatureItems relative'>
        <HeaderFilterSection
          title='Nội Thất Phòng Khách'
          setFilterSale={(sale) => setFilter(sale)}
          setFilterPrice={(price) => setFilterPrice(price)}
        />
        <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}>
          {dataGood?.data?.map((item, index) => (
            <ProductCard data={item} key={index} />
          ))}
        </div>
      </div>
      <div className='nc-SectionGridFeatureItems relative'>
        <HeaderFilterSection
          title='Nội thất phòng ngủ'
          setFilterSale={(sale) => setFilter(sale)}
          setFilterPrice={(price) => setFilterPrice(price)}
        />
        <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}>
          {dataHome?.data?.map((item, index) => (
            <ProductCard data={item} key={index} />
          ))}
        </div>
      </div>
    </>
  )
}

export default SectionGridFeatureItems
