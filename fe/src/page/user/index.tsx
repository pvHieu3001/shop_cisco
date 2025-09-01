import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from '../../utils/ScrollToTop'
import '../../assets/fonts/line-awesome-1.3.0/css/line-awesome.css'
import styles from './styles.module.css'
import Header from './components/Header'
import { Helmet } from 'react-helmet-async'
import Footer from './components/Footer'
import { useState } from 'react'

function Base() {
  const [isShowRecommendProducts, setIsShowRecommendProducts] = useState(true)
  return (
    <>
      <div className={styles.modules}>
        <Helmet>
          <title>Đồ Gỗ Hiệp Hồng</title>
          <meta name='description' content='Đồ Gỗ Hiệp Hồng' />
          <meta name='google-site-verification' content='T9IaRbRYVAYLaOMteD3gLMso6FUu62Kkyu7ORBpDrqw' />
        </Helmet>

        <Toaster />
        <ScrollToTop />
        <main className={styles.container}>
          <Header isShowRecommendProducts={isShowRecommendProducts} />
          <Outlet context={{ setIsShowRecommendProducts }} />
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Base
