/* eslint-disable react-refresh/only-export-components */
import { Col, Flex, Row, Button, Form, Input, Drawer, UploadProps, GetProp, InputNumber, Image } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons'
import Option from './Option/Option'
import TextEditor from './TextEditor/TextEditor'
import {
  useCreateProductMutation,
  useGetGalleriesQuery,
  useGetProductQuery
} from '../../../../../services/ProductsEndpoints'
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast'
import ReactQuill from 'react-quill'
import { modules, formats } from '../../../../../data/data'
import pencil from '../../../../../assets/images/manager/pencil.svg'

interface gallery {
  image: File | string
  displayPic: File | string
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

function EditProduct() {
  const { flug } = useParams()
  const [addProduct, { isLoading: isLoadingAddProduct }] = useCreateProductMutation()
  const { data, isLoading } = useGetProductQuery(flug)
  const { data: dataGalleries, isLoading: isLoadingGallery } = useGetGalleriesQuery(flug)
  const [imageUrl, setImageUrl] = useState<Blob>()
  const [form] = Form.useForm()
  const [gallery, setGallery] = useState<Array<gallery>>([])
  const navigate = useNavigate()
  const fileInputRef = useRef<unknown>(null)
  const numberFile = useRef<number>(0)
  const [typeDiscount, setTypeDiscount] = useState<string>('')
  const [editDetail, setEditDetail] = useState(false)

  useEffect(() => {
    if (dataGalleries && !isLoadingGallery) {
      const initDataGalleries: gallery[] = []
      dataGalleries.data.map((item: gallery) => {
        initDataGalleries.push({
          image: '',
          displayPic: item.image
        })
      })
      setGallery(initDataGalleries)
    }
  }, [dataGalleries, isLoadingGallery])

  const onFinish = async () => {
    const name = form.getFieldValue('name')
    const content = form.getFieldValue('content')
    const category_id = form.getFieldValue('category_id')
    const percentage = form.getFieldValue('percentage')
    const fixed = form.getFieldValue('fixed')
    const is_active = form.getFieldValue('is_active') ? 1 : 0
    const is_hot_deal = form.getFieldValue('is_hot_deal') ? 1 : 0
    const is_new = form.getFieldValue('is_new') ? 1 : 0
    const quantity = form.getFieldValue('quantity')
    const price = form.getFieldValue('price')
    const price_sale = form.getFieldValue('price_sale')
    const type = form.getFieldValue('type')
    const color = form.getFieldValue('color')
    const size = form.getFieldValue('size')
    const material = form.getFieldValue('material')
    const detail = form.getFieldValue('detail')

    const formdata = new FormData()

    formdata.append('thumbnail', imageUrl ? imageUrl : '')
    formdata.append('gallery', gallery ? JSON.stringify(gallery) : '')
    formdata.append('name', name)
    formdata.append('content', content ?? data?.data.content)
    formdata.append('category_id', category_id)
    formdata.append('is_active', String(is_active))
    formdata.append('is_hot_deal', String(is_hot_deal))
    formdata.append('is_new', String(is_new))
    formdata.append('type_discount', String(typeDiscount))
    formdata.append('discount', typeDiscount == 'percent' ? percentage : typeDiscount == 'fixed' ? fixed : '')
    formdata.append('price', String(price))
    formdata.append('price_sale', String(price_sale))
    formdata.append('quantity', String(quantity))
    formdata.append('type', String(type))
    formdata.append('color', String(color))
    formdata.append('size', String(size))
    formdata.append('material', String(material))
    formdata.append('detail', detail ?? data?.data.detail)
    formdata.append('id', data?.data.id)

    try {
      await addProduct(formdata).unwrap()
      popupSuccess('Add product success')
      navigate('..')
    } catch (error) {
      popupError('Add product error')
    }
  }

  const handleCancel = () => {
    navigate('..')
  }

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  const selectGallery = async (e) => {
    if (gallery.length > 6) return

    const types = ['jpeg', 'png', 'jpg', 'gif']

    const fileSelected = e.target.files

    for (const key in fileSelected) {
      if (numberFile.current == 5) break
      if (typeof fileSelected[key] == 'number') break

      const file = await fileSelected[key]
      if (!(file instanceof File)) continue

      const size = file.size
      const type = types.includes(file.type.replace('image/', ''))

      const newFile = await getBase64(fileSelected[key])

      if (size <= 1048576 && type) {
        numberFile.current++
        setGallery((pveImages) => [
          ...pveImages,
          {
            image: newFile,
            displayPic: URL.createObjectURL(file)
          }
        ])
      }
    }
    e.target.value = null
  }

  const handleDeleteGallery = (id: number) => {
    numberFile.current--
    setGallery([...gallery.filter((item, key) => key != id)])
  }

  return (
    <>
      {data && !isLoading && (
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
              type: data?.data?.type,
              color: data?.data?.color,
              size: data?.data?.size,
              material: data?.data?.material,
              detail: data?.data?.detail,
              price: data?.data?.price,
              price_sale: data?.data?.price_sale,
              quantity: data?.data?.quantity,
              is_active: data?.data?.is_active,
              is_hot_deal: data?.data?.is_hot_deal,
              is_new: data?.data?.is_new,
              name: data?.data.name,
              category_id: data?.data.category_id,
              content: data?.data.content
            }}
          >
            <Flex className='fixed z-[10000000] top-[15px] right-10' gap={20}>
              <Button
                loading={isLoadingAddProduct}
                disabled={isLoadingAddProduct}
                htmlType='submit'
                type='primary'
                className=' '
              >
                Cập nhật
              </Button>
              <Button type='dashed'>Đặt lại</Button>
            </Flex>
            <Flex vertical gap={30}>
              <Row gutter={[24, 8]} align={'stretch'}>
                <Col span={5} className='w-full'>
                  <Option
                    setImageUrl={setImageUrl}
                    discount={{ typeDiscount, setTypeDiscount }}
                    setDetails={() => {}}
                    displayImg={data.data.thumbnail}
                  />
                </Col>
                <Col span={19}>
                  <Flex vertical className='' gap={30}>
                    {/* Gallery */}
                    <Form.Item
                      name='gallery'
                      className='p-[30px] sm:rounded-lg border-[#F1F1F4] m-0'
                      style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1rem' }}
                    >
                      <Flex vertical gap={20}>
                        <h2 className='font-bold text-[16px]'>Hình Ảnh</h2>
                        <div
                          style={{
                            flex: 5,
                            overflow: 'hidden',
                            boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'
                          }}
                          className='border-none rounded-[12px] relative'
                        >
                          <Flex
                            className='border-dashed border-2 p-5 relative hover:bg-gray-100 hover:border-solid  '
                            vertical
                            gap={10}
                            justify='center'
                            align='center'
                            style={{ width: '100%', height: '7.5vw', borderRadius: '12px' }}
                          >
                            {gallery.length < 1 ? (
                              <>
                                <Flex vertical gap={10} style={{ width: '100%' }}>
                                  <Flex vertical align='center' justify='center'>
                                    <CloudUploadOutlined style={{ fontSize: '50px', color: 'gray' }} className='' />
                                  </Flex>
                                </Flex>
                                <Flex style={{ width: '100%', color: 'gray' }} vertical justify='center' align='center'>
                                  <span style={{ fontSize: '11px' }}>
                                    Kích thước tối đa: 50MB{' '}
                                    <span className={`${gallery.length != 5 ? 'text-red-400' : 'text-blue-400'}`}>
                                      {gallery.length}/5
                                    </span>
                                  </span>
                                  <span style={{ fontSize: '11px' }}>JPG, PNG, GIF, SVG</span>
                                </Flex>
                              </>
                            ) : (
                              ''
                            )}
                            <input
                              type='file'
                              accept='image/*'
                              name='image'
                              id='image'
                              multiple
                              className='opacity-0 absolute inset-0'
                              onChange={selectGallery}
                              ref={fileInputRef}
                            />
                            <Flex justify='center' align='center' gap={20} wrap className='w-full h-[100%]'>
                              {gallery.map((item, index) => (
                                <div className='h-[100px] w-[15%] rounded-lg overflow-hidden' key={index}>
                                  <div style={{ height: '100%', width: '100%' }} className='relative group' key={index}>
                                    <img
                                      src={item.displayPic}
                                      alt=''
                                      className='object-cover h-full object-center'
                                      style={{ width: '100%' }}
                                    />
                                    <div
                                      className=' absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000'
                                      style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}
                                    ></div>
                                    <div
                                      style={{ zIndex: 999, fontSize: '20px', color: 'white' }}
                                      className=' cursor-pointer'
                                      onClick={() => handleDeleteGallery(index)}
                                    >
                                      <DeleteOutlined
                                        className=' duration-1000 opacity-0 group-hover:opacity-100 absolute top-[50%] left-[50%]'
                                        style={{ transform: 'translate(-50%, -50%)' }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </Flex>
                          </Flex>
                        </div>
                      </Flex>
                    </Form.Item>
                    {/* Gallery */}

                    {/* General */}
                    <div
                      className=' p-[2rem] sm:rounded-lg h-full'
                      style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem' }}
                    >
                      <h2 className='mb-5 font-bold text-[16px]'>Tổng quát</h2>
                      <Flex vertical gap={20}>
                        <Form.Item
                          name='name'
                          label='Tên'
                          className='w-full'
                          rules={[
                            { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                            { max: 120, message: 'Tên không vượt quá 120 ký tự' },
                            { min: 10, message: 'Tên không nhập nhỏ hơn 10 ký tự' },
                            {
                              whitespace: true,
                              message: 'Tên sản phẩm không được để trống!'
                            }
                          ]}
                        >
                          <Input size='large' placeholder='Nhập tên sản phẩm' />
                        </Form.Item>
                        <Flex vertical>
                          <TextEditor data={data?.data?.content} />
                        </Flex>
                      </Flex>
                    </div>
                    {/* General */}

                    {/* Variant */}
                    <Flex
                      vertical
                      gap={20}
                      className='sm:rounded-lg p-10'
                      style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem' }}
                    >
                      <h2 className={`font-bold text-[16px]`}>Thông tin chi tiết sản phẩm</h2>
                      <Form.Item name='quantity' className='m-0 flex-1' label='Số lượng'>
                        <InputNumber
                          placeholder='Nhập số lượng'
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          className=' border-gray-300  w-full'
                          min={0}
                        />
                      </Form.Item>
                      <hr />
                      <Form.Item name='price' className='m-0 flex-1' label='Giá bán'>
                        <InputNumber
                          placeholder='Nhập giá bán'
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          className=' border-gray-300 w-full h-[40px]'
                          min={0}
                        />
                      </Form.Item>
                      <hr />
                      <Form.Item name='price_sale' className='m-0 flex-1' label='Giá trước khi giảm'>
                        <InputNumber
                          placeholder='Nhập giá trước khi giảm'
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          className=' border-gray-300 w-full h-[40px]'
                          min={0}
                        />
                      </Form.Item>
                      <hr />
                      {!editDetail ? (
                        <div className='m-0 flex-1'>
                          <Button
                            className='mb-1'
                            onClick={(e) => {
                              e.preventDefault()
                              setEditDetail(true)
                            }}
                          >
                            <Image className='pr-2' src={pencil} />
                            Chỉnh sửa
                          </Button>
                          <div dangerouslySetInnerHTML={{ __html: data?.data?.detail }} />
                        </div>
                      ) : (
                        <Form.Item
                          name={'detail'}
                          className='m-0'
                          label={'Mô tả chi tiết sản phẩm'}
                          rules={[
                            {
                              required: true,
                              message: 'Trường này là bắt buộc'
                            }
                          ]}
                        >
                          <ReactQuill
                            modules={modules}
                            formats={formats}
                            theme='snow' // hoặc 'bubble'
                            className='h-[200px]'
                          />
                        </Form.Item>
                      )}
                    </Flex>
                    {/* Variant */}
                  </Flex>
                </Col>
              </Row>
            </Flex>
          </Form>
        </Drawer>
      )}
    </>
  )
}

export default EditProduct
