import { current, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";



const initialState = {
    details:{}
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
      userDetailsReceived(state, action){
          state.details = action.payload
      }
  },
});

// Action creators are generated for each case reducer function
export const {
    userDetailsReceived
} = userSlice.actions;

export default userSlice.reducer;

export const fetchUserDetails = (user) => async (dispatch) => {
    console.log('FETCH CUSTOMER DETAILS ', user)
    const response = await axiosInstance.get(`customer/${user.customer.id}`);
    dispatch(userDetailsReceived(response.data));
  };