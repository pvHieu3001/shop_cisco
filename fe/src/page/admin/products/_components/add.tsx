import { Col, Flex, Row, Button, Form, Input, Drawer, InputNumber, Card, Select, Switch } from 'antd'
import { useEffect, useState } from 'react'
import { popupError, popupSuccess } from '@/page/shared/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { productActions } from '@/app/actions/product.actions'
import { categoryActions } from '@/app/actions/category.actions'
import { AnyAction } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import TextEditor from '../../components/TextEditor/QuillEditor'
import { RootState } from '@/app/store'
import { ICategory } from '@/common/types.interface'
import { useQuery } from '@/utils/useQuery'

function AddProduct() {
  const query = useQuery()
  const dispatch = useDispatch()
  const categoryStore = useSelector((state: RootState) => state.category)
  const productStore = useSelector((state: RootState) => state.product)
  const [form] = Form.useForm()
  const [imageUrl, setImageUrl] = useState<Blob>()
  const [displayPic, setDisplayPic] = useState<string>()
  const [detail, setDetail] = useState<string>('')
  const [productBenefits, setproductBenefits] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(categoryActions.getAdminCategories('') as unknown as AnyAction)
  }, [dispatch])

  const onFinish = async () => {
    const name = form.getFieldValue('name')
    const categoryId = form.getFieldValue('categoryId')
    const price = form.getFieldValue('price')
    const sourceUrl = form.getFieldValue('sourceUrl')
    const status = form.getFieldValue('status')
    const isDisplayHot = form.getFieldValue('isDisplayHot')

    const formdata = new FormData()
    formdata.append('name', name)
    formdata.append('categoryId', categoryId)
    formdata.append('description', detail)
    formdata.append('productBenefits', productBenefits)
    formdata.append('price', price ?? 0)
    formdata.append('sourceUrl', sourceUrl)
    formdata.append('status', status ? 'active' : 'inactive')
    formdata.append('isDisplayHot', isDisplayHot ?? false)
    if (imageUrl) {
      formdata.append('imageFile', imageUrl as Blob)
    }

    try {
      await dispatch(productActions.createProduct(formdata) as unknown as AnyAction)
      await dispatch(
        productActions.getAdminProducts(
          query.get('status') ?? '',
          query.get('search') ?? '',
          query.get('isHot') ?? ''
        ) as unknown as AnyAction
      )
      popupSuccess('Thêm sản phẩm thành công')
      navigate('..')
    } catch (error) {
      popupError('Thêm sản phẩm thất bại')
    }
  }

  const handleCancel = () => {
    window.location.href = '/admin/products'
  }

  // Xử lý chọn ảnh đại diện (giống bên edit)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    if (file.size > 2 * 1024 * 1024) {
      popupError('Ảnh phải nhỏ hơn 2MB')
      return
    }
    setImageUrl(file)
    setDisplayPic(URL.createObjectURL(file))
  }

  // Xử lý xóa ảnh đã chọn
  const handleDeleteImage = () => {
    setImageUrl(undefined)
    setDisplayPic(undefined)
  }

  return (
    <>
      <Drawer
        open={true}
        title={<h2 className=' font-bold text-[24px]'>Tạo sản phẩm mới</h2>}
        width={'85%'}
        styles={{
          header: { height: 60 },
          body: { paddingBottom: 80 }
        }}
        onClose={handleCancel}
      >
        <Form layout='vertical' form={form} name='nest-messages' onFinish={onFinish} className='p-10 relative'>
          <Card title='Thông tin sản phẩm' size='small' style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              {/* Cột trái */}
              <Col xs={24} md={12}>
                <Form.Item
                  name='name'
                  label='Tên sản phẩm'
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                  <Input placeholder='Nhập tên sản phẩm' size='large' />
                </Form.Item>

                <Form.Item
                  name='categoryId'
                  label='Danh mục'
                  rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
                >
                  <Select
                    placeholder='Chọn danh mục'
                    loading={categoryStore.isLoading}
                    allowClear
                    showSearch
                    optionFilterProp='children'
                    size='large'
                  >
                    {categoryStore.dataList?.map((cat: ICategory) => (
                      <Select.Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Row chứa switch */}
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name='status' label='Trạng thái' valuePropName='checked'>
                      <Switch className='w-20' checkedChildren='Active' unCheckedChildren='Inactive' />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name='isDisplayHot' label='sản phẩm nổi bật' valuePropName='checked'>
                      <Switch className='w-20' checkedChildren='Hiện' unCheckedChildren='Ẩn' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              {/* Cột phải */}
              <Col xs={24} md={12}>
                <Form.Item name='price' label='Giá'>
                  <InputNumber className='w-full' min={0} placeholder='Nhập giá' size='large' />
                </Form.Item>
                <Form.Item name='sourceUrl' label='Nguồn video'>
                  <Input placeholder='Nhập URL nguồn video' size='large' />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card size='small' style={{ marginBottom: 24 }}>
            <Form.Item name='description' label='Nhập mô tả' required>
              <TextEditor content={detail ?? ''} onHandleChange={(val) => setDetail(val)} />
            </Form.Item>
          </Card>
          <Card size='small' style={{ marginBottom: 24 }}>
            <Form.Item name='productBenefits' className='m-0' label={'Lợi ích sản phẩm'}>
              <TextEditor
                content={productBenefits ?? ''}
                onHandleChange={(value) => {
                  setproductBenefits(value)
                }}
              />
            </Form.Item>
          </Card>
          <Card size='small' style={{ marginBottom: 24 }}>
            <Form.Item
              name='imageFile'
              className='p-[30px] sm:rounded-lg border-[#F1F1F4] m-0'
              style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1rem' }}
            >
              <Flex vertical gap={20}>
                <h2 className='font-bold text-[16px]'>Ảnh đại diện</h2>
                <div
                  style={{
                    flex: 5,
                    overflow: 'hidden',
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'
                  }}
                  className='border-none rounded-[12px] relative'
                >
                  <Flex
                    className='border-dashed border-2 p-5 relative hover:bg-gray-100 hover:border-solid'
                    vertical
                    gap={10}
                    justify='center'
                    align='center'
                    style={{ width: '100%', minHeight: '120px', borderRadius: '12px' }}
                  >
                    <label
                      htmlFor='image-upload'
                      className='flex flex-col items-center justify-center w-[120px] h-[100px] border rounded-md cursor-pointer bg-white hover:bg-gray-100'
                    >
                      {/* Hiển thị preview ảnh nếu đã chọn */}
                      {displayPic ? (
                        <div className='h-[100px] w-[120px] rounded-lg overflow-hidden relative'>
                          <img
                            src={displayPic}
                            alt='Preview'
                            className='object-cover h-full w-full object-center rounded-lg border border-gray-300 bg-white'
                          />
                          <Button
                            type='text'
                            danger
                            size='small'
                            style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}
                            onClick={handleDeleteImage}
                          >
                            Xóa
                          </Button>
                        </div>
                      ) : (
                        <input
                          id='image-upload'
                          type='file'
                          accept='image/*'
                          name='imageFile'
                          className='hidden'
                          style={{ display: 'none' }}
                          onChange={handleImageChange}
                        />
                      )}
                    </label>
                  </Flex>
                </div>
              </Flex>
            </Form.Item>
          </Card>
          {/* Nếu muốn giữ gallery, có thể thêm lại logic gallery ở dưới */}
          <Flex className='fixed z-[10000000] top-[15px] right-10' gap={20}>
            <Button loading={productStore.isLoading} disabled={productStore.isLoading} htmlType='submit' type='primary'>
              Tạo
            </Button>
          </Flex>
        </Form>
      </Drawer>
    </>
  )
}

export default AddProduct
