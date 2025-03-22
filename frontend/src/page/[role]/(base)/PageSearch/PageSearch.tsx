import { FC, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Pagination from '../shared/Pagination/Pagination'
import HeaderFilterSearchPage from '../components/HeaderFilterSearchPage'
import Input from '../shared/Input/Input'
import ButtonCircle from '../shared/Button/ButtonCircle'
import ProductCard from '../components/ProductCard'
import { useSearchParams } from 'react-router-dom'
import { useSearchProductMutation } from '@/services/ProductsEndpoints'

export interface PageSearchProps {
  className?: string
}

const PageSearch: FC<PageSearchProps> = ({ className = '' }) => {
  const [data, setData] = useState<any>([])
  const [filterType, setFilterType] = useState<any>()
  const [filterPrice, setFilterPrice] = useState<any>([])
  const [filterSale, setFilterSale] = useState<any>()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(searchParams.get('page'))
  const [keyword, setKeyword] = useState(searchParams.get('keyword'))
  const [searchProduct] = useSearchProductMutation()

  useEffect(() => {
    search()
  }, [page, keyword])

  async function search() {
    const response = await searchProduct({
      page: page,
      keyword: keyword
    }).unwrap()
    setData(response.data)
  }

  return (
    <div className={`nc-PageSearch  ${className}`} data-nc-id='PageSearch'>
      <Helmet>
        <title>Tìm Kiếm || Đồ Gỗ Hiệp Hồng</title>
        <meta name='google-site-verification' content='T9IaRbRYVAYLaOMteD3gLMso6FUu62Kkyu7ORBpDrqw' />
      </Helmet>

      <div
        className={`nc-HeadBackgroundCommon h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20 `}
        data-nc-id='HeadBackgroundCommon'
      />
      <div className='container'>
        <header className='max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7'>
          <form
            className='relative w-full'
            onSubmit={(e) => {
              e.preventDefault()
              setKeyword(e.target.keyword.value)
            }}
          >
            <label htmlFor='search-input' className='text-neutral-500 dark:text-neutral-300'>
              <span className='sr-only'>Search all icons</span>
              <Input
                className='shadow-lg border-0 dark:border'
                id='search-input'
                name='keyword'
                type='search'
                placeholder='Nhập từ khóa'
                sizeClass='pl-14 py-5 pr-5 md:pl-16'
                rounded='rounded-full'
              />
              <ButtonCircle
                className='absolute right-2.5 top-1/2 transform -translate-y-1/2'
                size=' w-11 h-11'
                type='submit'
              >
                <i className='las la-arrow-right text-xl'></i>
              </ButtonCircle>
              <span className='absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6'>
                <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M22 22L20 20'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
            </label>
          </form>
        </header>
      </div>

      <div className='container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28'>
        <main>
          {/* FILTER */}
          <HeaderFilterSearchPage
            setFilterPrice={(price) => {
              setFilterPrice(price)
            }}
            setFilterSale={(sale) => {
              setFilterSale(sale)
            }}
            setFilterType={(type) => {
              setFilterType(type)
            }}
          />

          {/* LOOP ITEMS */}
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10'>
            {data.data?.map((item, index) => (
              <ProductCard data={item} key={index} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className='flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center'>
            <Pagination
              onChangePage={(keyword, page) => {
                setKeyword(keyword)
                setPage(page)
              }}
              dataLinks={data?.links}
            />
          </div>
        </main>

        {/* === SECTION 5 === */}
        {/* <hr className='border-slate-200 dark:border-slate-700' />
        <SectionSliderCollections />
        <hr className='border-slate-200 dark:border-slate-700' /> */}

        {/* SUBCRIBES */}
        {/* <SectionPromo1 /> */}
      </div>
    </div>
  )
}

export default PageSearch
