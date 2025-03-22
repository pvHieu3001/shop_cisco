import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from '../../../feature/ScrollToTop'
import SiteHeader from './SiteHeader'
import './styles/index.scss'
import '../../../fonts/line-awesome-1.3.0/css/line-awesome.css'
import 'rc-slider/assets/index.css'
import Footer from './shared/Footer/Footer'

function Base() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Đồ Gỗ Hiệp Hồng</title>
        <meta name='description' content='Đồ Gỗ Hiệp Hồng' />
        <meta name='google-site-verification' content='T9IaRbRYVAYLaOMteD3gLMso6FUu62Kkyu7ORBpDrqw' />
      </Helmet>

      {/* MAIN APP */}
      <div className='bg-white text-base dark:bg-slate-900 text-slate-900 dark:text-slate-200'>
        <Toaster />
        <ScrollToTop />
        <SiteHeader />
        <Outlet />
        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default Base
