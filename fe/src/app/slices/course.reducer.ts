import { IProduct, IQuickViewCourse } from '@/common/types.interface'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  code: '',
  message: '',
  error_message: '',
  data: <IProduct>(<unknown>null),
  dataList: <IProduct[]>(<unknown>null),
  recommends: <IProduct[]>(<unknown>null),
  quickViews: <IQuickViewCourse[]>(<unknown>null)
}

const courseSlice = createSlice({
  name: 'course',
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
    getCoursesSuccessFully: (state, { payload }) => {
      state.dataList = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getRecommendCoursesSuccessFully: (state, { payload }) => {
      state.recommends = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getQuickViewCoursesSuccessFully: (state, { payload }) => {
      state.quickViews = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getCoursesFailure: (state, { payload }) => {
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
    },
    getCoursesByCategorySuccessFully: (state, { payload }) => {
      state.dataList = payload.data
      state.code = payload.code
      state.message = payload.message
      state.isLoading = false
    },
    getCoursesByCategoryFailure: (state, { payload }) => {
      state.code = payload.code || 'ERROR'
      state.message = payload.error_message || 'Something went wrong'
      state.isLoading = false
    }
  }
})

export const {
  isFetching,
  fetchedDone,
  getCoursesSuccessFully,
  getCoursesFailure,
  getByIdFailure,
  getByIdSuccessFully,
  createFailure,
  createSuccessfully,
  updateFailure,
  updateSuccessfully,
  deleteFailure,
  deleteSuccessfully,
  getCoursesByCategorySuccessFully,
  getCoursesByCategoryFailure,
  getRecommendCoursesSuccessFully,
  getQuickViewCoursesSuccessFully,
  reset
} = courseSlice.actions

export default courseSlice.reducer
