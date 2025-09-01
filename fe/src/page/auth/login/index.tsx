import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import bgSignup from '../../../assets/images/hero-bg.png'
import { Form, Input } from 'antd'
import { useDispatch } from 'react-redux'
import { popupError, popupSuccess } from '@/page/shared/Toast'
import { userActions } from '@/app/actions'
import { AnyAction } from '@reduxjs/toolkit'

const loginSocials = [
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox='0 0 1024 1024' fill='currentColor' width='1em' height='1em'>
        <path d='M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zm93.09 512h-62.18v248.73h-103.64V512h-51.82v-85.45h51.82v-54.55c0-42.91 20.36-109.09 109.09-109.09l80 0v85.45h-58.18c-9.09 0-21.82 4.36-21.82 23.64v54.55h80l-10.91 85.45z' />
      </svg>
    )
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg viewBox='0 0 1024 1024' fill='currentColor' width='1em' height='1em'>
        <path d='M1024 194.6c-37.7 16.7-78.2 28-120.8 33.1 43.4-26 76.7-67.2 92.4-116.4-40.6 24.1-85.6 41.6-133.4 51-38.3-40.8-92.9-66.3-153.3-66.3-116 0-210.1 94-210.1 210.1 0 16.5 1.9 32.6 5.5 48-174.6-8.8-329.4-92.4-433.1-219.5-18.1 31-28.5 67-28.5 105.4 0 72.7 37 136.9 93.2 174.6-34.3-1.1-66.6-10.5-94.9-26.2v2.6c0 101.6 72.3 186.4 168.2 205.7-17.6 4.8-36.1 7.4-55.2 7.4-13.5 0-26.6-1.3-39.4-3.8 26.6 83.1 103.9 143.6 195.5 145.2-71.6 56.1-161.9 89.5-260 89.5-16.9 0-33.6-1-50-2.9 92.6 59.4 202.6 94 320.7 94 384.9 0 595.7-318.9 595.7-595.7 0-9.1-0.2-18.2-0.6-27.2 40.9-29.5 76.3-66.4 104.3-108.5z' />
      </svg>
    )
  },
  {
    name: 'Google',
    href: '#',
    icon: (
      <svg viewBox='0 0 533.5 544.3' fill='currentColor' width='1em' height='1em'>
        <path
          d='M533.5 278.4c0-17.4-1.5-34.1-4.3-50.4H272v95.3h146.9c-6.3 34.1-25.1 62.9-53.5 82.2v68.2h86.4c50.6-46.6 81.7-115.3 81.7-195.3z'
          fill='#4285F4'
        />
        <path
          d='M272 544.3c73.8 0 135.6-24.4 180.8-66.3l-86.4-68.2c-24.1 16.2-55 25.7-94.4 25.7-72.6 0-134.1-49-156.1-114.8H28.1v71.9C73.9 475.1 166.6 544.3 272 544.3z'
          fill='#34A853'
        />
        <path
          d='M115.9 320.7c-10.5-31.4-10.5-65.2 0-96.6V152.2H28.1c-42.3 83.9-42.3 182.1 0 266l87.8-67.5z'
          fill='#FBBC05'
        />
        <path
          d='M272 107.7c39.9-.6 78.4 14.3 107.8 41.3l80.4-80.4C407.6 24.4 345.8 0 272 0 166.6 0 73.9 69.2 28.1 152.2l87.8 71.9C137.9 156.7 199.4 107.7 272 107.7z'
          fill='#EA4335'
        />
      </svg>
    )
  }
]

const Login = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async () => {
    const data = {
      username: form.getFieldValue('username'),
      password: form.getFieldValue('password')
    }
    try {
      await dispatch(userActions.login(data) as unknown as AnyAction)
      popupSuccess('Đăng nhập thành công')
      navigate('/admin')
    } catch (error) {
      popupError('Đăng nhập thất bại')
    }
  }

  return (
    <div
      className='nc-PageLogin relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage: `url(${bgSignup})`
      }}
    >
      <Helmet>
        <title>Đăng nhập || Chia Sẻ Khóa Học</title>
      </Helmet>

      <div className='w-full max-w-md space-y-8'>
        <h2 className='text-center text-3xl font-bold text-neutral-800 dark:text-neutral-100'>Đăng nhập</h2>

        <div className='space-y-3'>
          {loginSocials.map((item, index) => (
            <button
              key={index}
              className='flex items-center w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition'
            >
              <span className='text-xl mr-3 text-neutral-700 dark:text-neutral-200'>{item.icon}</span>
              <span className='text-sm font-medium text-neutral-700 dark:text-neutral-200'>{item.name}</span>
            </button>
          ))}
        </div>

        <div className='relative text-center my-6'>
          <span className='relative z-10 bg-neutral-50 dark:bg-neutral-950 px-4 text-sm text-neutral-500 dark:text-neutral-400'>
            Hoặc đăng nhập bằng tài khoản
          </span>
          <div className='absolute top-1/2 left-0 w-full border-t border-neutral-200 dark:border-neutral-700 transform -translate-y-1/2'></div>
        </div>

        <Form
          id='login-form'
          form={form}
          name='loginForm'
          layout='vertical'
          className='space-y-6'
          onFinish={handleSubmit}
        >
          <label className='block'>
            <span className='text-neutral-700 dark:text-neutral-200'>Email</span>
            <Form.Item
              name='username'
              className='w-full'
              rules={[
                { required: true, message: 'Vui lòng nhập tên tài khoản!' },
                { whitespace: true, message: 'Tên tài khoản không được để trống!' }
              ]}
            >
              <Input
                size='large'
                placeholder='example@example.com'
                className='!text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500'
              />
            </Form.Item>
          </label>

          <label className='block'>
            <span className='flex justify-between items-center text-neutral-700 dark:text-neutral-200'>
              Mật khẩu
              <Link to='/forgot-pass' className='text-sm text-green-600 hover:underline'>
                Quên mật khẩu?
              </Link>
            </span>
            <Form.Item
              name='password'
              className='w-full text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500'
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { whitespace: true, message: 'Mật khẩu không được để trống!' }
              ]}
            >
              <Input
                size='large'
                type='password'
                placeholder='Mật khẩu'
                className='!text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500'
              />
            </Form.Item>
          </label>

          <button
            type='submit'
            className='w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'
          >
            Tiếp tục
          </button>
        </Form>

        <p className='text-center text-sm text-neutral-600 dark:text-neutral-400'>
          Chưa có tài khoản?{' '}
          <Link to='/signup' className='text-green-600 hover:underline'>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
