import { useEffect, useRef, useState } from 'react'
import { MenuOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { courseActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { IProduct } from '@/common/types.interface'
import { getImageUrl } from '@/utils/getImageUrl'

type Props = {
  isShowRecommendCourses: boolean
}

const Header = (props: Props) => {
  const dispatch = useDispatch()
  const today = new Date()
  const dateStr = today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const location = useLocation()
  const currentPath = location.pathname
  const [menuOpen, setMenuOpen] = useState(false)
  const courses = useSelector((state: RootState) => state.course)
  const navigate = useNavigate()
  const router = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(courseActions.getRecommendCourses() as unknown as AnyAction)
  }, [dispatch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const menuItems = [
    { label: 'TRANG CHỦ', href: '/' },
    { label: 'KHÓA HỌC', href: '/tat-ca-khoa-hoc' },
    { label: 'CÔNG NGHỆ', href: '/san-pham-cong-nghe' },
    { label: 'GAME', href: '/game' },
    { label: 'TIỆN ÍCH', href: '/thu-thuat-huu-ich' },
    { label: 'SƯU TẦM', href: '/suu-tam' }
  ]

  const handleDetail = (course: IProduct) => {
    navigate(`/chi-tiet-khoa-hoc/${course.slug}`)
  }

  const handleSearch = (keyword: string) => {
    router(`?search=${encodeURIComponent(keyword)}`)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch((e.target as HTMLInputElement).value)
      setMenuOpen(false) // Đóng menu sau khi tìm kiếm
    }
  }

  return (
    <div className='bg-gray-100 w-full'>
      {/* Topbar */}
      <div className='block sm:hidden bg-[#181818] text-white h-9 flex items-center justify-end px-5 text-sm'>
        {/* Toggle button for mobile */}
        <button
          className='absolute left-2 top-2 z-50 bg-transparent border-none'
          aria-label='Mở menu'
          onClick={() => setMenuOpen(true)}
        >
          <MenuOutlined style={{ fontSize: 24, color: '#fff' }} />
        </button>
        <span className='opacity-80'>{dateStr}</span>
      </div>

      {/* Banner */}
      <div className='w-full flex justify-center items-center bg-[#061d51]'>
        <header className='max-w-[1300px] w-full flex items-center gap-3 px-2 sm:px-4 py-2'>
          <svg
            width='32'
            height='32'
            viewBox='0 0 120 120'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='flex-shrink-0'
          >
            <rect width='120' height='120' rx='24' fill='#2563eb' />
            <path d='M30 80V40L60 25L90 40V80L60 95L30 80Z' fill='#fff' />
            <path d='M60 25V95' stroke='#2563eb' strokeWidth='4' />
            <text x='60' y='70' textAnchor='middle' fill='#2563eb' fontSize='32' fontFamily='Arial' fontWeight='bold'>
              EDU
            </text>
          </svg>
          <span className='text-white text-sm sm:text-base font-semibold tracking-wide'>
            HỌC MIỄN PHÍ – CHIA SẺ KIẾN THỨC – NÂNG TẦM BẢN THÂN
          </span>
        </header>
      </div>

      {/* Menu */}
      <div className='w-full bg-[#105ab2] flex justify-center relative'>
        {/* Main menu */}
        <nav className='max-w-[1300px] w-full hidden sm:flex items-center gap-3 h-12 overflow-x-auto whitespace-nowrap'>
          {menuItems.map((item) => {
            const isActive = currentPath === item.href.replace(/\/$/, '')
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`text-white font-semibold text-sm px-2 h-full flex items-center transition ${
                  isActive ? 'bg-white bg-opacity-20' : 'hover:text-gray-800 hover:bg-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Sidebar menu for mobile */}
      {menuOpen && (
        <div
          ref={menuRef}
          className='fixed top-0 left-0 w-[80vw] max-w-[320px] h-screen bg-white shadow-lg z-[9999] p-6 flex flex-col gap-4 animate-slideIn'
        >
          <button
            className='absolute top-3 right-3 bg-transparent border-none'
            aria-label='Đóng menu'
            onClick={() => setMenuOpen(false)}
          >
            <CloseOutlined style={{ fontSize: 24 }} />
          </button>

          <div className='relative w-full mt-10'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
              <SearchOutlined />
            </span>
            <input
              onKeyDown={handleSearchKeyDown}
              type='text'
              placeholder='Tìm kiếm khóa học...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <nav className='mt-4 space-y-2'>
            {menuItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className={`block py-3 text-base border-b border-gray-200 ${
                  currentPath === item.href ? 'text-[#0683d7] font-bold' : 'text-gray-800'
                }`}
                onClick={() => setMenuOpen(false)}
                aria-current={currentPath === item.href ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Slider */}
      {props.isShowRecommendCourses && (
        <div className='w-full flex justify-center items-center'>
          <section
            className='max-w-[1300px] w-full flex items-center gap-2 px-5 py-6 overflow-x-auto'
            role='region'
            aria-label='Featured courses'
          >
            {courses.recommends?.map((course, i) => (
              <div
                key={i}
                onClick={() => handleDetail(course)}
                role='button'
                tabIndex={0}
                className='flex items-center gap-2 max-w-[200px] flex-shrink-0 cursor-pointer'
              >
                <img
                  src={getImageUrl(course.imageUrl)}
                  alt={`${course.name} thumbnail`}
                  className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-md'
                />
                <span className='text-sm text-gray-600 hover:text-black'>{course.name}</span>
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  )
}

export default Header
