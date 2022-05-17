import { configureStore } from '@reduxjs/toolkit'
import productSlice from './pages/product/state/productSlice'
import restaurantsSlice from './pages/restaurant/state/restaurantsSlice'
import userSlice from './pages/user/state/userSlice'

export const store = configureStore({
  reducer: {
      restaurants: restaurantsSlice,
      product: productSlice,
      user: userSlice,
  },
})