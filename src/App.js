import * as React from "react";
import {
  StyledEngineProvider,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import { AuthProvider } from "./contexts/JWTContext";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import Router from "./routes";
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
      <Helmet titleTemplate="%s | Foody" defaultTitle="Foody" />
      <Provider store={store}>
        <StylesProvider jss={jss}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <AuthProvider>
                <Suspense fallback={<Loader />}>
                  <Router />
                </Suspense>
              </AuthProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </StylesProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
