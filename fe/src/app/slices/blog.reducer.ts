import { IBlog } from '@/common/types.interface'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  code: '',
  message: '',
  error_message: '',
  data: <IBlog>(<unknown>null),
  dataList: <IBlog[]>(<unknown>null),
  relatedPosts: <IBlog[]>(<unknown>null),
  recommendList: <IBlog[]>(<unknown>null)
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    isFetching: (state) => {
      state.isLoading = true
    },
    fetchedDone: (state) => {
      state.isLoading = false
    },
    getBlogSuccessFully: (state, { payload }) => {
      state.dataList = payload.data
      state.isLoading = false
    },
    getBlogSuccessFailure: (state, { payload }) => {
      state.message = payload
      state.isLoading = false
    },
    getByIdSuccessFully: (state, { payload }) => {
      state.data = payload.data
      state.isLoading = false
    },
    getByIdSuccessFailure: (state, { payload }) => {
      state.message = payload
      state.isLoading = false
    },
    getBySlugSuccessFully: (state, { payload }) => {
      state.data = payload.data.blog
      state.relatedPosts = payload.data.relatedBlogs
      state.isLoading = false
    },
    getBySlugSuccessFailure: (state, { payload }) => {
      state.message = payload
      state.isLoading = false
    },
    getByTypeSuccessFully: (state, { payload }) => {
      state.recommendList = payload.data.blogRecommendList
      state.dataList = payload.data.blogList
      state.isLoading = false
    },
    getByTypeSuccessFailure: (state, { payload }) => {
      state.message = payload
      state.isLoading = false
    },
    createSuccessfully: (state, { payload }) => {
      state.data = payload.data
      state.message = 'Tạo Bài Viết Thành Công'
      state.isLoading = false
    },
    createFailure: (state) => {
      state.error_message = 'Tạo Bài Viết Thất Bại'
      state.isLoading = false
    },
    updateSuccessfully: (state, { payload }) => {
      state.data = payload.data
      state.message = 'Cập Nhật Bài Viết Thành Công'
      state.isLoading = false
    },
    updateFailure: (state) => {
      state.error_message = 'Cập Nhật Bài Viết Thất Bại'
      state.isLoading = false
    },
    deleteSuccessfully: (state) => {
      state.message = 'Xóa Bài Viết Thành Công'
      state.isLoading = false
    },
    deleteFailure: (state) => {
      state.error_message = 'Xóa Bài Viết Thất Bại'
      state.isLoading = false
    }
  }
})

export const {
  isFetching,
  fetchedDone,
  getBlogSuccessFully,
  getBlogSuccessFailure,
  getByIdSuccessFailure,
  getByIdSuccessFully,
  getBySlugSuccessFailure,
  getBySlugSuccessFully,
  getByTypeSuccessFailure,
  getByTypeSuccessFully,
  createFailure,
  createSuccessfully,
  updateFailure,
  updateSuccessfully,
  deleteFailure,
  deleteSuccessfully
} = blogSlice.actions
export default blogSlice.reducer
