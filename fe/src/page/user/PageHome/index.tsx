import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'
import { productActions } from '@/app/actions/product.actions'
import { useNavigate, useOutletContext } from 'react-router-dom'
import TabCategory from '../components/TabCategory'
import { RootState } from '@/app/store'
import { ContextType, IProduct } from '@/common/types.interface'
import Description from './Description'
import Link from 'antd/es/typography/Link'
import { getImageUrl } from '@/utils/getImageUrl'
import { PhoneOutlined } from '@ant-design/icons'

function PageHome() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { setIsShowRecommendProducts } = useOutletContext<ContextType>()
  setIsShowRecommendProducts(true)

  const { quickViews, isLoading, error_message } = useSelector((state: RootState) => state.product)

  useEffect(() => {
    dispatch(productActions.getQuickViewProducts() as unknown as AnyAction)
  }, [dispatch])

  const handleDetail = (slug: string) => {
    navigate(`/chi-tiet-san-pham/${slug}`)
  }

  return (
    <div className='bg-gray-100 min-h-screen pb-16'>
      <main className='flex flex-col lg:flex-row gap-6 max-w-[1300px] mx-auto px-5 py-6 bg-white'>
        <section className='w-full lg:w-[80%]' aria-label='product listings'>
          {isLoading && <p>Đang tải sản phẩm...</p>}
          {!isLoading && error_message && (
            <p className='text-red-500 font-medium'>Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.</p>
          )}
          {!isLoading && !error_message && quickViews?.length === 0 && (
            <p className='text-gray-600'>Không tìm thấy sản phẩm phù hợp.</p>
          )}
          {!isLoading && !error_message && (
            <>
              {quickViews?.map((item) => (
                <div key={item.category.id} className='mb-10'>
                  <h2 className='text-xl font-bold text-gray-800 mb-4'>Loại sản phẩm: {item.category.name}</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {item.listProduct?.map((product: IProduct) => (
                      <article
                        key={product.id}
                        role='button'
                        tabIndex={0}
                        onClick={() => handleDetail(product.slug)}
                        onKeyDown={(e) => e.key === 'Enter' && handleDetail(product.slug)}
                        className='bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer hover:shadow-lg transition'
                      >
                        <img
                          src={getImageUrl(product.imageUrl)}
                          alt={`${product.name} product image`}
                          loading='lazy'
                          className='w-full aspect-video object-cover rounded-md mb-4'
                        />
                        <Link
                          to={`/loai-san-pham/${product.category?.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className='text-blue-600 text-xs font-semibold uppercase mb-1 hover:underline'
                        >
                          {product.category?.name}
                        </Link>
                        <h3 className='text-base font-semibold text-gray-800 hover:text-blue-600 transition line-clamp-2'>
                          {product.name}
                        </h3>
                        <div className='mt-4 pt-4 border-t mt-auto'>
                          <a
                            href={`tel:0942819220`}
                            onClick={(e) => e.stopPropagation()}
                            className='inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition'
                          >
                            <PhoneOutlined />
                            Liên hệ
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        <aside
            className='w-full lg:w-[20%] sticky top-4'
            role='complementary'
          >
            <TabCategory />
          </aside>
      </main>

      {/* PHẦN GIỚI THIỆU */}
      <Description />
    </div>
  )
}

export default PageHome
