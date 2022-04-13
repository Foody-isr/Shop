import { current, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";



const initialState = {
  restaurants: [],
  restaurantDetails: {},
};

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    restaurantsReceived(state, action) {
      state.restaurants = action.payload;
    },
    restaurantDetailsReceived(state, action){
      state.restaurantDetails = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const {
restaurantsReceived,
restaurantDetailsReceived
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;

export const splitArrayIntoChunksOfLen = (arr, len) => {
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
    return chunks;
  }

export const fetchRestaurants = () => async (dispatch) => {
  const response = await axiosInstance.get('restaurant');
  const chunksOfThree = splitArrayIntoChunksOfLen(response.data, 3)
  console.log("CHUNKS ", chunksOfThree)
  dispatch(restaurantsReceived(chunksOfThree));
};

export const fetchRestaurantDetails = (id) => async (dispatch) => {
    const response = await axiosInstance.get(`restaurant/${id}`);
    dispatch(restaurantDetailsReceived(response.data));
  };
