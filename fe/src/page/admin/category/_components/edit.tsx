import { useNavigate, useParams } from 'react-router-dom'
import { DeleteOutlined } from '@ant-design/icons'
import { Form, Input, Button, Switch, Select, Drawer, Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import { popupError, popupSuccess } from '@/page/shared/Toast'
import ErrorLoad from '../../components/util/ErrorLoad'
import { useDispatch, useSelector } from 'react-redux'
import { categoryActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'
import { ICategory } from '@/common/types.interface'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, Spin } from 'antd'
import { RootState } from '@/app/store'
import { getImageUrl } from '@/utils/getImageUrl'

export default function EditCategory() {
  const params = useParams()
  const dispatch = useDispatch()
  const categoryStore = useSelector((state: RootState) => state.category)
  useEffect(() => {
    dispatch(categoryActions.getCategoryById(params.id ?? '0') as unknown as AnyAction)
    dispatch(categoryActions.getAdminCategories('') as unknown as AnyAction)
  }, [dispatch, params.id])

  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isDirty, setIsDirty] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataCategories = Array.isArray(categoryStore.dataList)
    ? (categoryStore.dataList as ICategory[])
        .filter((item) => item.id !== parseInt(params.id ?? '0'))
        .map((item) => ({
          label: item.name,
          value: item.id.toString()
        }))
    : []

  const [imageUrl, setImageUrl] = useState<File>()
  const [displayPic, setDisplayPic] = useState<string>()

  useEffect(() => {
    if (categoryStore.data) {
      const data = categoryStore.data as ICategory
      if (data.image) setDisplayPic(getImageUrl(data.image))

      form.setFieldsValue({
        parent_id: data.parentId ? data.parentId.toString() : '',
        status: data.status,
        name: data.name,
        description: data.description,
        content: data.content,
        isQuickView: data.isQuickView
      })
    }
  }, [categoryStore, dataCategories, form])

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
    formData.append('isQuickView', form.getFieldValue('isQuickView'))
    formData.append('content', form.getFieldValue('content'))
    formData.append('description', form.getFieldValue('description'))
    if (parent_id) {
      formData.append('parentId', parent_id.toString())
    }

    if (imageUrl) {
      formData.append('imageFile', imageUrl)
    }

    try {
      await dispatch(categoryActions.updateCategory(params.id, formData) as unknown as AnyAction)
      await dispatch(categoryActions.getAdminCategories('') as unknown as AnyAction)
      popupSuccess('Cập nhật danh mục thành công')
      setIsDirty(false)
      navigate('..')
    } catch (error) {
      console.error('Error updating category:', error)
      popupError('Cập nhật danh mục thất bại')
    }
  }

  // Đánh dấu form đã thay đổi
  const onValuesChange = () => setIsDirty(true)

  if (categoryStore.error_message) {
    return <ErrorLoad />
  }
  return (
    <Drawer
      width='70%'
      title={<span className='font-bold text-xl'>Chỉnh sửa danh mục</span>}
      onClose={handleCancel}
      open={true}
      bodyStyle={{ padding: 24, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type='primary' htmlType='submit' form='category-form' loading={categoryStore.isLoading}>
            Cập nhật
          </Button>
        </div>
      }
    >
      <Spin spinning={categoryStore.isLoading} tip='Đang tải...'>
        {categoryStore.data && (
          <Form
            id='category-form'
            form={form}
            name='category'
            layout='vertical'
            onFinish={handleSubmit}
            onValuesChange={onValuesChange}
            initialValues={{}}
          >
            <Row gutter={[24, 24]}>
              {/* Cột trái: Ảnh và Cài đặt */}
              <Col xs={24} md={8}>
                <Form.Item
                  label={<span className='font-semibold'>Ảnh đại diện</span>}
                  className='border p-6 rounded-md bg-[#fafbfc]'
                  style={{ boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.03)' }}
                >
                  <div className='flex flex-col items-center'>
                    <label
                      htmlFor='image-upload'
                      className='flex flex-col items-center justify-center w-[180px] h-[180px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100'
                    >
                      {!imageUrl && displayPic && (
                        <div className='h-[180px] w-[180px] rounded-lg overflow-hidden relative'>
                          <img
                            src={displayPic}
                            alt='Ảnh hiện tại'
                            className='object-cover h-full w-full object-center rounded-lg border border-gray-300 bg-white'
                          />
                        </div>
                      )}
                      {imageUrl ? (
                        <div className='relative group w-[180px] h-[180px] mb-2'>
                          <img
                            src={URL.createObjectURL(imageUrl as Blob)}
                            alt='Ảnh danh mục'
                            className='object-cover w-full h-full rounded-lg border shadow'
                          />
                          <Button
                            type='text'
                            danger
                            icon={<DeleteOutlined />}
                            className='absolute top-2 right-2 opacity-80 hover:opacity-100 bg-white/80'
                            onClick={() => {
                              setDisplayPic('')
                              setImageUrl(undefined)
                              setIsDirty(true)
                            }}
                          >
                            Xóa
                          </Button>
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
                  className='border rounded-md bg-[#fafbfc] overflow-hidden'
                  style={{ boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.05)' }}
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

                  <div className='flex justify-between items-center p-2'>
                    <span>Hiện thị trên trang chủ</span>
                    <Form.Item className='m-0' label='' name='isQuickView' valuePropName='checked'>
                      <Switch />
                    </Form.Item>
                  </div>
                </div>
              </Col>

              {/* Cột phải: Tổng quan */}
              <Col xs={24} md={16}>
                <div
                  className='border p-6 rounded-md bg-[#fafbfc]'
                  style={{ boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.03)' }}
                >
                  <h2 className='mb-5 font-bold text-[16px]'>Tổng quan</h2>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name='name'
                        label='Tên danh mục'
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
                      <Form.Item name='parent_id' label='Danh mục cha'>
                        <Select
                          showSearch
                          loading={categoryStore.isLoading}
                          placeholder='Chọn danh mục cha (nếu có)'
                          optionFilterProp='label'
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={[{ value: '', label: 'Không có' }, ...dataCategories]}
                          allowClear
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
        )}
      </Spin>
    </Drawer>
  )
}
