import * as React from "react";
import {
  StyledEngineProvider,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { ThemeProvider } from "styled-components/macro";
import { AuthProvider } from "./contexts/JWTContext";
import { useTheme } from "@mui/material/styles";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import Router from "./routes";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Helmet, HelmetProvider } from "react-helmet-async";
import jssPreset from "@mui/styles/jssPreset";
import { create } from "jss";
import { StylesProvider } from "@mui/styles";
import { Suspense } from "react";
import createTheme from "./theme";

import Loader from "./components/Loader";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

function App() {
  const theme = useTheme();

  console.log("USE THEME ", theme);

  return (
    <HelmetProvider>
      <Helmet
        titleTemplate="%s | Material App"
        defaultTitle="Material App - React Admin & Dashboard Template"
      />
      <Provider store={store}>
        <StylesProvider jss={jss}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StyledEngineProvider injectFirst>
              <MuiThemeProvider theme={createTheme(theme)}>
                <ThemeProvider theme={createTheme(theme)}>
                  <AuthProvider>
                    <Suspense fallback={<Loader />}>
                      <Router />
                    </Suspense>
                  </AuthProvider>
                </ThemeProvider>
              </MuiThemeProvider>
            </StyledEngineProvider>
          </LocalizationProvider>
        </StylesProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
