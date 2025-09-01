import { IProduct, IQuickViewProduct } from '@/common/types.interface'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  code: '',
  message: '',
  error_message: '',
  data: <IProduct>(<unknown>null),
  dataList: <IProduct[]>(<unknown>null),
  recommends: <IProduct[]>(<unknown>null),
  quickViews: <IQuickViewProduct[]>(<unknown>null)
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    isFetching: (state) => {
      state.isLoading = true
    },
    fetchedDone: (state) => {
      state.isLoading = false
    },
    reset: (state) => {
      state.isLoading = true
      state.code = ''
      state.message = ''
      state.error_message = ''
      state.data = null as unknown as IProduct
      state.dataList = []
    },
    getProductsSuccessFully: (state, { payload }) => {
      state.dataList = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getRecommendProductsSuccessFully: (state, { payload }) => {
      state.recommends = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getQuickViewProductsSuccessFully: (state, { payload }) => {
      state.quickViews = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getProductsFailure: (state, { payload }) => {
      state.code = payload.code || 'ERROR'
      state.message = payload.error_message || 'Something went wrong'
      state.isLoading = false
    },
    getByIdSuccessFully: (state, { payload }) => {
      state.data = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getByIdFailure: (state, { payload }) => {
      state.code = payload.code || 'ERROR'
      state.message = payload.error_message || 'Something went wrong'
      state.isLoading = false
    },
    createSuccessfully: (state, { payload }) => {
      state.data = payload.data
      state.message = 'Tạo sản phẩm Thành Công'
      state.isLoading = false
    },
    createFailure: (state) => {
      state.error_message = 'Tạo sản phẩm Thất Bại'
      state.isLoading = false
    },
    updateSuccessfully: (state, { payload }) => {
      state.data = payload.data
      state.message = 'Cập Nhật sản phẩm Thành Công'
      state.isLoading = false
    },
    updateFailure: (state) => {
      state.error_message = 'Cập Nhật sản phẩm Thất Bại'
      state.isLoading = false
    },
    deleteSuccessfully: (state) => {
      state.message = 'Xóa sản phẩm Thành Công'
      state.isLoading = false
    },
    deleteFailure: (state) => {
      state.error_message = 'Xóa sản phẩm Thất Bại'
      state.isLoading = false
    },
    getProductsByCategorySuccessFully: (state, { payload }) => {
      state.dataList = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getProductsByCategoryFailure: (state, { payload }) => {
      state.code = payload.code || 'ERROR'
      state.message = payload.error_message || 'Something went wrong'
      state.isLoading = false
    }
  }
})

export const {
  isFetching,
  fetchedDone,
  getProductsSuccessFully,
  getProductsFailure,
  getByIdFailure,
  getByIdSuccessFully,
  createFailure,
  createSuccessfully,
  updateFailure,
  updateSuccessfully,
  deleteFailure,
  deleteSuccessfully,
  getProductsByCategorySuccessFully,
  getProductsByCategoryFailure,
  getRecommendProductsSuccessFully,
  getQuickViewProductsSuccessFully,
  reset
} = productSlice.actions

export default productSlice.reducer
