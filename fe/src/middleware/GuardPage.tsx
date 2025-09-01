import { useEffect, useState } from 'react'
import { popupError } from '@/page/shared/Toast'
import { Navigate, Outlet } from 'react-router-dom'
import { LOCAL_STORAGE_TOKEN } from '@/common/constants'

export default function GuardPage() {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (!token) {
      popupError('Vui lòng đăng nhập trước!')
      setShowError(true)
    }
  }, [token])

  if (!token && showError) {
    return <Navigate to='/login' />
  }

  return <Outlet />
}
