import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const initialState = {
  modalOpen: false,
  sub: null,
  email: null,
  name: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openModal(state) {
      console.log("open modal");
      state.modalOpen = true;
    },
    closeModal(state) {
      state.modalOpen = false;
    },
    decodeAccessToken(state, action) {
      if (action && action.payload) {
        const user = JSON.parse(action.payload);
        if (user) {
          const { sub, name, email } =
            user && user.signInUserSession.idToken.payload;
          state.sub = sub;
          state.name = name;
          state.email = email;
        }
      }
    },
  },
});

export const { openModal, closeModal, decodeAccessToken } = authSlice.actions;

export default authSlice.reducer;
