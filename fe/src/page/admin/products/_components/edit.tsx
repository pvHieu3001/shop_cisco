/* eslint-disable react-refresh/only-export-components */
import { Col, Flex, Row, Button, Form, Input, Drawer, InputNumber, Card, Select, Switch } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { popupError, popupSuccess } from '@/page/shared/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { productActions } from '@/app/actions/product.actions'
import { categoryActions } from '@/app/actions/category.actions'
import { AnyAction } from '@reduxjs/toolkit'
import { formatDate } from '@/utils/formatDate'
import TextEditor from '../../components/TextEditor/QuillEditor'
import { RootState } from '@/app/store'
import { ICategory } from '@/common/types.interface'
import { getImageUrl } from '@/utils/getImageUrl'
import { useQuery } from '@/utils/useQuery'

function EditProduct() {
  const navigator = useNavigate()
  const query = useQuery()
  const { flug } = useParams()
  const dispatch = useDispatch()
  const productStore = useSelector((state: RootState) => state.product)
  const categoryStore = useSelector((state: RootState) => state.category)
  const [form] = Form.useForm()
  const [imageUrl, setImageUrl] = useState<Blob>()
  const [description, setDescription] = useState<string>('')
  const [productBenefits, setProductBenefits] = useState<string>('')
  const [displayPic, setDisplayPic] = useState<string>()

  useEffect(() => {
    if (flug) {
      dispatch(productActions.getProductById(flug) as unknown as AnyAction)
    }
    dispatch(categoryActions.getAdminCategories('') as unknown as AnyAction) // Lấy danh sách danh mục
  }, [dispatch, flug])

  useEffect(() => {
    setDescription(productStore.data?.description ?? '')
    setProductBenefits(productStore.data?.productBenefits ?? '')
    if (productStore.data?.imageUrl) {
      setDisplayPic(getImageUrl(productStore.data.imageUrl))
    }
  }, [productStore])

  const onFinish = async () => {
    const id = productStore.data?.id
    const name = form.getFieldValue('name')
    const categoryId = form.getFieldValue('categoryId')
    const price = form.getFieldValue('price')
    const sourceUrl = form.getFieldValue('sourceUrl')
    const status = form.getFieldValue('status')
    const isDisplayHot = form.getFieldValue('isDisplayHot')

    const formdata = new FormData()
    formdata.append('id', id as string)
    formdata.append('name', name)
    formdata.append('categoryId', categoryId)
    formdata.append('description', description)
    formdata.append('productBenefits', productBenefits)
    formdata.append('sourceUrl', sourceUrl)
    formdata.append('price', price ?? 0)
    formdata.append('status', status ? 'active' : 'inactive')
    formdata.append('isDisplayHot', isDisplayHot)
    if (imageUrl) {
      formdata.append('imageFile', imageUrl as Blob)
    }

    try {
      await dispatch(productActions.updateProduct(id as string, formdata) as unknown as AnyAction)
      await dispatch(
        productActions.getAdminProducts(
          query.get('status') ?? '',
          query.get('search') ?? '',
          query.get('isHot') ?? ''
        ) as unknown as AnyAction
      )
      popupSuccess('Cập nhật sản phẩm thành công')
      navigator('..')
    } catch (error) {
      popupError('Cập nhật sản phẩm thất bại')
    }
  }

  const handleCancel = () => {
    navigator('..')
  }

  return (
    <>
      {productStore.data && !productStore.isLoading && (
        <Drawer
          open={true}
          title={
            <>
              <h2 className=' font-bold text-[24px]'>Cập nhật sản phẩm</h2>
            </>
          }
          width={'85%'}
          styles={{
            header: {
              height: 60
            },
            body: {
              paddingBottom: 80
            }
          }}
          onClose={handleCancel}
        >
          <Form
            layout='vertical'
            form={form}
            name='nest-messages'
            onFinish={onFinish}
            className='p-10 relative'
            initialValues={{
              id: productStore.data?.id,
              createdAt: formatDate(productStore.data?.createdAt ? new Date(productStore.data?.createdAt) : new Date()),
              createdBy: productStore.data?.createdBy,
              updatedAt: formatDate(productStore.data?.updatedAt ? new Date(productStore.data?.updatedAt) : new Date()),
              updatedBy: productStore.data?.updatedBy,
              categoryId: productStore.data?.category?.id,
              content: productStore.data?.content,
              description: productStore.data?.description,
              productBenefits: productStore.data?.productBenefits,
              language: productStore.data?.language,
              level: productStore.data?.level,
              name: productStore.data?.name,
              price: productStore.data?.price,
              rating: productStore.data?.rating,
              slug: productStore.data?.slug,
              sourceUrl: productStore.data?.sourceUrl,
              status: productStore.data?.status == 'active' ? true : false,
              isDisplayHot: productStore.data?.isDisplayHot,
              totalRating: productStore.data?.totalRating,
              totalStudents: productStore.data?.totalStudents
            }}
          >
            <Card title='Thông tin hệ thống' size='small' style={{ marginBottom: 24, background: '#fafafa' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name='slug' label='Slug'>
                    <Input disabled placeholder='Nhập slug' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name='total_rating' label='Tổng số đánh giá'>
                    <InputNumber disabled className='w-full' min={0} placeholder='Nhập tổng số đánh giá' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name='rating' label='Đánh giá'>
                    <InputNumber
                      disabled
                      className='w-full'
                      min={0}
                      max={5}
                      step={0.1}
                      placeholder='Nhập điểm đánh giá'
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name='createdAt' label='Ngày tạo'>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name='updatedAt' label='Ngày cập nhật'>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title='Thông tin sản phẩm' size='small' style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name='name'
                    label='Tên sản phẩm'
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                  >
                    <Input placeholder='Nhập tên sản phẩm' size='large' />
                  </Form.Item>
                  {categoryStore.dataList?.length > 0 && (
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
                  )}
                </Col>

                <Col xs={24} md={12}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name='price' label='Giá'>
                        <InputNumber className='w-full' min={0} placeholder='Nhập giá' size='large' />
                      </Form.Item>
                    </Col>

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
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24}>
                      <Form.Item name='sourceUrl' label='Nguồn video'>
                        <Input placeholder='Nhập URL nguồn video' size='large' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
            <Card size='small' style={{ marginBottom: 24 }}>
              <Form.Item name='description' className='m-0' label={'Mô tả chi tiết sản phẩm'}>
                <TextEditor
                  content={description ?? ''}
                  onHandleChange={(value) => {
                    setDescription(value)
                  }}
                />
              </Form.Item>
            </Card>
            <Card size='small' style={{ marginBottom: 24 }}>
              <Form.Item name='productBenefits' className='m-0' label={'Lợi ích sản phẩm'}>
                <TextEditor
                  content={productBenefits ?? ''}
                  onHandleChange={(value) => {
                    setProductBenefits(value)
                  }}
                />
              </Form.Item>
            </Card>
            <Card size='small' style={{ marginBottom: 24 }}>
              <Form.Item
                name='gallery'
                className='p-[30px] sm:rounded-lg border-[#F1F1F4] m-0'
                style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1rem' }}
              >
                <Flex vertical gap={20}>
                  <h2 className='font-bold text-[16px]'>Ảnh Đại diện</h2>
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
                        {/* Hiển thị ảnh hiện tại từ DB nếu chưa chọn ảnh mới */}
                        {!imageUrl && displayPic && (
                          <div className='h-[100px] w-[120px] rounded-lg overflow-hidden relative'>
                            <img
                              src={displayPic}
                              alt='Ảnh hiện tại'
                              className='object-cover h-full w-full object-center rounded-lg border border-gray-300 bg-white'
                            />
                          </div>
                        )}
                        {/* Nếu đã chọn ảnh mới thì hiển thị preview ảnh mới */}
                        {imageUrl ? (
                          <div className='h-[100px] w-[120px] rounded-lg overflow-hidden relative'>
                            <img
                              src={URL.createObjectURL(imageUrl as Blob)}
                              alt='Preview'
                              className='object-cover h-full w-full object-center rounded-lg border border-gray-300 bg-white'
                            />
                            <Button
                              type='text'
                              danger
                              size='small'
                              style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}
                              onClick={() => setImageUrl(undefined)}
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
                            onChange={(e) => {
                              if (!e.target.files || e.target.files.length === 0) return
                              const file = e.target.files[0]
                              if (file.size > 2 * 1024 * 1024) {
                                popupError('Ảnh phải nhỏ hơn 2MB')
                                return
                              }
                              setImageUrl(file)
                            }}
                          />
                        )}
                      </label>
                    </Flex>
                  </div>
                </Flex>
              </Form.Item>
            </Card>
            <Flex className='fixed z-[10000000] top-[15px] right-10' gap={20}>
              <Button
                loading={productStore.isLoading}
                disabled={productStore.isLoading}
                htmlType='submit'
                type='primary'
                className=' '
              >
                Cập nhật
              </Button>
            </Flex>
          </Form>
        </Drawer>
      )}
    </>
  )
}

export default EditProduct
