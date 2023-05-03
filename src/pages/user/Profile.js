import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { Link, Navigate, Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import { fetchUserDetails } from "./state/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "../../auth/useAuthContext";

function LinkTab(props) {
  return <Tab component={Link} to={props.href} {...props} />;
}

export const Profile = () => {
  const { user } = useAuthContext();
  const [value, setValue] = React.useState(0);
  // const { user, signOut } = useAuthenticator((context) => [context.user]);
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    // console.log("NEW VALUE", newValue);
    setValue(newValue);
  };

  // console.log("USER PROFILE ", user);

  // useEffect(() => {
  //   if (user) {
  //     dispatch(fetchUserDetails(user));
  //   }
  // }, [user]);

  return (
    <Container>
      <Box mb={10}>
        <Typography variant="h1">User profile</Typography>
      </Box>

      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <LinkTab label="Personal Info" href="overview" />
          <LinkTab label="My Addresses" href="my_addresses" />
          <LinkTab label="Payment Methods" href="payment_methods" />
          {/* <LinkTab label="Page Three" href="/spam" /> */}
        </Tabs>
      </Box>
      <Box m={10}>
        <Outlet />
      </Box>
    </Container>
  );
};
