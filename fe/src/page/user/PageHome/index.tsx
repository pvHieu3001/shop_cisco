import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'
import { courseActions } from '@/app/actions/course.actions'
import { useNavigate, useOutletContext } from 'react-router-dom'
import TabCategory from '../components/TabCategory'
import { RootState } from '@/app/store'
import { ContextType, IProduct } from '@/common/types.interface'
import Description from './Description'
import Link from 'antd/es/typography/Link'
import { getImageUrl } from '@/utils/getImageUrl'

function PageHome() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { setIsShowRecommendCourses } = useOutletContext<ContextType>()
  setIsShowRecommendCourses(true)

  const { quickViews, isLoading, error_message } = useSelector((state: RootState) => state.course)

  useEffect(() => {
    dispatch(courseActions.getQuickViewCourses() as unknown as AnyAction)
  }, [dispatch])

  const handleDetail = (slug: string) => {
    navigate(`/chi-tiet-khoa-hoc/${slug}`)
  }

  return (
    <div className='bg-gray-100 min-h-screen pb-16'>
      <main className='flex flex-col lg:flex-row gap-6 max-w-[1300px] mx-auto px-5 py-6 bg-white'>
        <section className='w-full lg:w-[80%]' aria-label='Course listings'>
          {isLoading && <p>Đang tải khóa học...</p>}
          {!isLoading && error_message && (
            <p className='text-red-500 font-medium'>Đã xảy ra lỗi khi tải khóa học. Vui lòng thử lại sau.</p>
          )}
          {!isLoading && !error_message && quickViews?.length === 0 && (
            <p className='text-gray-600'>Không tìm thấy khóa học phù hợp.</p>
          )}
          {!isLoading && !error_message && (
            <>
              {quickViews?.map((item) => (
                <div key={item.category.id} className='mb-10'>
                  <h2 className='text-xl font-bold text-gray-800 mb-4'>Loại khóa học: {item.category.name}</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {item.listCourse?.map((course: IProduct) => (
                      <article
                        key={course.id}
                        role='button'
                        tabIndex={0}
                        onClick={() => handleDetail(course.slug)}
                        onKeyDown={(e) => e.key === 'Enter' && handleDetail(course.slug)}
                        className='bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer hover:shadow-lg transition'
                      >
                        <img
                          src={getImageUrl(course.imageUrl)}
                          alt={`${course.name} course image`}
                          loading='lazy'
                          className='w-full aspect-video object-cover rounded-md mb-4'
                        />
                        <Link className='text-blue-600 text-xs font-semibold uppercase mb-1 hover:underline'>
                          {course.category?.name}
                        </Link>
                        <h3 className='text-base font-semibold text-gray-800 hover:text-blue-600 transition'>
                          {course.name}
                        </h3>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        <TabCategory />
      </main>

      {/* PHẦN GIỚI THIỆU */}
      <Description />
    </div>
  )
}

export default PageHome
