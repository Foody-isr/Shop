import { configureStore } from '@reduxjs/toolkit'
import restaurantsSlice from './pages/restaurant/state/restaurantsSlice'

export const store = configureStore({
  reducer: {
      restaurants: restaurantsSlice
  },
})