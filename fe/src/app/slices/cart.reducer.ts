
import { createSlice } from '@reduxjs/toolkit'
interface ICart {
  id: number
  user_id: number
  quantity: number
  created_at: string
  updated_at: string
  product_attr_id: number
}
interface IInitialState {
  carts: ICart[]
}

const initialState: IInitialState = {
  carts: []
}

const cart = createSlice({
  name: 'carts',
  initialState,
  reducers: {
    
  }
})

export default cart.reducer
