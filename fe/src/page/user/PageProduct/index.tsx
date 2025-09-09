import { useNavigate, useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TabCategory from '../components/TabCategory'
import { productActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { ContextType, IProduct } from '@/common/types.interface'
import { getImageUrl } from '@/utils/getImageUrl'

function PageProduct() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [ProductsPerPage] = useState(6)
  const { dataList: Products, isLoading: ProductsLoading } = useSelector((state: RootState) => state.product)
  const { setIsShowRecommendProducts } = useOutletContext<ContextType>()

  useEffect(() => {
    setIsShowRecommendProducts(true)
  }, [setIsShowRecommendProducts])

  useEffect(() => {
    dispatch(productActions.getProducts('active', '', '') as unknown as AnyAction)
  }, [dispatch])

  // Handle Product item click
  const handleProductClick = (Product: IProduct) => {
    navigate(`/chi-tiet-san-pham/${Product.slug}`)
  }

  const indexOfLastProduct = currentPage * ProductsPerPage
  const indexOfFirstProduct = indexOfLastProduct - ProductsPerPage
  const currentProducts = Products ? Products.slice(indexOfFirstProduct, indexOfLastProduct) : []
  const totalPages = Products ? Math.ceil(Products.length / ProductsPerPage) : 0

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  return (
    <div className='bg-gray-100 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Nội dung chính bên trái */}
          <div className='flex-1 bg-white rounded-lg shadow-md p-6'>
            <div>
              <div className='text-xl font-semibold text-indigo-600 mb-2'>Tất cả sản phẩm</div>
            </div>

            <div>
              {ProductsLoading ? (
                <div className='text-center text-gray-500'>Đang tải sản phẩm...</div>
              ) : currentProducts && currentProducts.length > 0 ? (
                <>
                  <div className='flex flex-col gap-6 mb-6'>
                    {currentProducts.map((Product) => {
                      const stripHtml = (html) => {
                        const tmp = document.createElement('div')
                        tmp.innerHTML = html
                        return tmp.textContent || tmp.innerText || ''
                      }

                      const shortDescription = stripHtml(Product.description).slice(0, 200) + '...'
                      return (
                        <div
                          key={Product.id}
                          onClick={() => handleProductClick(Product)}
                          className='cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm p-4 transition flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4'
                        >
                          <img
                            src={getImageUrl(Product.imageUrl)}
                            alt={Product.name}
                            className='w-full sm:w-100 h-40 object-cover rounded-md flex-shrink-0'
                          />

                          <div className='flex flex-col flex-1'>
                            <div className='text-sm text-indigo-500 font-medium'>{Product.category?.name}</div>
                            <div className='text-lg font-semibold text-gray-800'>{Product.name}</div>
                            <div
                              dangerouslySetInnerHTML={{ __html: shortDescription }}
                              className='text-gray-600 text-base mt-1 [&_p]:mb-4 
                                [&_p]:text-xl
                                [&_h1]:text-4xl 
                                [&_h2]:text-3xl 
                                [&_h3]:text-2xl 
                                [&_ul]:list-disc 
                                [&_ul]:pl-6 
                                [&_a]:text-blue-600 [&_a:hover]:underline'
                            ></div>
                            <div className='mt-auto pt-2'>
                              <a
                                href={`tel:0942819220`}
                                onClick={(e) => e.stopPropagation()}
                                className='mt-2 inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition'
                              >
                                Liên hệ
                              </a>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className='flex justify-center items-center space-x-2'>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50'
                      >
                        Trước
                      </button>

                      {getPageNumbers().map((pageNumber, index) => (
                        <button
                          key={index}
                          onClick={() => (typeof pageNumber === 'number' ? handlePageChange(pageNumber) : null)}
                          disabled={pageNumber === '...'}
                          className={`px-3 py-1 border rounded ${
                            pageNumber === currentPage ? 'bg-indigo-500 text-white' : 'bg-white hover:bg-gray-100'
                          } ${pageNumber === '...' ? 'cursor-default text-gray-400' : ''}`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className='px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50'
                      >
                        Tiếp
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className='text-center text-gray-500'>Không tìm thấy sản phẩm nào trong danh mục này</div>
              )}
            </div>
          </div>

          <TabCategory />
        </div>
      </div>
    </div>
  )
}

export default PageProduct
