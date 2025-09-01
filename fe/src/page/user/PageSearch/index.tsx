import { useEffect } from 'react'
import styles from './styles.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'
import { courseActions } from '@/app/actions/course.actions'
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

  const { dataList, isLoading, error_message } = useSelector((state: RootState) => state.course)

  useEffect(() => {
    dispatch(courseActions.getCourses('active', search, '') as unknown as AnyAction)
  }, [search])

  const handleDetail = (slug: string) => {
    const course = dataList.find((c: IProduct) => c.slug === slug)
    if (course) {
      navigate(`/chi-tiet-khoa-hoc/${slug}`, { state: course })
    }
  }

  return (
    <div className={styles.bg}>
      <main className={styles.mainContent} role='main'>
        <section className={styles.coursesWrapper} aria-label='Course listings'>
          <h2 className={styles.courseListTitle}>Kết quả tìm kiếm</h2>
          <div className={styles.courses}>
            {isLoading && <p>Đang tải khóa học...</p>}
            {!isLoading && error_message && (
              <p className={styles.error}>Đã xảy ra lỗi khi tải khóa học. Vui lòng thử lại sau.</p>
            )}
            {!isLoading && !error_message && dataList?.length === 0 && <p>Không tìm thấy khóa học phù hợp.</p>}
            {!isLoading &&
              !error_message &&
              dataList?.map((course: IProduct) => (
                <article
                  className={styles.courseCard}
                  key={course.id}
                  role='button'
                  tabIndex={0}
                  onClick={() => handleDetail(course.slug)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDetail(course.slug)}
                >
                  <img src={getImageUrl(course.imageUrl)} alt={`${course.name} course image`} loading='lazy' />
                  <Link className={styles.courseCat}>{course.category?.name}</Link>
                  <h3 className={styles.courseTitle}>{course.name}</h3>
                </article>
              ))}
          </div>
          <div className={styles.breaker}></div>
        </section>
        <TabCategory />
      </main>
    </div>
  )
}

export default PageSearch
