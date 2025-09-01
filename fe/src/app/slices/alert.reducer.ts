import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  type: '',
  payload: ''
}

export const alert = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    handleError: (state, action) => {
      state.type = 'ERROR'
      state.payload = action.payload
    },
    handleSuccess: (state, action) => {
      state.type = 'SUCCESS'
      state.payload = action.payload
    }
  }
})

export const { handleError, handleSuccess } = alert.actions

export default alert.reducer
