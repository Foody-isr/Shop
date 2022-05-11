import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { Link, Navigate, Outlet } from "react-router-dom";
import React, { useEffect } from "react";

function LinkTab(props) {
    return (
      <Tab
        component={Link}
        to={props.href}
        {...props}
      />
    );
  }

export const Profile = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        console.log('NEW VALUE', newValue)
      setValue(newValue);
    };

    // useEffect(() => {
    //     effect
    //     return () => {
    //         cleanup
    //     }
    // }, [input])


    console.log('VALUEE ', value)

  return (
    <Container>
      <Box mb={10}>
        <Typography variant="h1">User profile</Typography>
      </Box>

      <Box >
      <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
        <LinkTab label="Personal Info" href="overview" />
        <LinkTab label="Payment Methods" href="payment_methods" />
        {/* <LinkTab label="Page Three" href="/spam" /> */}
      </Tabs>
    </Box>
    <Box mt={10}>
        <Container maxWidth="md">
            <Outlet/>
        </Container>
    </Box>
    </Container>
  );
};
