import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'
import { categoryActions } from '@/app/actions'
import { useNavigate } from 'react-router-dom'
import { RootState } from '@/app/store'
import { ICategory } from '@/common/types.interface'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

function TabCategory() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const categories = useSelector((state: RootState) => state.category)
  const hasLoaded = useRef(false)
  const [keyword, setKeyword] = useState('')
  const router = useNavigate()

  useEffect(() => {
    if (!hasLoaded.current && !categories.isLoading && (!categories.dataList || categories.dataList.length === 0)) {
      hasLoaded.current = true
      dispatch(categoryActions.getCategories('') as unknown as AnyAction)
    }
  }, [])

  const handleCategoryDetail = (slug: string) => {
    const category = categories.dataList.find((c: ICategory) => c.slug === slug)
    if (!category) return
    navigate(`/khoa-hoc-theo-chu-de/${slug}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    if (e) e.preventDefault()
    router(`/tim-kiem?search=${encodeURIComponent(keyword)}`)
  }

  return (
    <aside className='w-full lg:w-[20%] bg-white p-6 rounded-lg shadow-md space-y-8' role='complementary'>
      {/* Tìm kiếm */}
      <div>
        <h2 className='text-lg font-semibold text-gray-800 mb-3'>Tìm kiếm khóa học</h2>
        <form
          onSubmit={handleSearch}
          className='flex rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500'
        >
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Nhập từ khóa...'
            aria-label='Search for courses'
            suffix={
              <SearchOutlined
                onClick={handleSearch}
                style={{ color: '#1890ff', cursor: 'pointer' }}
                aria-label='Tìm kiếm'
              />
            }
            className='py-1 px-4'
          />
        </form>
      </div>

      {/* Loại khóa học */}
      <div>
        <h2 className='text-lg font-semibold text-gray-800 mb-3'>Loại khóa học</h2>
        <ul className='space-y-2' role='list'>
          {categories?.dataList?.map((category: ICategory, index: number) => (
            <li
              key={index}
              role='button'
              tabIndex={0}
              onClick={() => handleCategoryDetail(category.slug)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCategoryDetail(category.slug)
                }
              }}
              className='flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <span className='text-gray-700 font-medium text-base'>{category.name}</span>
              <span className='text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full border'>
                {category.numberCourse}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default TabCategory
