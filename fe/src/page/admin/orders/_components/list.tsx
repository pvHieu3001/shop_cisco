import { useEffect, useState } from 'react'
import { Flex, Input, Table, Typography } from 'antd'
import { AnyAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { OrderActions } from '@/app/actions/orders.action'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { RootState } from '@/app/store'
import { IOrder } from '@/common/types.interface'

export default function ListOrders() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const orders = useSelector((state: RootState) => state.order)

  useEffect(() => {
    dispatch(OrderActions.getOrder() as unknown as AnyAction)
  }, [dispatch])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue)
    }
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 40,
      align: 'center'
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'subTotal',
      key: 'subTotal',
      align: 'center',
      width: 180,
      render: (text: string) => <span>{text}</span>
    },
    {
      title: 'Mã giảm giá ',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      align: 'center',
      width: 250,
      render: (text: string) => <span>{text}</span>
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'center',
      width: 250,
      render: (text: string) => <span>{text}</span>
    },
    {
      title: 'ID phiếu giảm giá',
      dataIndex: 'couponId',
      key: 'couponId',
      align: 'center',
      width: 250,
      render: (text: string) => <span>{text}</span>
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
        dataSource={orders?.dataList?.map((item: IOrder, index: number) => ({ ...item, key: index + 1 }))}
        loading={orders.isLoading}
      />
    </>
  )
}
