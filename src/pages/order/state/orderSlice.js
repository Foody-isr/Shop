import { current, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";

const initialState = {};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = orderSlice.actions;

export default orderSlice.reducer;

export const createOrder =
  (products, restaurantSub, customerSub, address, name, deliveryDate) =>
  async (dispatch) => {
    // console.log("CREATE ORDER products ", products);
    const total = products.reduce((acc, obj) => acc + obj.total, 0);
    // console.log("TOTAL ", total);

    const order = {
      user: restaurantSub,
      customer: customerSub,
      name,
      address,
      products: products,
      total,
      deliveryDate,
    };

    const response = await axiosInstance.post("order", order);
  };
