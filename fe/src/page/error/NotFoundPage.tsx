import React from 'react'
import { Link } from 'react-router-dom'
import { FrownOutlined } from '@ant-design/icons'

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <FrownOutlined className="text-6xl text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404 - Không tìm thấy trang</h1>
        <p className="text-gray-600 mb-6">
          Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
