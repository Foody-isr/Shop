import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./pages/product/state/productSlice";
import restaurantsSlice from "./pages/restaurant/state/restaurantsSlice";
import userSlice from "./pages/user/state/userSlice";
import authSlice from "./pages/auth/state/authSlice";
import orderSlice from "./pages/order/state/orderSlice";

export const store = configureStore({
  reducer: {
    restaurants: restaurantsSlice,
    product: productSlice,
    user: userSlice,
    auth: authSlice,
    order: orderSlice,
  },
});
