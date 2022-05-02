import { configureStore } from '@reduxjs/toolkit'
import productSlice from './pages/product/state/productSlice'
import restaurantsSlice from './pages/restaurant/state/restaurantsSlice'

export const store = configureStore({
  reducer: {
      restaurants: restaurantsSlice,
      product: productSlice
  },
})