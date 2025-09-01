import { IUser } from '@/common/types.interface'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  code: '',
  message: '',
  error_message: '',
  data: <IUser>(<unknown>null),
  dataList: <IUser[]>(<unknown>null)
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    isFetching: (state) => {
      state.isLoading = true
    },
    fetchedDone: (state) => {
      state.isLoading = false
    },
    getUsersSuccess: (state, { payload }) => {
      state.data = payload
      state.isLoading = false
    },
    postCourseSuccess: (state, { payload }) => {
      state.dataList.push(payload) 
      state.isLoading = false
    },
    getUsersFailure: (state, { payload }) => {
      state.error_message = payload.message
      state.isLoading = false
    },
    getByIdSuccess: (state, { payload }) => {
      state.data = payload
      state.isLoading = false
    },
    getByIdFailure: (state, { payload }) => {
      state.error_message = payload.message
      state.isLoading = false
    },
    loginSuccess: (state, { payload }) => {
      state.data = payload
      state.isLoading = false
    },
    loginFailure: (state, { payload }) => {
      state.error_message = payload.message
      state.isLoading = false
    },
    signupSuccess: (state, { payload }) => {
      state.data = payload
      state.isLoading = false
    },
    signupFailure: (state, { payload }) => {
      state.error_message = payload.message
      state.isLoading = false
    },
    createSuccessfully: (state, { payload }) => {
      state.data = payload.data
      state.message = 'Tạo Người Dùng Thành Công'
      state.isLoading = false
    },
    createFailure: (state) => {
      state.error_message = 'Tạo Người Dùng Thất Bại'
      state.isLoading = false
    },
    updateSuccessfully: (state, { payload }) => {
      state.data = payload.data
      state.message = 'Cập Nhật Người Dùng Thành Công'
      state.isLoading = false
    },
    updateFailure: (state) => {
      state.error_message = 'Cập Nhật Người Dùng Thất Bại'
      state.isLoading = false
    },
    deleteSuccessfully: (state) => {
      state.message = 'Xóa Người Dùng Thành Công'
      state.isLoading = false
    },
    deleteFailure: (state) => {
      state.error_message = 'Xóa Người Dùng Thất Bại'
      state.isLoading = false
    }
  }
})

export const {
  isFetching,
  fetchedDone,
  getUsersSuccess,
  getUsersFailure,
  getByIdFailure,
  getByIdSuccess,
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  createFailure,
  createSuccessfully,
  updateFailure,
  updateSuccessfully,
  deleteFailure,
  deleteSuccessfully
} = userSlice.actions
export default userSlice.reducer
