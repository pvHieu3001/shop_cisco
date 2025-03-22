import React, { FC, useEffect, useRef, useState } from 'react'
import { NoSymbolIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline'
import ButtonPrimary from '../shared/Button/ButtonPrimary'
import NcImage from '../shared/NcImage/NcImage'
import ModalPhotos from './ModalPhotos'
import ReviewItem from '../components/ReviewItem'
import { COLOR, MATERIAL } from '../../../../data/data'
import IconDiscount from '../components/IconDiscount'
import NcInputNumber from '../components/NcInputNumber'
import BagIcon from '../components/BagIcon'
import Policy from './Policy'
import toast from 'react-hot-toast'
import SectionSliderProductCard from '../components/SectionSliderProductCard'
import ModalViewAllReviews from './ModalViewAllReviews'
import NotifyAddTocart from '../components/NotifyAddTocart'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, Controller } from 'swiper/modules'
import 'swiper/css'
import SwiperCore from 'swiper'
import '../../../../styles/base/ant.scss'
import { useGetProductQuery } from '../../../../services/ProductsEndpoints'
import { useParams } from 'react-router-dom'
import { VND } from '@/utils/formatVietNamCurrency'
import { useAddToCartMutation } from '@/services/CartEndPoinst'
import { ICart } from '@/common/types/cart.interface'
import { Button, Col, List, Modal, Rate, Row, Skeleton } from 'antd'
import Joi from 'joi'
interface CommentFormValues {
  content: string
  rate: number
}

const commentSchema = Joi.object({
  content: Joi.string().min(5).max(500).required().messages({
    'string.empty': 'Nội dung không được để trống',
    'string.min': 'Nôi dung tối thiểu 5 ký tự',
    'string.max': 'Nội dung tối đa 5 ký tự'
  }),
  rate: Joi.number().min(1).max(5).required().messages({
    'number.empty': 'Vui lòng đánh giá sản phẩm',
    'number.min': 'Vui lòng đánh giá sản phẩm',
    'number.max': 'Vui lòng đánh giá sản phẩm',
    'any.required': 'Vui lòng đánh giá sản phẩm'
  })
})
import Textarea from '../shared/Textarea/Textarea'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useGetCommentsQuery, usePostCommentMutation } from '@/services/CommentEndPoints'
import { popupError } from '../../shared/Toast'
import { formatDate } from '@/utils/convertCreatedLaravel'
import { useLocalStorage } from '@uidotdev/usehooks'
import { IProduct } from '@/common/types/product.interface'
export interface ProductDetailPage2Props {
  className?: string
}

const ProductDetailPage2: FC<ProductDetailPage2Props> = ({ className = '' }) => {
  const [user] = useLocalStorage('user', null)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<CommentFormValues>({
    resolver: joiResolver(commentSchema)
  })
  const rateCurrent = watch('rate')
  const [postComment] = usePostCommentMutation()
  const { slug } = useParams()
  const { data, isLoading } = useGetProductQuery(slug)
  const productId = data?.data?.id
  const { data: listComments } = useGetCommentsQuery(productId, { skip: !productId })
  const dataProduct = data?.data
  const [qualitySelected, setQualitySelected] = React.useState(1)
  const [activeThumb, setActiveThumb] = React.useState<SwiperCore | null>()
  const [thumb, setThumb] = useState('')
  const swiperRef = useRef(null)
  const [openDetail, setOpenDetail] = useState(false)
  const [openContent, setOpenContent] = useState(false)
  const [product, setProduct] = useState<IProduct>()
  const [addToCart] = useAddToCartMutation()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] = useState(false)
  const [openFocusIndex, setOpenFocusIndex] = useState(0)

  const handleOpenModal = (index: number) => {
    setIsOpen(true)
    setOpenFocusIndex(index)
  }

  const handleCloseModal = () => setIsOpen(false)

  useEffect(() => {
    if (data) {
      setThumb(data?.data?.thumbnail)
      setProduct(data?.data)
    }
  }, [isLoading, data])

  const notifyAddTocart = async () => {
    const { id, thumbnail, name, price, price_sale, slug } = data.data

    const payload: ICart = {
      quantity: qualitySelected,
      id: id,
      name: name,
      slug: slug,
      thumbnail: thumbnail,
      user_id: user ? user.id : null,
      price: price,
      price_sale: price_sale
    }

    if (user) {
      await addToCart(payload).unwrap()
    } else {
      const cartJs = localStorage.getItem('cart')
      if (cartJs && cartJs != '[]') {
        const cart = JSON.parse(cartJs)
        const indexToUpdate = cart.findIndex((item) => item.id == id)
        if (indexToUpdate >= 0) {
          cart[indexToUpdate].quantity = qualitySelected + cart[indexToUpdate].quantity
          localStorage.setItem('cart', JSON.stringify(cart))
        } else {
          localStorage.setItem('cart', JSON.stringify([...cart, payload]))
        }
      } else {
        localStorage.setItem('cart', JSON.stringify([payload]))
      }
    }

    toast.custom(
      (t) => (
        <NotifyAddTocart
          productImage={thumbnail}
          qualitySelected={qualitySelected}
          show={t.visible}
          product={data.data}
          name={name}
        />
      ),
      { position: 'top-right', id: 'nc-product-notify', duration: 3000 }
    )
  }
  const onSubmit = async (data: CommentFormValues) => {
    try {
      const payload = {
        product_id: dataProduct.id,
        content: data.content,
        rating: data.rate
      }
      await postComment(payload).unwrap()
      reset()
      setValue('rate', 0)
    } catch (error) {
      popupError('* Lỗi bình luận sản phẩm')
    }
  }
  const renderVariants = () => {
    return (
      <div>
        <div className='flex justify-between font-medium text-lg'>
          <label htmlFor=''>
            <span className='ml-1 font-semibold'>Màu Sắc</span>
          </label>
        </div>
        <div className='grid grid-cols-1 gap-2 mt-1'>
          <div
            className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center text-xs bg-[${data?.data?.color}] uppercase font-semibold select-none overflow-hidden border-2 z-0 text-opacity-20 dark:text-opacity-20 cursor-not-allowed border-zinc-500 hover:bg-gray`}
          >
            {COLOR.find((x) => x.value === data?.data?.color)?.label}
          </div>
        </div>
        <div className='flex justify-between font-medium text-lg mt-2'>
          <label htmlFor=''>
            <span className='ml-1 font-semibold'>Chất liệu</span>
          </label>
        </div>
        <div className='grid grid-cols-1 gap-2 mt-1'>
          <div className='relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center text-xs uppercase font-semibold select-none overflow-hidden border-2 z-0 text-opacity-20 dark:text-opacity-20 cursor-not-allowed border-zinc-500 hover:bg-gray'>
            {MATERIAL.find((x) => x.value === data?.data?.material)?.label}
          </div>
        </div>
        <div className='flex justify-between font-medium text-lg mt-2'>
          <label htmlFor=''>
            <span className='ml-1 font-semibold'>Kích thước</span>
          </label>
        </div>
        <div className='grid grid-cols-1 gap-2 mt-1'>
          <div className='relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center text-xs uppercase font-semibold select-none overflow-hidden border-2 z-0 text-opacity-20 dark:text-opacity-20 cursor-not-allowed border-zinc-500 hover:bg-gray'>
            {data?.data?.size}
          </div>
        </div>
      </div>
    )
  }

  const renderStatus = () => {
    const CLASSES =
      'absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300'
    if (data?.is_new) {
      return (
        <div className={CLASSES}>
          <SparklesIcon className='w-3.5 h-3.5' />
          <span className='ml-1 leading-none'>{status}</span>
        </div>
      )
    }
    if (data?.discount) {
      return (
        <div className={CLASSES}>
          <IconDiscount className='w-3.5 h-3.5' />
          <span className='ml-1 leading-none'>{status}</span>
        </div>
      )
    }
    if (data?.quantity == 0) {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className='w-3.5 h-3.5' />
          <span className='ml-1 leading-none'>{status}</span>
        </div>
      )
    }
    if (data?.is_hot_deal) {
      return (
        <div className={CLASSES}>
          <ClockIcon className='w-3.5 h-3.5' />
          <span className='ml-1 leading-none'>{status}</span>
        </div>
      )
    }
    return null
  }

  const renderSection2 = () => {
    return <Policy />
  }

  const renderReviews = () => {
    return (
      <div id='reviews' className='scroll-mt-[150px]'>
        {/* HEADING */}
        <h2 className='text-2xl font-semibold flex items-center'>
          <span className='ml-1.5'> {listComments?.length} đánh giá</span>
        </h2>

        <div className='w-full py-5'>
          {user ? (
            <form onSubmit={handleSubmit(onSubmit)} className='nc-SingleCommentForm mt-5'>
              <div className='mb-5'>
                <Rate value={rateCurrent} onChange={(value) => setValue('rate', value)} className='mr-5' />
                {errors.rate && <span style={{ color: 'red' }}>{errors.rate.message}</span>}
              </div>
              <Textarea {...register('content')} />
              {errors.content && <span style={{ color: 'red' }}>{errors.content.message}</span>}
              <div className='mt-5 space-x-3'>
                <ButtonPrimary>Gửi</ButtonPrimary>
              </div>
            </form>
          ) : (
            <span> Vui lòng đăng nhập để bình luận</span>
          )}
        </div>

        {/* comment */}
        <div className='mt-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28'>
            {listComments?.map((item: any, key: any) => (
              <ReviewItem
                data={{
                  comment: item.content,
                  date: formatDate(item.created_at),
                  name: item.user_name,
                  starPoint: item.rating
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const Gallery = () => {
    return (
      <div className='lg:space-y-3 space-y-2'>
        <div className='relative border-2 rounded-[0.75rem]'>
          <div className='col-span-2 md:col-span-1 row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer h-[250px] md:h-[400px]'>
            <Swiper
              ref={swiperRef}
              loop={true}
              modules={[Navigation, Thumbs, Controller]}
              slidesPerView={1}
              thumbs={{ swiper: activeThumb && !activeThumb.destroyed ? activeThumb : null }}
              navigation={true}
              grabCursor={true}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              className='product-images-slider'
            >
              {[thumb, ...data?.data?.galleries.map((item) => item.image)].map((item, key) => (
                <SwiperSlide key={key}>
                  <NcImage
                    containerClassName='flex items-center justify-center h-full'
                    className=' rounded-md sm:rounded-xl h-full '
                    src={item}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/*  */}

          <div
            className='absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-white text-slate-500 cursor-pointer hover:bg-slate-200 z-10'
            onClick={() => handleOpenModal(0)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
              />
            </svg>
            <span className='ml-2 text-neutral-800 text-sm font-medium'>Hiện tất cả ảnh</span>
          </div>
        </div>
        <div className=''>
          <Swiper
            onSwiper={setActiveThumb}
            modules={[Navigation, Thumbs, Controller]}
            watchSlidesProgress
            spaceBetween={10}
            breakpoints={{
              1420: {
                slidesPerView: 11,
                spaceBetween: 10
              },
              320: {
                slidesPerView: 7,
                spaceBetween: 10
              },
              640: {
                slidesPerView: 8,
                spaceBetween: 10
              },
              770: {
                slidesPerView: 10,
                spaceBetween: 10
              },
              1024: {
                slidesPerView: 8,
                spaceBetween: 10
              }
            }}
            className='product-images-slider product-slide-thumbs'
          >
            {[thumb, ...data?.data?.galleries.map((item) => item.image)].map((item, index) => (
              <SwiperSlide key={index}>
                <NcImage
                  containerClassName='flex items-center justify-center border-[2px] rounded-md sm:rounded-xl p-1 cursor-pointer '
                  className=' rounded-sm sm:rounded-md h-[50px] object-cover w-[50px] '
                  src={item}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* MODAL PHOTOS */}
        <ModalPhotos
          imgs={[thumb, ...data?.data?.galleries.map((item) => item.image)]}
          isOpen={isOpen}
          onClose={handleCloseModal}
          initFocus={openFocusIndex}
          uniqueClassName='nc-ProductDetailPage2__modalPhotos'
        />
      </div>
    )
  }

  if (!data && isLoading) {
    return (
      <div className={`ListingDetailPage nc-ProductDetailPage2 mb-9 ${className}`} data-nc-id='ProductDetailPage2'>
        {/* SINGLE HEADER */}
        <>
          <header className='container mt-8 sm:mt-10'>
            <div>
              <h2 className='text-2xl md:text-3xl font-semibold'>
                <Skeleton.Input active size={'large'} style={{ width: 400 }} />
              </h2>
            </div>
          </header>
        </>

        {/* MAIn */}
        <main className='container relative z-10 mt-9 sm:mt-11 flex'>
          {/* CONTENT */}
          <div className='w-full lg:w-3/5 xl:w-2/3 space-y-10 lg:pr-14 lg:space-y-14'>
            <div className='lg:space-y-3 space-y-2'>
              <div className='relative border-2 rounded-[0.75rem]'>
                <div className='thumbnail_product col-span-2 md:col-span-1 row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer h-[250px] md:h-[400px]'>
                  <Skeleton.Image
                    style={{ width: '100%', height: '100%' }} // Skeleton.Image chiếm toàn bộ chiều rộng và chiều cao của Card
                    active
                  />
                </div>

                {/*  */}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className='flex-grow'>
            <div className='hidden lg:block sticky top-28'>
              <div className='listingSectionSidebar__wrap lg:shadow-lg'>
                <div className='space-y-7 lg:space-y-8'>
                  {/* PRICE */}
                  <div className=''>
                    {/* ---------- 1 HEADING ----------  */}

                    {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
                    <div className='mt-6 space-y-7 lg:space-y-8'>
                      <Skeleton active />
                    </div>
                  </div>

                  {/* SUM */}
                  <div className='hidden sm:flex flex-col space-y-4 '>
                    <div className='border-b border-slate-200 dark:border-slate-700'></div>
                    <div className='flex justify-between font-semibold text-[24px]'>
                      <span>
                        <Skeleton.Input active size={'default'} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className='container pt-14 space-y-14'>
          <Skeleton active />
        </div>
      </div>
    )
  }
  if (!data && isLoading) {
    return <></>
  }
  return (
    <div className={`ListingDetailPage nc-ProductDetailPage2 ${className}`} data-nc-id='ProductDetailPage2'>
      {/* SINGLE HEADER */}
      <>
        <header className='container mt-8 sm:mt-10'>
          <div>
            <h2 className='text-2xl md:text-3xl font-semibold'>{data?.data?.name}</h2>
          </div>
        </header>
      </>

      {/* MAIn */}
      <main className='container relative z-10 mt-9 sm:mt-11 flex '>
        {/* CONTENT */}
        <div className='w-full lg:w-3/5 xl:w-2/3 space-y-10 lg:pr-14 lg:space-y-14'>
          {Gallery()}

          <div>
            <div className='block lg:hidden'>
              <div className='listingSectionSidebar__wrap lg:shadow-lg'>
                <div className='space-y-7 lg:space-y-8'>
                  {/* PRICE */}
                  <div className=''>
                    {/* ---------- 1 HEADING ----------  */}
                    <div className='flex items-center justify-between space-x-5'>
                      <div className='flex text-2xl font-semibold'>{VND(parseFloat(product?.price))}</div>

                      <a href='#reviews' className='flex items-center text-sm font-medium'>
                        <span className='ml-1.5 flex'>
                          <span className='text-slate-700 dark:text-slate-400 underline'>
                            {listComments?.length} đánh giá
                          </span>
                        </span>
                      </a>
                    </div>

                    {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
                    <div className='mt-6 space-y-7 lg:space-y-8'>
                      <div className=''>{renderVariants()}</div>
                    </div>
                  </div>
                  {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
                  <div className='flex space-x-3.5'>
                    <div className='flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full'>
                      <NcInputNumber defaultValue={qualitySelected} onChange={setQualitySelected} />
                    </div>
                    <ButtonPrimary className='flex-1 flex-shrink-0' onClick={notifyAddTocart}>
                      <BagIcon className='hidden sm:inline-block w-5 h-5 mb-0.5' />
                      <span className='ml-3'>Thêm vào giỏ</span>
                    </ButtonPrimary>
                  </div>

                  {/* SUM */}
                  <div className='hidden sm:flex flex-col space-y-4 '>
                    <div className='space-y-2.5'>
                      <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                        <span className='flex'>
                          <span>{`${VND(parseFloat(product?.price))}  `}</span>
                          <span className='mx-2'>x</span>
                          <span>{`${qualitySelected} `}</span>
                        </span>

                        <span>{`${VND(product?.price * qualitySelected)}`}</span>
                      </div>
                      {/* <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Thuế giá trị gia tăng</span>
                  <span>0</span>
                </div> */}
                    </div>
                    <div className='border-b border-slate-200 dark:border-slate-700'></div>
                    <div className='flex justify-between font-semibold text-[24px]'>
                      <span>Tổng tiền</span>
                      <span>{`${VND(product?.price * qualitySelected)}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {renderSection2()}
        </div>

        {/* SIDEBAR */}
        <div className='flex-grow'>
          <div className='hidden lg:block sticky top-28'>
            <div className='listingSectionSidebar__wrap lg:shadow-lg'>
              <div className='space-y-7 lg:space-y-8'>
                {/* PRICE */}
                <div className=''>
                  {/* ---------- 1 HEADING ----------  */}
                  <div className='flex items-center justify-between space-x-5'>
                    <div className='flex text-2xl font-semibold'>{VND(parseFloat(product?.price))}</div>

                    <a href='#reviews' className='flex items-center text-sm font-medium'>
                      <span className='ml-1.5 flex'>
                        <span className='text-slate-700 dark:text-slate-400 underline'>
                          {listComments?.length} đánh giá
                        </span>
                      </span>
                    </a>
                  </div>

                  {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
                  <div className='mt-6 space-y-7 lg:space-y-8'>
                    <div className=''>{renderVariants()}</div>
                  </div>
                </div>
                {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
                <div className='flex space-x-3.5'>
                  <div className='flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full'>
                    <NcInputNumber defaultValue={qualitySelected} onChange={setQualitySelected} />
                  </div>
                  <ButtonPrimary className='flex-1 flex-shrink-0' onClick={notifyAddTocart}>
                    <BagIcon className='hidden sm:inline-block w-5 h-5 mb-0.5' />
                    <span className='ml-3'>Thêm vào giỏ</span>
                  </ButtonPrimary>
                </div>

                {/* SUM */}
                <div className='hidden sm:flex flex-col space-y-4 '>
                  <div className='space-y-2.5'>
                    <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                      <span className='flex'>
                        <span>{`${VND(parseFloat(product?.price))}  `}</span>
                        <span className='mx-2'>x</span>
                        <span>{`${qualitySelected} `}</span>
                      </span>

                      <span>{`${VND(product?.price * qualitySelected)}`}</span>
                    </div>
                    {/* <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Thuế giá trị gia tăng</span>
                  <span>0</span>
                </div> */}
                  </div>
                  <div className='border-b border-slate-200 dark:border-slate-700'></div>
                  <div className='flex justify-between font-semibold text-[24px]'>
                    <span>Tổng tiền</span>
                    <span>{`${VND(product?.price * qualitySelected)}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* OTHER SECTION */}
      <div className='container pt-14 space-y-14'>
        <hr className='border-slate-200 dark:border-slate-700' />

        <Row gutter={[32, 24]}>
          <Col className='gutter-row ' span={24}>
            <div className='py-5 border-2 rounded-md relative max-h-[200px] lg:shadow-lg p-4 overflow-hidden'>
              <div dangerouslySetInnerHTML={{ __html: data?.data?.content }} />
              <div
                style={{
                  background: 'linear-gradient(180deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, .91) 50%, #fff 55%)'
                }}
                className=' absolute bottom-0 left-0 p-2 flex justify-center items-center w-full'
              >
                <Button onClick={() => setOpenContent(true)}>Xem thêm</Button>
              </div>
            </div>
            <Modal
              title={
                <div>
                  <div className='text-[24px] font-bold mb-2'>Thông tin sản phẩm</div>
                  <hr className='border-slate-200 dark:border-slate-700' />
                </div>
              }
              footer={''}
              open={openContent}
              onCancel={() => setOpenContent(false)}
              width={1240}
            >
              <div className='rounded-md relative min-h-[32rem] p-4 overflow-hidden'>
                <div dangerouslySetInnerHTML={{ __html: data?.data?.content }} />
              </div>
            </Modal>
          </Col>
          <Col className='gutter-row ' span={24}>
            <div className='py-5 border-2 rounded-md relative max-h-[500px] lg:shadow-lg p-4 overflow-hidden'>
              <div dangerouslySetInnerHTML={{ __html: data?.data?.detail }} />
              <div
                style={{
                  background: 'linear-gradient(180deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, .91) 50%, #fff 55%)'
                }}
                className=' absolute bottom-0 left-0 p-2 flex justify-center items-center w-full'
              >
                <Button onClick={() => setOpenContent(true)}>Xem thêm</Button>
              </div>
            </div>
            <Modal
              title={
                <div>
                  <div className='text-[24px] font-bold mb-2'>Thông tin sản phẩm</div>
                  <hr className='border-slate-200 dark:border-slate-700' />
                </div>
              }
              footer={''}
              open={openContent}
              onCancel={() => setOpenContent(false)}
              width={1240}
            >
              <div className='rounded-md relative min-h-[32rem] p-4 overflow-hidden'>
                <div dangerouslySetInnerHTML={{ __html: data?.data?.detail }} />
              </div>
            </Modal>
          </Col>
        </Row>
      </div>

      {/* OTHER SECTION */}
      <div className='container pb-24 lg:pb-28 pt-14 space-y-14'>
        <hr className='border-slate-200 dark:border-slate-700' />

        {renderReviews()}
        {renderStatus()}

        <hr className='border-slate-200 dark:border-slate-700' />

        <SectionSliderProductCard
          heading='SẢN PHẨM TƯƠNG TỰ'
          subHeading=''
          headingFontClassName='text-2xl font-semibold'
          headingClassName='mb-10 text-neutral-900 dark:text-neutral-50'
        />
      </div>

      {/* MODAL VIEW ALL REVIEW */}
      <ModalViewAllReviews
        show={isOpenModalViewAllReviews}
        onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
      />
    </div>
  )
}

export default ProductDetailPage2
