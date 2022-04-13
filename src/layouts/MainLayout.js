import { Container } from "@mui/material";
import styled from "styled-components/macro";
import { Link, Outlet } from "react-router-dom";
import ResponsiveAppBar from "../components/AppBar";

const Spacer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

export default function MainLayout() {
  return (
    <>
      <ResponsiveAppBar />
      <>
        <Spacer />
        <Outlet />
      </>
    </>
  );
}
