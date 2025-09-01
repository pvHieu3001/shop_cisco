import { useNavigate } from 'react-router-dom'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Button, Switch, Select, Drawer, Spin, Row, Col } from 'antd'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { popupError, popupSuccess } from '@/page/shared/Toast'
import { categoryActions } from '@/app/actions'
import { ICategory } from '@/common/types.interface'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'

export default function AddCategory() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isDirty, setIsDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // giả lập loading nếu chưa có biến
  const dispatch = useDispatch()
  const categoryStore = useSelector((state: RootState) => state.category)

  const dataCategories = Array.isArray(categoryStore.dataList)
    ? (categoryStore.dataList as ICategory[]).map((item) => ({
        label: item.name,
        value: item.id
      }))
    : []

  const [imageUrl, setImageUrl] = useState<File>()

  // Lấy danh sách category cha khi mount
  useEffect(() => {
    dispatch(categoryActions.getAdminCategories('') as unknown as AnyAction)
  }, [dispatch])

  // Xác nhận khi rời nếu có thay đổi
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleCancel = () => {
    if (isDirty) {
      Modal.confirm({
        title: 'Bạn có chắc muốn rời khỏi trang?',
        icon: <ExclamationCircleOutlined />,
        content: 'Các thay đổi chưa được lưu sẽ bị mất.',
        onOk: () => navigate('..')
      })
    } else {
      navigate('..')
    }
  }

  const handleSubmit = async () => {
    const name = form.getFieldValue('name')
    const active = form.getFieldValue('status')
    const parent_id = form.getFieldValue('parent_id')
    const formData = new FormData()

    formData.append('name', name)
    formData.append('status', active.toString())
    if (parent_id) {
      formData.append('parentId', parent_id.toString())
    }
    if (imageUrl) {
      formData.append('imageFile', imageUrl)
    }
    try {
      setIsLoading(true)
      await dispatch(categoryActions.createCategory(formData) as unknown as AnyAction)
      await dispatch(categoryActions.getAdminCategories('') as unknown as AnyAction)
      popupSuccess('Thêm danh mục thành công')
      setIsDirty(false)
      navigate('..')
    } catch (error) {
      popupError('Thêm danh mục thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const onValuesChange = () => setIsDirty(true)

  return (
    <Drawer
      width={'70%'}
      title={<span className='font-bold text-xl'>Tạo danh mục mới</span>}
      onClose={handleCancel}
      open={true}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type='primary' htmlType='submit' form='category-form' loading={isLoading}>
            Lưu danh mục
          </Button>
        </div>
      }
    >
      <Spin spinning={isLoading} tip='Đang lưu...'>
        <Form
          id='category-form'
          form={form}
          name='category'
          layout='vertical'
          className='w-full p-6'
          onFinish={handleSubmit}
          onValuesChange={onValuesChange}
          initialValues={{
            parent_id: '',
            status: true
          }}
        >
          <Row gutter={[24, 24]}>
            {/* Cột trái: Ảnh và Cài đặt */}
            <Col xs={24} md={8}>
              <Form.Item
                label={<span className='font-semibold'>Ảnh đại diện</span>}
                className='border-[1px] p-[24px] rounded-md border-[#F1F1F4] bg-[#fafbfc]'
                style={{ boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)' }}
              >
                <div className='flex flex-col items-center'>
                  <label
                    htmlFor='image-upload'
                    className='flex flex-col items-center justify-center w-[180px] h-[180px] border rounded-md cursor-pointer bg-white hover:bg-gray-100'
                  >
                    {imageUrl ? (
                      <div className='relative group w-[180px] h-[180px] mb-2'>
                        <img
                          src={URL.createObjectURL(imageUrl as Blob)}
                          alt='Ảnh danh mục'
                          className='object-cover w-full h-full rounded-md border border-gray-300 bg-white'
                        />
                        <Button
                          type='text'
                          danger
                          icon={<DeleteOutlined />}
                          className='absolute top-1 right-1 opacity-80 hover:opacity-100 bg-white/80 p-1'
                          onClick={() => {
                            setImageUrl(undefined)
                            setIsDirty(true)
                          }}
                        />
                      </div>
                    ) : (
                      <input
                        id='image-upload'
                        type='file'
                        accept='image/*'
                        name='image'
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
                </div>
              </Form.Item>
              <div
                className='border rounded-md overflow-hidden flex-1 bg-[#fafbfc]'
                style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}
              >
                <div className='p-2'>
                  <h2 className='font-semibold'>Cài đặt</h2>
                </div>
                <hr />
                <div className='flex justify-between items-center p-2'>
                  <span>Kích hoạt hiển thị</span>
                  <Form.Item className='m-0' label='' name='status' valuePropName='checked'>
                    <Switch />
                  </Form.Item>
                </div>
                <div className='text-xs text-gray-400 px-2 pb-2'>Bật để danh mục này hiển thị trên website.</div>
              </div>
            </Col>

            {/* Cột phải: Tổng quan */}
            <Col xs={24} md={16}>
              <div
                className='border-[1px] p-[24px] rounded-md bg-[#fafbfc]'
                style={{ boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)' }}
              >
                <h2 className='mb-5 font-bold text-[16px]'>Tổng quan</h2>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name='name'
                      label='Tên danh mục'
                      className='w-full max-w-[350px]'
                      rules={[
                        { required: true, message: 'Vui lòng nhập tên danh mục!' },
                        { max: 120, message: 'Tên không vượt quá 120 ký tự' },
                        { whitespace: true, message: 'Tên danh mục không được để trống!' }
                      ]}
                    >
                      <Input size='large' placeholder='Nhập tên danh mục...' />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name='parent_id' label='Danh mục cha' className='w-full max-w-[250px]'>
                      <Select
                        showSearch
                        style={{ width: '100%', height: 40 }}
                        placeholder='Chọn danh mục cha (nếu có)'
                        optionFilterProp='label'
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[{ value: '', label: 'Không có' }, ...dataCategories]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name='description'
                      label='Mô tả ngắn'
                      rules={[{ max: 300, message: 'Mô tả không vượt quá 300 ký tự' }]}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder='Nhập mô tả ngắn về danh mục...'
                        showCount
                        maxLength={300}
                        size='large'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name='content' label='Nội dung chi tiết'>
                      <Input.TextArea rows={6} placeholder='Nhập nội dung chi tiết...' size='large' />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Drawer>
  )
}
