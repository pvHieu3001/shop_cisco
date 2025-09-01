import { Outlet } from 'react-router-dom'
import { Snackbar, Alert } from '@mui/material'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { RootState } from '@/app/store'
import { HelmetProvider } from 'react-helmet-async'

const Layout = () => {
  const alert = useSelector((state: RootState) => state.alert)

  const [state, setState] = useState({
    openSnackbar: false
  })
  const { openSnackbar } = state

  const handleSnackbarOpen = () => {
    setState({ ...state, openSnackbar: true })
  }

  const handleSnackbarClose = () => {
    setState({ ...state, openSnackbar: false })
  }

  useEffect(() => {
    if (alert.message) {
      handleSnackbarOpen()
    }
  }, [alert])

  return (
    <HelmetProvider>
      <Outlet />
      {alert.message && (
        <Snackbar
          autoHideDuration={10000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={openSnackbar}
          onClose={handleSnackbarClose}
          key='personnelpage-snackbar'
        >
          <Alert onClose={handleSnackbarClose} severity={alert.type}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </HelmetProvider>
  )
}

export default Layout
