import React from 'react'
import { ReloadOutlined, DisconnectOutlined } from '@ant-design/icons'
import { DOMAIN_URL } from '@/common/constants'

const NetworkErrorPage: React.FC = () => {
  const handleReload = () => {
    window.location.href = `${DOMAIN_URL}`
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center'>
        <DisconnectOutlined className='text-red-500 text-6xl mb-6' />
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Không thể kết nối đến máy chủ</h1>
        <p className='text-gray-600 mb-6'>Vui lòng kiểm tra kết nối mạng hoặc thử tải lại trang.</p>
        <button
          onClick={handleReload}
          className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
        >
          <ReloadOutlined />
          Tải lại
        </button>
      </div>
    </div>
  )
}

export default NetworkErrorPage
