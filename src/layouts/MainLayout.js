import { Container, Dialog } from "@mui/material";
import {
  Authenticator,
  FederatedButtons,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import styled from "styled-components/macro";
import { Link, Outlet } from "react-router-dom";
import ResponsiveAppBar from "../components/AppBar";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, decodeAccessToken } from "../pages/auth/state/authSlice";
import { useEffect } from "react";
import { SignIn } from "../pages/auth/SignIn";

const Spacer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

export default function MainLayout() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.auth.modalOpen);
  // const { user, signOut } = useAuthenticator((context) => [context.user]);
  // console.log("MAIN LAYOUT USER ", user);
  // console.log(
  //   "PAYLOAD ",
  //   user && user.getSignInUserSession().getAccessToken().decodePayload()
  // );
  // const { sub, name, email } =
  //   user && user.getSignInUserSession().getAccessToken().payload();
  // console.log("RESTAURANT ID ", localStorage.getItem("restaurandId"));

  // console.log("USER ", user);

  // useEffect(() => {
  //   console.log("decode USER USE EFFECT MAIN LAYOUT", user);
  //   dispatch(decodeAccessToken(JSON.stringify(user)));
  // }, [user]);

  return (
    <>
      <ResponsiveAppBar />
      <>
        <Dialog open={open} onClose={() => dispatch(closeModal())}>
          <Authenticator hideSignUp={true} socialProviders={["google"]}>
            {({ signOut, user }) => {
              return (
                <main>
                  <h1>Hello {user.username}</h1>
                  <button onClick={signOut}>Sign out</button>
                </main>
              );
            }}
          </Authenticator>
        </Dialog>
        {/* <SignIn /> */}
        <Spacer />
        <Outlet />
      </>
    </>
  );
}
