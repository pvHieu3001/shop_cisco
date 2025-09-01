import { useEffect, useState } from 'react'
import { Button, Flex, Input, Popconfirm, Select, Space, Table, TableProps, Tag, Typography, message } from 'antd'
import { Link } from 'react-router-dom'
import { AnyAction } from '@reduxjs/toolkit'
import { courseActions } from '@/app/actions/course.actions'
import { useDispatch, useSelector } from 'react-redux'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { RootState } from '@/app/store'
import { IProduct } from '@/common/types.interface'
import { EyeOutlined, UnorderedListOutlined, StarOutlined } from '@ant-design/icons'

export default function ListProduct() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const [active, setActive] = useState('')
  const [isHot, setIsHot] = useState('') // blank: all, 0: false, 1: true
  const [dataTable, setDataTable] = useState<(IProduct & { key: number })[]>([])

  const courses = useSelector((state: RootState) => state.course)

  useEffect(() => {
    dispatch(courseActions.getAdminCourses(active, searchValue, isHot) as unknown as AnyAction)
  }, [searchValue, active, isHot, dispatch])

  useEffect(() => {
    setDataTable(courses.dataList?.map((item: IProduct, index: number) => ({ ...item, key: index + 1 })))
  }, [courses])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue)
    }
  }

  const handlerDeleteProduct = async (id: string) => {
    try {
      dispatch(courseActions.deleteCourse(id) as unknown as AnyAction)
      message.success('Xoá khóa học thành công!')
    } catch (error) {
      message.error('Xoá khóa học thất bại!')
    }
  }

  const columns: TableProps<IProduct>['columns'] = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      width: 40,
      align: 'center'
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 180,
      render: (text: string) => (
        <span className='block max-w-[160px] truncate text-ellipsis overflow-hidden whitespace-nowrap' title={text}>
          {text}
        </span>
      )
    },
    {
      title: 'Loại khóa học',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      width: 180,
      render: (_text: string, record: IProduct) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            record.category?.name ? 'text-gray-800' : 'text-purple-800'
          }`}
        >
          {record.category?.name || '_'}
        </span>
      )
    },
    {
      title: 'Độ khó',
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      width: 250,
      render: (level: string) => {
        let color = ''
        switch (level?.toLowerCase()) {
          case 'beginner':
            color = 'green'
            break
          case 'intermediate':
            color = 'orange'
            break
          case 'advanced':
            color = 'red'
            break
          default:
            color = 'blue'
        }
        return <Tag color={color}>{level}</Tag>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 250,
      render: (status: string) => {
        const statusClass =
          status == 'active'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-gray-100 text-gray-700 border border-gray-300'

        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
            {status == 'active' ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        )
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (record: IProduct) => (
        <Space size={'middle'}>
          <Link to={`/chi-tiet-khoa-hoc/${record.slug}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={'' + record.id + `?status=${active}&isHot=${isHot}&search=${searchValue}`}>
            <Button type='primary'>Sửa</Button>
          </Link>
          <Popconfirm
            placement='topRight'
            title={'Bạn có chắc muốn xoá khóa học này?'}
            onConfirm={() => handlerDeleteProduct(record.id)}
            onCancel={() => {}}
            okText='Đồng ý'
            cancelText='Huỷ bỏ'
          >
            <Button type='primary' danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <>
      <div className='flex items-center justify-between my-2'>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Danh sách khóa học
        </Typography.Title>
      </div>
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
            style={{ borderRadius: '2rem' }}
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
            <StarOutlined /> Được yêu thích
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

        <Link to={`add?status=${active}&isHot=${isHot}&search=${searchValue}`}>
          <Button type='primary'>Thêm khóa học</Button>
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
        dataSource={dataTable}
        loading={courses.isLoading}
      />
    </>
  )
}
