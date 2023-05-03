import * as React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import {
  StyledEngineProvider,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import { AuthProvider } from "./contexts/JWTContext";
import { Provider } from "react-redux";
import { store } from "./store";
import Router from "./routes";
import { Helmet, HelmetProvider } from "react-helmet-async";
import jssPreset from "@mui/styles/jssPreset";
import { create } from "jss";
import { StylesProvider } from "@mui/styles";
import { Suspense } from "react";
import createTheme from "./theme";

import Loader from "./components/Loader";
import { Dialog } from "@mui/material";
import { closeModal } from "./pages/auth/state/authSlice";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

Amplify.configure(awsExports);

function App() {
  const theme = useTheme();
  // console.log("URL ", window.location.href);

  // React.useEffect(() => {
  //   const restaurantId = window.location.href.substring(
  //     window.location.href.lastIndexOf("/") + 1
  //   );
  //   localStorage.setItem("restaurandId", restaurantId);
  // }, []);

  // React.useEffect(() => {
  //   const restaurantId = window.location.href.substring(
  //     window.location.href.lastIndexOf("/") + 1
  //   );
  //   console.log("RESTAURANT ID SET", restaurantId);
  //   console.log(
  //     "RESTAURANT ID LOCAL STORAGE ",
  //     localStorage.getItem("restaurantId")
  //   );
  //   if (
  //     localStorage.getItem("restaurantId") &&
  //     localStorage.getItem("restaurantId").length > 1
  //   ) {
  //   } else {
  //     localStorage.setItem("restaurantId", restaurantId);
  //   }
  // }, []);

  // React.useEffect(() => {
  //   if (
  //     window.location.href.includes("logged") ||
  //     window.location.href.includes("logout")
  //   ) {
  //     window.location.replace(
  //       `http://localhost:3000/${localStorage.getItem("restaurantId")}`
  //     );
  //   }
  // }, []);

  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | Foody" defaultTitle="Foody" />
      <Provider store={store}>
        <StylesProvider jss={jss}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <Suspense fallback={<Loader />}>
                <Router />
              </Suspense>
            </ThemeProvider>
          </StyledEngineProvider>
        </StylesProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
