import { useEffect } from 'react'
import styles from './styles.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'
import { productActions } from '@/app/actions/product.actions'
import { useNavigate } from 'react-router-dom'
import TabCategory from '../components/TabCategory'
import { RootState } from '@/app/store'
import { IProduct } from '@/common/types.interface'
import { useQuery } from '@/utils/useQuery'
import Link from 'antd/es/typography/Link'
import { getImageUrl } from '@/utils/getImageUrl'

function PageSearch() {
  const query = useQuery()
  const search = query.get('search') || ''
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { dataList, isLoading, error_message } = useSelector((state: RootState) => state.product)

  useEffect(() => {
    dispatch(productActions.getProducts('active', search, '') as unknown as AnyAction)
  }, [search])

  const handleDetail = (slug: string) => {
    const product = dataList.find((c: IProduct) => c.slug === slug)
    if (product) {
      navigate(`/chi-tiet-san-pham/${slug}`, { state: product })
    }
  }

  return (
    <div className={styles.bg}>
      <main className={styles.mainContent} role='main'>
        <section className={styles.productsWrapper} aria-label='Product listings'>
          <h2 className={styles.productListTitle}>Kết quả tìm kiếm</h2>
          <div className={styles.products}>
            {isLoading && <p>Đang tải sản phẩm...</p>}
            {!isLoading && error_message && (
              <p className={styles.error}>Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.</p>
            )}
            {!isLoading && !error_message && dataList?.length === 0 && <p>Không tìm thấy sản phẩm phù hợp.</p>}
            {!isLoading &&
              !error_message &&
              dataList?.map((Product: IProduct) => (
                <article
                  className={styles.productCard}
                  key={Product.id}
                  role='button'
                  tabIndex={0}
                  onClick={() => handleDetail(Product.slug)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDetail(Product.slug)}
                >
                  <img src={getImageUrl(Product.imageUrl)} alt={`${Product.name} Product image`} loading='lazy' />
                  <Link className={styles.productCat}>{Product.category?.name}</Link>
                  <h3 className={styles.productTitle}>{Product.name}</h3>
                </article>
              ))}
          </div>
          <div className={styles.breaker}></div>
        </section>
        <aside
          className='w-full lg:w-[20%] sticky top-4'
          role='complementary'
        >
          <TabCategory />
        </aside>
      </main>
    </div>
  )
}

export default PageSearch
