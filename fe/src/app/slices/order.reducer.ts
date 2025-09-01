import { IOrder } from '@/common/types.interface'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  code: '',
  message: '',
  error_message: '',
  data: <IOrder>(<unknown>null),
  dataList: <IOrder[]>(<unknown>null)
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    isFetching: (state) => {
      state.isLoading = true
    },
    fetchedDone: (state) => {
      state.isLoading = false
    },
    getOrdersSuccessFully: (state, { payload }) => {
      state.dataList = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getOrdersFailure: (state, { payload }) => {
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
      state.message = 'Tạo Khóa Học Thành Công'
      state.isLoading = false
    },
    createFailure: (state) => {
      state.error_message = 'Tạo Khóa Học Thất Bại'
      state.isLoading = false
    },
    updateSuccessfully: (state, { payload }) => {
      state.data = payload.data
      state.message = 'Cập Nhật Khóa Học Thành Công'
      state.isLoading = false
    },
    updateFailure: (state) => {
      state.error_message = 'Cập Nhật Khóa Học Thất Bại'
      state.isLoading = false
    },
    deleteSuccessfully: (state) => {
      state.message = 'Xóa Khóa Học Thành Công'
      state.isLoading = false
    },
    deleteFailure: (state) => {
      state.error_message = 'Xóa Khóa Học Thất Bại'
      state.isLoading = false
    }
  }
})

export const {
  isFetching,
  fetchedDone,
  getOrdersSuccessFully,
  getOrdersFailure,
  getByIdFailure,
  getByIdSuccessFully,
  createFailure,
  createSuccessfully,
  updateFailure,
  updateSuccessfully,
  deleteFailure,
  deleteSuccessfully
} = orderSlice.actions

export default orderSlice.reducer
