/* eslint-disable react-refresh/only-export-components */
import {
  Col,
  Flex,
  Row,
  Button,
  Form,
  Input,
  Drawer,
  UploadProps,
  GetProp,
  InputNumber,
  Card,
  Divider,
  Select
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { popupError, popupSuccess } from '@/page/shared/Toast'
import ReactQuill from 'react-quill'
import { useDispatch, useSelector } from 'react-redux'
import { courseActions } from '@/app/actions/course.actions'
import { AnyAction } from '@reduxjs/toolkit'
import TextEditor from '../../components/TextEditor/QuillEditor'
import { RootState } from '@/app/store'

interface gallery {
  image: File | string
  displayPic: File | string
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

function EditProduct() {
  const { flug } = useParams()
  const dispatch = useDispatch()
  const courseStore = useSelector((state: RootState) => state.course)
  const [form] = Form.useForm()
  const [gallery, setGallery] = useState<Array<gallery>>([])
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const numberFile = useRef<number>(0)

  useEffect(() => {
    if (flug) {
      dispatch(courseActions.getCourseById(flug) as unknown as AnyAction)
    }
  }, [flug])

  useEffect(() => {
    if (courseStore.data && courseStore.data.gallery) {
      const initDataGalleries = courseStore.data.gallery.map((item: any) => ({
        image: '',
        displayPic: item.image
      }))
      setGallery(initDataGalleries)
    }
  }, [courseStore.data])

  const onFinish = async () => {
    const id = courseStore.data?.id
    const name = form.getFieldValue('name')
    const category_id = form.getFieldValue('category_id')
    const description = form.getFieldValue('description')
    const image_url = form.getFieldValue('image_url')
    const language = form.getFieldValue('language')
    const level = form.getFieldValue('level')
    const price = form.getFieldValue('price')
    const rating = form.getFieldValue('rating')
    const slug = form.getFieldValue('slug')
    const source_url = form.getFieldValue('source_url')
    const status = form.getFieldValue('status')
    const total_rating = form.getFieldValue('total_rating')
    const total_students = form.getFieldValue('total_students')

    const formdata = new FormData()
    formdata.append('id', id)
    formdata.append('name', name)
    formdata.append('category_id', category_id)
    formdata.append('description', description)
    formdata.append('image_url', image_url)
    formdata.append('language', language)
    formdata.append('level', level)
    formdata.append('price', String(price))
    formdata.append('rating', String(rating))
    formdata.append('slug', slug)
    formdata.append('source_url', source_url)
    formdata.append('status', status)
    formdata.append('total_rating', String(total_rating))
    formdata.append('total_students', String(total_students))

    try {
      await dispatch(courseActions.updateCourse(id, formdata) as unknown as AnyAction)
      popupSuccess('Cập nhật khóa học thành công')
      navigate('..')
    } catch (error) {
      popupError('Cập nhật khóa học thất bại')
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

  const selectGallery = async (e: any) => {
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
      {courseStore.data && !courseStore.isLoading && (
        <Drawer
          open={true}
          title={
            <>
              <h2 className=' font-bold text-[24px]'>Cập nhật khóa học</h2>
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
              id: courseStore.data?.id,
              created_at: courseStore.data?.created_at,
              created_by: courseStore.data?.created_by,
              updated_at: courseStore.data?.updated_at,
              updated_by: courseStore.data?.updated_by,
              category_id: courseStore.data?.category_id,
              description: courseStore.data?.description,
              image_url: courseStore.data?.image_url,
              language: courseStore.data?.language,
              level: courseStore.data?.level,
              name: courseStore.data?.name,
              price: courseStore.data?.price,
              rating: courseStore.data?.rating,
              slug: courseStore.data?.slug,
              source_url: courseStore.data?.source_url,
              status: courseStore.data?.status,
              total_rating: courseStore.data?.total_rating,
              total_students: courseStore.data?.total_students
            }}
          >
            <Card title='Thông tin hệ thống' size='small' style={{ marginBottom: 24, background: '#fafafa' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name='created_at' label='Ngày tạo'>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='created_by' label='Người tạo'>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='updated_at' label='Ngày cập nhật'>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='updated_by' label='Người cập nhật'>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title='Thông tin khoá học' size='small' style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='name'
                    label='Tên khoá học'
                    rules={[{ required: true, message: 'Vui lòng nhập tên khoá học!' }]}
                  >
                    <Input placeholder='Nhập tên khoá học' />
                  </Form.Item>
                  <Form.Item name='slug' label='Slug'>
                    <Input placeholder='Nhập slug' />
                  </Form.Item>
                  <Form.Item name='category_id' label='Danh mục'>
                    <Input placeholder='Nhập ID danh mục' />
                  </Form.Item>
                  <Form.Item name='description' label='Mô tả'>
                    <Input.TextArea rows={3} placeholder='Nhập mô tả' />
                  </Form.Item>
                  <Form.Item name='image_url' label='Ảnh đại diện'>
                    <Input placeholder='Nhập URL ảnh' />
                  </Form.Item>
                  <Form.Item name='source_url' label='Nguồn video'>
                    <Input placeholder='Nhập URL nguồn video' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='language' label='Ngôn ngữ'>
                    <Select placeholder='Chọn ngôn ngữ'>
                      <Select.Option value='vi'>Tiếng Việt</Select.Option>
                      <Select.Option value='en'>English</Select.Option>
                      <Select.Option value='jp'>日本語</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name='level' label='Trình độ'>
                    <Select placeholder='Chọn trình độ'>
                      <Select.Option value='beginner'>Beginner</Select.Option>
                      <Select.Option value='intermediate'>Intermediate</Select.Option>
                      <Select.Option value='advanced'>Advanced</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name='price' label='Giá'>
                    <InputNumber className='w-full' min={0} placeholder='Nhập giá' />
                  </Form.Item>
                  <Form.Item name='rating' label='Đánh giá'>
                    <InputNumber className='w-full' min={0} max={5} step={0.1} placeholder='Nhập điểm đánh giá' />
                  </Form.Item>
                  <Form.Item name='total_rating' label='Tổng số đánh giá'>
                    <InputNumber className='w-full' min={0} placeholder='Nhập tổng số đánh giá' />
                  </Form.Item>
                  <Form.Item name='total_students' label='Tổng số học viên'>
                    <InputNumber className='w-full' min={0} placeholder='Nhập tổng số học viên' />
                  </Form.Item>
                  <Form.Item name='status' label='Trạng thái'>
                    <Select placeholder='Chọn trạng thái'>
                      <Select.Option value='active'>Hoạt động</Select.Option>
                      <Select.Option value='inactive'>Không hoạt động</Select.Option>
                      <Select.Option value='draft'>Bản nháp</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Divider orientation='left'>Nội dung chi tiết</Divider>
            <Card size='small' style={{ marginBottom: 24 }}>
              <Form.Item name='content' label='Nội dung'>
                <TextEditor content={courseStore.data?.content ?? ''} onHandleChange={() => {}} />
              </Form.Item>
              <Form.Item name='detail' label='Mô tả chi tiết'>
                <ReactQuill modules={modules} formats={formats} theme='snow' className='h-[200px]' />
              </Form.Item>
            </Card>
            <Divider orientation='left'>Ảnh & Gallery</Divider>
            <Card size='small' style={{ marginBottom: 24 }}>
              {/* Gallery giữ nguyên như cũ */}
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
            </Card>
            <Flex className='fixed z-[10000000] top-[15px] right-10' gap={20}>
              <Button
                loading={courseStore.isLoading}
                disabled={courseStore.isLoading}
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

// Định nghĩa modules và formats cho ReactQuill nếu chưa có
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
}
const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'link', 'image']
export default EditProduct
