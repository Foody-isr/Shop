import { current, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";



const initialState = {
  restaurants: [],
  restaurantDetails: {},
  customerDetails: {},
  closed: false,
  cities: [],
  products: [],
};

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    restaurantsReceived(state, action) {
      state.restaurants = action.payload;
    },
    productsReceived(state, action) {
      state.products = action.payload;
    },
    restaurantDetailsReceived(state, action){
      state.restaurantDetails = action.payload
    },
    customerDetailsReceived(state, action){
        state.customerDetails = action.payload
    },
    closedRestaurant(state, action){
      state.closed = action.payload
    },
    citiesReceived(state, action){
      state.cities = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const {
restaurantsReceived,
productsReceived,
restaurantDetailsReceived,
customerDetailsReceived,
closedRestaurant,
citiesReceived
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
  const response = await axiosInstance.get('/restaurant');
  const chunksOfThree = splitArrayIntoChunksOfLen(response.data, 3)
  console.log("CHUNKS ", chunksOfThree)
  dispatch(restaurantsReceived(chunksOfThree));
};

export const fetchRestaurantDetails = (id) => async (dispatch) => {
    const response = await axiosInstance.get(`/restaurant/${id}`)
    dispatch(restaurantDetailsReceived(response.data[0]))
    dispatch(fetchProducts(response.data[0].user));
};

export const fetchProducts = (id) => async (dispatch) => {
  const response = await axiosInstance.get(`/product/shop/${id}`)
  dispatch(productsReceived(response.data));
};


export const fetchAllCities = () => async (dispatch) => {
  const response = await axiosInstance.get('city');
  dispatch(citiesReceived(response.data));
};

// export const fetchCustomerDetails = (id) => async (dispatch) => {
//     const response = await axiosInstance.get(`customer`);
//     dispatch(customerDetailsReceived(response.data));
//   };
