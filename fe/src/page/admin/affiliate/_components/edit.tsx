import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, Button, Switch, Drawer, Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import { popupError, popupSuccess } from '@/page/shared/Toast'
import ErrorLoad from '../../components/util/ErrorLoad'
import { useDispatch, useSelector } from 'react-redux'
import { affiliateActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'
import { IAffiliate } from '@/common/types.interface'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, Spin } from 'antd'
import { RootState } from '@/app/store'

export default function EditAffiliate() {
  const params = useParams()
  const dispatch = useDispatch()
  const affiliateStore = useSelector((state: RootState) => state.affiliate)
  useEffect(() => {
    dispatch(affiliateActions.getAffiliateById(params.id ?? '0') as unknown as AnyAction)
    dispatch(affiliateActions.getAdminAffiliates('') as unknown as AnyAction)
  }, [dispatch, params.id])

  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (affiliateStore.data) {
      const data = affiliateStore.data as IAffiliate

      form.setFieldsValue({
        targetUrl: data.targetUrl,
        status: data.status,
        name: data.name,
        price: data.price,
        originalPrice: data.originalPrice,
        image: data.image
      })
    }
  }, [affiliateStore, form])

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
    const formData = new FormData()

    formData.append('name', name)
    formData.append('status', active.toString())
    formData.append('targetUrl', form.getFieldValue('image'))
    formData.append('image', form.getFieldValue('image'))
    formData.append('price', form.getFieldValue('price'))
    formData.append('originalPrice', form.getFieldValue('originalPrice'))

    try {
      await dispatch(affiliateActions.updateAffiliate(params.id, formData) as unknown as AnyAction)
      await dispatch(affiliateActions.getAdminAffiliates('') as unknown as AnyAction)
      popupSuccess('Cập nhật link afiliate thành công')
      setIsDirty(false)
      navigate('..')
    } catch (error) {
      console.error('Error updating afiliate:', error)
      popupError('Cập nhật link afiliate thất bại')
    }
  }

  // Đánh dấu form đã thay đổi
  const onValuesChange = () => setIsDirty(true)

  if (affiliateStore.error_message) {
    return <ErrorLoad />
  }
  return (
    <Drawer
      width='70%'
      title={<span className='font-bold text-xl'>Chỉnh sửa link afiliate</span>}
      onClose={handleCancel}
      open={true}
      bodyStyle={{ padding: 24, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type='primary' htmlType='submit' form='affiliate-form' loading={affiliateStore.isLoading}>
            Cập nhật
          </Button>
        </div>
      }
    >
      <Spin spinning={affiliateStore.isLoading} tip='Đang tải...'>
        {affiliateStore.data && (
          <Form
            id='affiliate-form'
            form={form}
            name='affiliate'
            layout='vertical'
            onFinish={handleSubmit}
            onValuesChange={onValuesChange}
            initialValues={{}}
          >
            <Row gutter={[24, 24]}>
              {/* Cột trái: Ảnh và Cài đặt */}
              <Col xs={24} md={8}>
                <Form.Item
                  label={<span className='font-semibold'>Link ảnh sản phẩm</span>}
                  className='border p-6 rounded-md bg-[#fafbfc]'
                  style={{ boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.03)' }}
                  name='image'
                >
                  <Input size='large' placeholder='Nhập tên link ảnh afiliate...' />
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
                  <div className='text-xs text-gray-400 px-2 pb-2'>Bật để link afiliate này hiển thị trên website.</div>

                  <div className='flex justify-between items-center p-2'>
                    <span>Hiện thị trên trang chủ</span>
                    <Form.Item className='m-0' label='' name='isQuickView' valuePropName='checked'>
                      <Switch />
                    </Form.Item>
                  </div>
                </div>
              </Col>

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
                        label='Tên link afiliate'
                        className='w-full max-w-[350px]'
                        rules={[
                          { required: true, message: 'Vui lòng nhập tên link afiliate!' },
                          { max: 120, message: 'Tên không vượt quá 120 ký tự' },
                          { whitespace: true, message: 'Tên link afiliate không được để trống!' }
                        ]}
                      >
                        <Input size='large' placeholder='Nhập tên link afiliate...' />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name='targetUrl'
                        label='Mô tả ngắn'
                        rules={[{ max: 120, message: 'Mô tả không vượt quá 120 ký tự' }]}
                      >
                        <Input size='large' placeholder='Nhập link afiliate...' />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name='price' label='Giá khuyến mãi'>
                        <Input size='large' placeholder='Nhập giá khuyến mãi...' />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name='originalPrice' label='Giá gốc'>
                        <Input size='large' placeholder='Nhập giá gốc...' />
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
