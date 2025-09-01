import { useState } from 'react'
import { Form, Input, Button } from 'antd'
import Joi from 'joi'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { popupError, popupSuccess } from '../../shared/Toast'
import { userActions } from '@/app/actions'
import bgSignup from '../../../assets/images/hero-bg.png'
import { IRegister } from '@/common/types.interface'
import { AnyAction } from '@reduxjs/toolkit'

const validationSchema = Joi.object({
  firstname: Joi.string().required().messages({
    'any.required': 'Họ là bắt buộc',
    'string.empty': 'Họ không được để trống'
  }),
  lastname: Joi.string().required().messages({
    'any.required': 'Tên là bắt buộc',
    'string.empty': 'Tên không được để trống'
  }),
  username: Joi.string().min(6).required().messages({
    'string.min': 'Tên người dùng phải có ít nhất 6 ký tự',
    'any.required': 'Tên người dùng là bắt buộc',
    'string.empty': 'Tên người dùng không được để trống'
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Địa chỉ email không hợp lệ',
      'any.required': 'Địa chỉ email là bắt buộc',
      'string.empty': 'Email không được để trống'
    }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'any.required': 'Mật khẩu là bắt buộc',
    'string.empty': 'Mật khẩu không được để trống'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Xác nhận mật khẩu không khớp',
    'any.required': 'Xác nhận mật khẩu là bắt buộc',
    'string.empty': 'Xác nhận mật khẩu không được để trống'
  })
})

const SignUp = () => {
  const [form] = Form.useForm()
  const [isLoadingSignUp, setLoadingSignUp] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleFinish = async (values: any) => {
    const { error } = validationSchema.validate(values, { abortEarly: false })
    if (error) {
      const formattedErrors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message
        return acc
      }, {} as Record<string, string>)
      form.setFields(
        Object.entries(formattedErrors).map(([name, message]) => ({
          name,
          errors: [message]
        }))
      )
      return
    }

    const payload: IRegister = {
      username: values.username,
      email: values.email,
      password: values.password,
      firstname: values.firstname,
      lastname: values.lastname
    }

    try {
      setLoadingSignUp(true)
      await dispatch(userActions.signup(payload) as unknown as AnyAction)
      popupSuccess('Đăng ký thành công!')
      navigate('/login')
    } catch (err) {
      popupError('Đăng ký thất bại')
    } finally {
      setLoadingSignUp(false)
    }
  }

  return (
    <div
      className='nc-PageLogin relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${bgSignup})` }}
    >
      <Helmet>
        <title>Đăng Ký || Chia Sẻ Khóa Học</title>
      </Helmet>

      <div className='w-full max-w-md space-y-8 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg'>
        <h2 className='text-center text-3xl font-bold text-neutral-800 dark:text-neutral-100'>Đăng ký</h2>

        <Form form={form} layout='vertical' onFinish={handleFinish}>
          <Form.Item label='Họ' name='firstname'>
            <Input placeholder='Nguyễn' />
          </Form.Item>

          <Form.Item label='Tên' name='lastname'>
            <Input placeholder='Văn A' />
          </Form.Item>

          <Form.Item label='Tên người dùng' name='username'>
            <Input placeholder='Nhập tên người dùng' />
          </Form.Item>

          <Form.Item label='Email' name='email'>
            <Input placeholder='example@example.com' />
          </Form.Item>

          <Form.Item label='Mật khẩu' name='password'>
            <Input.Password placeholder='*******' />
          </Form.Item>

          <Form.Item label='Xác nhận mật khẩu' name='confirmPassword'>
            <Input.Password placeholder='*******' />
          </Form.Item>

          <Button
            type='primary'
            htmlType='submit'
            loading={isLoadingSignUp}
            block
            className='bg-green-600 hover:bg-green-700'
          >
            {isLoadingSignUp ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default SignUp
