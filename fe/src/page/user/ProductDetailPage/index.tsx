import { useNavigate, useParams } from 'react-router-dom'
import TabCategory from '../components/TabCategory'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { courseActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { IProduct } from '@/common/types.interface'
import { getImageUrl } from '@/utils/getImageUrl'

function ProductDetailPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { dataList: relatedCourses, data: course } = useSelector((state: RootState) => state.course)
  const navigate = useNavigate()

  useEffect(() => {
    if (slug) {
      dispatch(courseActions.resetCourse() as unknown as AnyAction)
      dispatch(courseActions.getCourseBySlug(slug) as unknown as AnyAction)
    }
  }, [slug])

  useEffect(() => {
    if (course && course.category?.id) {
      dispatch(courseActions.getCoursesByCategory(course.category.id) as unknown as AnyAction)
    }
  }, [course])

  const handleDetail = (courseRelate: IProduct) => {
    navigate(`/chi-tiet-khoa-hoc/${courseRelate.slug}`)
  }

  return (
    <div className='max-w-7xl mx-auto mt-8 px-4 flex flex-col lg:flex-row gap-8'>
      <div className='lg:w-[80%] w-full'>
        {course ? (
          <>
            <header className='mt-8'>
              <p className='text-sm uppercase tracking-wide text-blue-500'>
                {course.category?.name || 'Danh mục chưa xác định'}
              </p>
              <h1 className='text-3xl font-bold mt-2'>{course.name || 'Tên khóa học chưa có'}</h1>
            </header>

            <section className='mt-8'>
              <img
                src={getImageUrl(course.imageUrl)}
                alt={course.name || 'Ảnh khóa học'}
                className='rounded-lg shadow-md w-full max-w-sm h-48 object-cover'
              />
            </section>

            <section className='mt-10'>
              <h2 className='text-2xl font-semibold mb-4'>Nội Dung Bạn Sẽ Được Đào Tạo</h2>
              {course.content ? (
                <div
                  className='text-xl leading-8 text-gray-800 
                [&_p]:mb-4 
                [&_p]:text-xl
                [&_h1]:text-4xl 
                [&_h2]:text-3xl 
                [&_h3]:text-2xl 
                [&_ul]:list-disc 
                [&_ul]:pl-6 
                [&_a]:text-blue-600 [&_a:hover]:underline'
                  dangerouslySetInnerHTML={{ __html: course.content }}
                />
              ) : (
                <p className='text-gray-500 italic'>Nội dung đang được cập nhật.</p>
              )}
            </section>

            <section className='mt-10'>
              <h2 className='text-2xl font-semibold mb-4'>Giới Thiệu Khóa Học</h2>
              {course.description ? (
                <div
                  className='text-xl leading-8 text-gray-800 
                [&_p]:mb-4
                [&_p]:text-xl
                [&_h1]:text-4xl 
                [&_h2]:text-3xl 
                [&_h3]:text-2xl 
                [&_ul]:list-disc 
                [&_ul]:pl-6 
                [&_a]:text-blue-600 [&_a:hover]:underline'
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              ) : (
                <p className='text-gray-500 italic'>Chưa có mô tả khóa học.</p>
              )}
            </section>

            <section className='mt-10'>
              <h2 className='text-xl font-semibold mb-4'>Lý Do Bạn Nên Chọn Khóa Học Này</h2>
              {course.courseBenefits ? (
                <div
                  className='text-xl leading-8 text-gray-800 
                [&_p]:mb-4 
                [&_p]:text-xl
                [&_h1]:text-4xl 
                [&_h2]:text-3xl 
                [&_h3]:text-2xl 
                [&_ul]:list-disc 
                [&_ul]:pl-6 
                [&_a]:text-blue-600 [&_a:hover]:underline'
                  dangerouslySetInnerHTML={{ __html: course.courseBenefits }}
                />
              ) : (
                <p className='text-gray-500 italic'>Thông tin lợi ích chưa được cập nhật.</p>
              )}
            </section>

            <section className='mt-10 text-center'>
              {course.sourceUrl ? (
                <a
                  href={course.sourceUrl}
                  download
                  target='_blank'
                  className='inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition'
                >
                  Tải Xuống
                </a>
              ) : (
                <p className='text-gray-400 italic'>Tài liệu chưa sẵn sàng để tải.</p>
              )}
            </section>

            <section className='max-w-7xl mx-auto mt-16 px-4'>
              <h2 className='text-lg font-semibold bg-gray-100 text-gray-800 inline-block px-4 py-2 rounded-t-md shadow'>
                Bạn Cũng Có Thể Thích
              </h2>
              <div className='border-t border-gray-300 mt-2 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {relatedCourses && relatedCourses.length > 0 ? (
                  relatedCourses.slice(0, 3).map((related, index) => (
                    <div
                      key={index}
                      onClick={() => handleDetail(related)}
                      className='relative group rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl'
                      style={{
                        backgroundImage: `url(${
                          related.imageUrl ? getImageUrl(related.imageUrl) : '/default-image.jpg'
                        })`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '220px'
                      }}
                    >
                      <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10' />
                      <div className='absolute inset-0 z-20 flex flex-col justify-between p-4 text-white'>
                        <span className='bg-sky-500 text-[10px] font-semibold px-2 py-1 rounded uppercase self-start'>
                          {related.category?.name || 'Chưa xác định'}
                        </span>
                        <h3 className='text-sm sm:text-base font-semibold leading-snug line-clamp-2'>
                          {related.name || 'Tên khóa học chưa có'}
                        </h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-500 col-span-full italic'>Chưa có khóa học liên quan.</p>
                )}
              </div>
            </section>

            <section className='max-w-4xl mx-auto mt-10 px-4 text-center'></section>
          </>
        ) : (
          <div className='text-center py-12 text-gray-500'>Không tìm thấy thông tin khóa học.</div>
        )}
      </div>

      <TabCategory />
    </div>
  )
}

export default ProductDetailPage
