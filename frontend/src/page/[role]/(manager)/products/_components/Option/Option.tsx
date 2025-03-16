import { Flex, Form, Input, InputNumber, Segmented, Select, Slider, SliderSingleProps, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { useGetCategoriesQuery, useLazyGetCategoryQuery } from '../../../category/CategoryEndpoints'
import { ICategory } from '@/common/types/category.interface'
import { COLOR, MATERIAL, TYPE } from '../../../../../../data/data'
interface option {
  setImageUrl: React.Dispatch<React.SetStateAction<any>>
  discount: {
    typeDiscount: string
    setTypeDiscount: React.Dispatch<React.SetStateAction<string>>
  }
  setDetails: React.Dispatch<React.SetStateAction<any>>
  displayImg?: string
}

export default function Option({ setImageUrl, discount, setDetails, displayImg }: option) {
  const { data: dataCategories, isLoading: isLoadingCategory } = useGetCategoriesQuery({})
  const [getCategory, { data: dataCategory, isLoading: categoryLoading }] = useLazyGetCategoryQuery()
  const [DisplayPic, setDisplayPic] = useState<string>(displayImg ? displayImg : '')
  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `${value}%`

  useEffect(() => {
    if (dataCategory?.data && !categoryLoading) {
      setDetails(dataCategory.data)
    }
  }, [dataCategory, categoryLoading, setDetails])

  const categories = dataCategories
    ? dataCategories?.data?.map((item: ICategory) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    : []

  const selectedImg = (e: any) => {
    const types = ['jpeg', 'png', 'jpg', 'gif']

    const fileSelected = e.target.files[0]

    const size = fileSelected.size
    const type = types.includes(fileSelected.type.replace('image/', ''))

    if (size <= 1048576 && type) {
      setImageUrl(fileSelected)
      setDisplayPic(URL.createObjectURL(fileSelected))
    }
  }

  const getDetails = async (value: number) => {
    await getCategory(value)
  }

  return (
    <Flex vertical gap={30}>
      {/* Thumbnail */}
      <Form.Item
        name='upload'
        className='p-[2rem] sm:rounded-lg border-[#F1F1F4] m-0'
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1rem' }}
      >
        <Flex vertical gap={20}>
          <h2 className='font-bold text-[16px]'>Ảnh nhỏ</h2>
          <div
            style={{ height: '12vw', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}
            className='border-none rounded-[12px]  '
          >
            {DisplayPic && DisplayPic != '' ? (
              <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'>
                <img
                  src={DisplayPic}
                  alt=''
                  className='object-cover h-[100%] object-center'
                  style={{ width: '100%' }}
                />
                <div
                  className=' absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000'
                  style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}
                ></div>
                <button style={{ zIndex: 999, fontSize: '20px', color: 'white' }} onClick={() => setDisplayPic('')}>
                  <DeleteOutlined className=' duration-1000 opacity-0 group-hover:opacity-100 absolute top-10 right-10' />
                </button>
              </div>
            ) : (
              <Flex
                className='border-dashed  border-2 relative hover:bg-gray-100 hover:border-solid hover:border'
                vertical
                gap={10}
                justify='center'
                align='center'
                style={{ maxWidth: '100%', height: '100%', borderRadius: '12px' }}
              >
                <Flex vertical gap={10} style={{ width: '100%' }}>
                  <Flex vertical align='center' justify='center'>
                    <CloudUploadOutlined style={{ fontSize: '50px', color: 'gray' }} className='' />
                  </Flex>
                </Flex>
                <Flex style={{ width: '100%', color: 'gray' }} vertical justify='center' align='center'>
                  <span style={{ fontSize: '11px' }}>Kích thước tối đa: 50MB</span>
                  <span style={{ fontSize: '11px' }}>JPG, PNG, GIF, SVG</span>
                </Flex>
                <input
                  type='file'
                  accept='image/*'
                  name='image'
                  id='image'
                  className='opacity-0 absolute inset-0'
                  onChange={selectedImg}
                />
              </Flex>
            )}
          </div>
        </Flex>
      </Form.Item>
      {/* Thumbnail */}

      {/* category */}
      <div
        className='sm:rounded-lg flex-1 p-2 relative'
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem' }}
      >
        <div className='p-2'>
          <h2 className='font-bold'>Danh mục</h2>
        </div>
        <Flex justify='center' align='' vertical className='p-2' gap={10}>
          <Form.Item
            className='m-0'
            name='category_id'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn danh mục'
              }
            ]}
          >
            <Select
              loading={isLoadingCategory}
              className='h-[40px] relative'
              options={categories}
              onChange={getDetails}
            />
          </Form.Item>
        </Flex>
      </div>
      {/* category */}

      {/* Tags */}
      <div
        className='sm:rounded-lg flex-1 p-2 relative'
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem' }}
      >
        <div className='p-2'>
          <h2 className='font-bold'>Loại sản phẩm</h2>
        </div>
        <Flex justify='center' align='' vertical className='p-2' gap={10}>
          <Form.Item className='m-0' name='type' rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}>
            <Select className='h-[40px] relative' options={TYPE} />
          </Form.Item>
        </Flex>
      </div>
      {/* Tags */}
      {/* Tags */}
      <div
        className='sm:rounded-lg flex-1 p-2 relative'
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem' }}
      >
        <div className='p-2'>
          <h2 className='font-bold'>Chất liệu sản phẩm</h2>
        </div>
        <Flex justify='center' align='' vertical className='p-2' gap={10}>
          <Form.Item
            className='m-0'
            name='material'
            rules={[{ required: true, message: 'Vui lòng chọn chất liệu sản phẩm' }]}
          >
            <Select className='h-[40px] relative' options={MATERIAL} />
          </Form.Item>
        </Flex>
      </div>
      {/* Tags */}
      {/* Tags */}
      <div
        className='sm:rounded-lg flex-1 p-2 relative'
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem' }}
      >
        <div className='p-2'>
          <h2 className='font-bold'>Màu sắc</h2>
        </div>
        <Flex justify='center' align='' vertical className='p-2' gap={10}>
          <Form.Item className='m-0' name='color' rules={[{ required: true, message: 'Vui lòng nhập màu sản phẩm' }]}>
            <Select className='h-[40px] relative' options={COLOR} />
          </Form.Item>
        </Flex>
      </div>
      {/* Tags */}
      {/* Tags */}
      <div
        className='sm:rounded-lg flex-1 p-2 relative'
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem' }}
      >
        <div className='p-2'>
          <h2 className='font-bold'>Kích Thước</h2>
        </div>
        <Flex justify='center' align='' vertical className='p-2' gap={10}>
          <Form.Item
            name='size'
            rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}
            className='m-0 flex-1'
          >
            <Input />
          </Form.Item>
        </Flex>
      </div>
      {/* Tags */}

      {/* Setting */}
      <div
        className='sm:rounded-lg overflow-hidden flex-1 p-2'
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem' }}
      >
        <div className='p-2'>
          <h2 className='font-bold'>cài đặt</h2>
        </div>
        <hr />
        <div className='flex justify-between items-center p-2'>
          <h2>Kích hoạt</h2>
          <Form.Item className='m-0' label='' name='is_active' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </div>
        <div className='flex justify-between items-center p-2'>
          <h2>Ưu đãi hấp dẫn</h2>
          <Form.Item className='m-0' label='' name='is_hot_deal' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </div>
        <div className='flex justify-between items-center p-2'>
          <h2>sản phẩm mới</h2>
          <Form.Item className='m-0' label='' name='is_new' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </div>
      </div>
      {/* Setting */}

      {/* Discount */}
      <div
        className='sm:rounded-lg flex-1 p-2 relative'
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem' }}
      >
        <div className='p-2'>
          <h2 className='font-bold'>Giảm giá</h2>
        </div>
        <Flex justify='center' align='' vertical className='p-2' gap={10}>
          <Form.Item className='m-0 w-full' name='discount'>
            <Segmented
              className='w-full flex justify-center items-center'
              options={[
                { label: 'none', value: '' },
                { label: '%', value: 'percent' },
                { label: 'Cố định', value: 'fixed' }
              ]}
              block
              onChange={(e) => {
                discount.setTypeDiscount(e)
              }}
            />
          </Form.Item>
          {discount.typeDiscount == 'percent' ? (
            <>
              <Form.Item
                name={'percentage'}
                rules={[
                  {
                    required: true,
                    message: 'Chọn mức giá'
                  }
                ]}
              >
                <Slider tooltip={{ formatter }} />
              </Form.Item>
            </>
          ) : discount.typeDiscount == 'fixed' ? (
            <>
              <Form.Item
                name={'fixed'}
                rules={[
                  {
                    required: true,
                    message: 'Chọn mức giá'
                  },
                  {
                    validator: (_, value) => {
                      if (value == 0) {
                        return Promise.reject('Phần trăm phải lớn hơn 0')
                      }
                    }
                  }
                ]}
              >
                <InputNumber<number>
                  defaultValue={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                  className='w-full'
                />
              </Form.Item>
            </>
          ) : (
            ''
          )}
        </Flex>
      </div>
      {/* Discount */}
    </Flex>
  )
}
