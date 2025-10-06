import type { TableProps } from 'antd'
import { Button, Flex, Input, Popconfirm, Space, Table, Tag, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ErrorLoad from '../../components/util/ErrorLoad'
import { affiliateActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { IAffiliate } from '@/common/types.interface'
import { RootState } from '@/app/store'

export default function ListAffiliate() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const affiliates = useSelector((state: RootState) => state.affiliate)

  useEffect(() => {
    dispatch(affiliateActions.getAdminAffiliates(searchValue) as unknown as AnyAction)
  }, [dispatch, searchValue])

  const handlerDistableAffiliate = async (id: string) => {
    try {
      dispatch(affiliateActions.deleteAffiliate(id) as unknown as AnyAction)
      dispatch(affiliateActions.getAdminAffiliates('') as unknown as AnyAction)
      message.success('Vô hiệu hoá danh mục thành công!')
    } catch (error) {
      message.error('Vô hiệu hoá danh mục thất bại!')
    }
  }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue)
    }
  }

  const columns: TableProps<IAffiliate>['columns'] = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      width: 40,
      align: 'center'
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 140,
      render: (text) => <a className='block w-64 truncate text-blue-600 hover:underline'>{text}</a>
    },
    {
      title: 'Lượt click',
      dataIndex: 'clickCount',
      key: 'clickCount',
      align: 'center',
      width: 100,
      render: (text) => <>{text ?? 0}</>
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
          <Link to={'' + record.id}>
            <Button type='primary'>Sửa </Button>
          </Link>
          <Popconfirm
            placement='topRight'
            title={record.active == 1 ? 'Are you sure distable this affiliate?' : 'Are you sure enable this affiliate?'}
            onConfirm={() => handlerDistableAffiliate(record.id)}
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

  if (affiliates.error_message) {
    return <ErrorLoad />
  }

  return (
    <>
      <div className='flex items-center justify-between my-2'>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Danh sách danh mục
        </Typography.Title>
      </div>
      <div className=''>
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
            style={{
              borderRadius: '2rem'
            }}
          />
          <Link to='add'>
            <Button type='primary'>Thêm danh mục</Button>
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
          dataSource={affiliates?.dataList?.map((category: IAffiliate, index: number) => ({
            ...category,
            key: index + 1
          }))}
          loading={affiliates.isLoading}
        />
      </div>
    </>
  )
}
