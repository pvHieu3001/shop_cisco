import { configureStore } from '@reduxjs/toolkit'
import webReducer from './slices/web.reducer'
import categoryReducer from './slices/category.reducer'
import userReducer from './slices/user.reducer'
import productReducer from './slices/product.reducer'
import alertReducer from './slices/alert.reducer'
import orderSlice from './slices/order.reducer'
import blogSlice from './slices/blog.reducer'
export const store = configureStore({
  reducer: {
    category: categoryReducer,
    user: userReducer,
    web: webReducer,
    alert: alertReducer,
    product: productReducer,
    order: orderSlice,
    blog: blogSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
