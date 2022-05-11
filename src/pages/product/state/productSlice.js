import { current, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";



const initialState = {
    selectedProductDialog:{
        open: false,
        defaultData: {}
    }
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    openSelectedProductDialog(state, action){
        console.log('OPEN DIALOG')
        state.selectedProductDialog.open = true
        state.selectedProductDialog.defaultData = action.payload.defaultData
    },
    closeSelectedProductDialog(state){
        state.selectedProductDialog.open = false
    },
    resetSelectedProductDialog(state){
        console.log('RESET RESET')
        state.defaultData = {}
    }
  },
});

// Action creators are generated for each case reducer function
export const {
    openSelectedProductDialog,
    closeSelectedProductDialog,
    resetSelectedProductDialog
} = productSlice.actions;

export default productSlice.reducer;


