import type { TableProps } from 'antd'
import { Button, Flex, Input, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ErrorLoad from '../../components/util/ErrorLoad'
import { blogActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { IBlog } from '@/common/types.interface'
import { RootState } from '@/app/store'
import { typeOptions } from '@/common/constants'
import { EyeOutlined, StarOutlined, UnorderedListOutlined } from '@ant-design/icons'

export default function ListBlog() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const [active, setActive] = useState('')
  const [isHot, setIsHot] = useState('')
  const blogs = useSelector((state: RootState) => state.blog)

  useEffect(() => {
    dispatch(blogActions.getAdminBlogs(active, searchValue, isHot) as unknown as AnyAction)
  }, [active, dispatch, isHot, searchValue])

  const handlerDistableBlog = async (id: string) => {
    try {
      dispatch(blogActions.deleteBlog(id) as unknown as AnyAction)
      dispatch(blogActions.getAdminBlogs(active, searchValue, isHot) as unknown as AnyAction)
      message.success('Vô hiệu hoá bài viết thành công!')
    } catch (error) {
      message.error('Vô hiệu hoá bài viết thất bại!')
    }
  }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue)
    }
  }

  const columns: TableProps<IBlog>['columns'] = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      width: 40,
      align: 'center'
    },
    {
      title: 'Tên bài viết',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width: 140,
      render: (text) => <a title={text}>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</a>
    },
    {
      title: 'Loại bài viết',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 120,
      render: (text) => {
        const matched = typeOptions.find((opt) => opt.value === text)
        return <>{matched ? matched.label : 'Không có'}</>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 100,
      render: (status) => {
        const color = !status ? 'volcano' : 'green'
        const text = !status ? 'Không Hoạt động' : 'Đang hoạt động'

        return <Tag color={color}>{text.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (record) => (
        <Space size={'middle'}>
          <Link to={`/bai-viet/${record.slug}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={'' + record.id + `?status=${active}&isHot=${isHot}&search=${searchValue}`}>
            <Button type='primary'>Sửa </Button>
          </Link>
          <Popconfirm
            placement='topRight'
            title={record.active == 1 ? 'Are you sure distable this Blog?' : 'Are you sure enable this Blog?'}
            onConfirm={() => handlerDistableBlog(record.id)}
            onCancel={() => {}}
            okText='Đồng ý'
            cancelText='Hủy bỏ'
          >
            <Button type='primary' danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  if (blogs.error_message) {
    return <ErrorLoad />
  }

  return (
    <>
      <div className='flex items-center justify-between my-2'>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Danh sách bài viết
        </Typography.Title>
      </div>
      <div className=''>
        <Flex wrap='wrap' gap='small' className='my-5' align='center' justify='space-between'>
          <div className='flex items-center'>
            <Input
              className='header-search w-[250px]'
              prefix={
                <div className=' px-2'>
                  <SearchRoundedIcon />
                </div>
              }
              value={searchValue}
              spellCheck={false}
              allowClear
              onChange={handleChangeSearch}
              size='small'
              placeholder={'Tìm kiếm'}
              style={{
                borderRadius: '2rem'
              }}
            />
            <Select className='ml-2 w-40' onChange={(value) => setActive(value)} value={active} size='large'>
              <Select.Option value=''>Trạng Thái</Select.Option>
              <Select.Option value='active'>Hoạt Động</Select.Option>
              <Select.Option value='inactive'>Không Hoạt Động</Select.Option>
            </Select>
            <Button
              size='large'
              type='default'
              className={`ml-2 ${
                isHot == '1'
                  ? 'bg-yellow-400 text-white hover:bg-yellow-500' // khi bật (true)
                  : 'text-gray-700 hover:bg-gray-300' // khi tắt (false)
              }`}
              onClick={() => {
                setIsHot(isHot == '' || isHot == '0' ? '1' : '0')
              }}
            >
              <StarOutlined /> Bài viết mới nhất
            </Button>
            <Button
              size='large'
              type='default'
              className='ml-2'
              onClick={() => {
                setSearchValue('')
                setActive('')
                setIsHot('')
              }}
            >
              <UnorderedListOutlined /> Tất Cả
            </Button>
          </div>
          <Link to='add'>
            <Button type='primary'>Thêm bài viết</Button>
          </Link>
        </Flex>
        <Table
          style={{
            border: '2px',
            borderRadius: '10px',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem',
            height: '100%'
          }}
          columns={columns}
          sticky={{ offsetHeader: 0 }}
          scroll={{ x: 1200 }}
          dataSource={blogs?.dataList?.map((Blog: IBlog, index: number) => ({
            ...Blog,
            key: index + 1
          }))}
          loading={blogs.isLoading}
        />
      </div>
    </>
  )
}
