import styles from './styles.module.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TabCategory from '../components/TabCategory'
import { courseActions, categoryActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { IProduct } from '@/common/types.interface'
import { getImageUrl } from '@/utils/getImageUrl'

function CategoryDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [coursesPerPage] = useState(6)

  // Get data from Redux store
  const { dataList: courses, isLoading: coursesLoading } = useSelector((state: RootState) => state.course)
  const { data: category, isLoading: categoryLoading } = useSelector((state: RootState) => state.category)

  // Fetch category and courses when component mounts
  useEffect(() => {
    if (slug) {
      dispatch(categoryActions.getCategoryBySlug(slug) as unknown as AnyAction)
    }
  }, [slug])

  // Fetch courses when category is loaded
  useEffect(() => {
    if (category && category.id) {
      dispatch(courseActions.getCoursesByCategory(category.id) as unknown as AnyAction)
    }
  }, [category])

  // Handle course item click
  const handleCourseClick = (course: IProduct) => {
    navigate(`/chi-tiet-khoa-hoc/${course.slug}`)
  }

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = courses ? courses.slice(indexOfFirstCourse, indexOfLastCourse) : []
  const totalPages = courses ? Math.ceil(courses.length / coursesPerPage) : 0

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers
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
  // Show loading if category is still loading
  if (categoryLoading) {
    return (
      <div className={styles.bg}>
        <div className={styles.categoryDetailPage}>
          <div className={styles.loading}>Loading category...</div>
        </div>
      </div>
    )
  }

  // Show error if Danh mục không tồn tại
  if (!category) {
    return (
      <div className={styles.bg}>
        <div className={styles.categoryDetailPage}>
          <div className={styles.noCourses}>Danh mục không tồn tại</div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-gray-100 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Nội dung chính bên trái */}
          <div className='flex-1 bg-white rounded-lg shadow-md p-6'>
            <div>
              <div className='text-xl font-semibold text-indigo-600 mb-2'>Khóa học - {category.name}</div>
              <p className='text-gray-700 mb-6 text-base'>{category.description}</p>
            </div>

            <div>
              {coursesLoading ? (
                <div className='text-center text-gray-500'>Đang tải khóa học...</div>
              ) : currentCourses && currentCourses.length > 0 ? (
                <>
                  <div className='flex flex-col gap-6 mb-6'>
                    {currentCourses.map((course) => {
                      const stripHtml = (html) => {
                        const tmp = document.createElement('div')
                        tmp.innerHTML = html
                        return tmp.textContent || tmp.innerText || ''
                      }

                      const shortDescription = stripHtml(course.description).slice(0, 200) + '...'
                      return (
                        <div
                          key={course.id}
                          onClick={() => handleCourseClick(course)}
                          className='cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm p-4 transition flex items-center space-x-4'
                        >
                          <img
                            src={getImageUrl(course.imageUrl)}
                            alt={course.name}
                            className='w-100 h-40 object-cover rounded-md flex-shrink-0'
                          />
                          <div>
                            <div className='text-sm text-indigo-500 font-medium'>{category.name}</div>
                            <div className='text-lg font-semibold text-gray-800'>{course.name}</div>
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
                <div className='text-center text-gray-500'>Không tìm thấy khóa học nào trong danh mục này</div>
              )}
            </div>
          </div>

          <TabCategory />
        </div>
      </div>
    </div>
  )
}

export default CategoryDetailPage
