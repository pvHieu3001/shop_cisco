import { Button, Flex, Input, Popconfirm, Space, Table, Tag, Typography } from 'antd'
import type { TableProps } from 'antd'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { popupSuccess } from '@/page/shared/Toast'
import { userActions } from '@/app/actions'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'

type User = {
  id: number | string
  username: string
  email: string
  image?: string
  role_id: string
  is_active: number
}

export default function ListUser() {
  const [id, setId] = useState<number | string>()
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()
  const userStore = useSelector((state: RootState) => state.user)
  const { dataList, isLoading } = userStore
  const isDeleting = isLoading

  useEffect(() => {
    dispatch(userActions.getUsers() as unknown as AnyAction)
  }, [dispatch])

  const confirm = async (id: number | string) => {
    setId(id)
    await dispatch(userActions.deleteUser(String(id)) as unknown as AnyAction)
    popupSuccess('Delete user success')
  }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (!value.startsWith(' ')) {
      setSearchValue(value)
    }
  }

  const dataItem =
    Array.isArray(dataList) && dataList.every((i) => typeof i === 'object' && i !== null)
      ? (dataList as User[]).map((item, key) => ({ ...item, key: key + 1 }))
      : []

  const columns: TableProps<User>['columns'] = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      width: 40,
      align: 'center'
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      render: (text) => <a>{text}</a>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center'
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      render: (image) => (image ? <img src={image} alt='' width={60} style={{ borderRadius: 8 }} /> : null)
    },
    {
      title: 'Vai trò',
      key: 'role_id',
      dataIndex: 'role_id',
      align: 'center',
      render: (_, { role_id }) => (
        <Tag color={role_id == '1' ? 'geekblue' : 'green'}>{role_id == '1' ? 'Admin' : 'Guest'}</Tag>
      ),
      filters: [
        { text: 'Admin', value: '1' },
        { text: 'Guest', value: '2' }
      ],
      onFilter: (value, record) => record.role_id.startsWith(value as string),
      filterSearch: true
    },
    {
      title: 'Trạng thái',
      key: 'is_active',
      dataIndex: 'is_active',
      align: 'center',
      render: (_, { is_active }) => (
        <Tag color={is_active == 1 ? 'green' : 'red'}>{is_active == 1 ? 'Đang hoạt động' : 'Không hoạt động'}</Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (data: User) => (
        <Space size='middle'>
          <Link to={'privilege/' + String(data?.id)}>
            <Button danger>Privilege</Button>
          </Link>
          <Link to={String(data?.id)}>
            <Button type='primary'>Sửa</Button>
          </Link>
          <Popconfirm
            disabled={isDeleting}
            title='Xóa người dùng'
            description={`Bạn có chắc muốn xóa "${data.username}"?`}
            onConfirm={() => confirm(String(data.id))}
            okText='Đồng ý'
            cancelText='Hủy bỏ'
          >
            <Button danger loading={isDeleting && data.id == id}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <>
      <div className='flex items-center justify-between my-2'>
        <Typography.Title editable level={2} style={{ margin: 0 }}>
          Danh sách người dùng
        </Typography.Title>
      </div>
      <Flex wrap='wrap' gap='small' className='my-5' align='center' justify='space-between'>
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
        <Link to='add'>
          <Button type='primary'>Thêm người dùng</Button>
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
        dataSource={dataItem.filter((item) =>
          searchValue ? item.username.toLowerCase().includes(searchValue.toLowerCase()) : true
        )}
        loading={isLoading}
      />
    </>
  )
}
