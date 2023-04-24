import * as React from "react";
import { Amplify, Auth, Hub } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import useAuth from "../hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";

const pages = ["Restaurants", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const ResponsiveAppBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  console.log("USER ", user);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = async (page) => {
    console.log("page", page);
    if (page === "Restaurants") {
      navigate("/");
      setAnchorElNav(null);
    }
  };

  const handleCloseUserMenu = async (setting) => {
    if (setting === "Logout") {
      await signOut();
      setAnchorElUser(null);
      navigate("/");
    } else if (setting === "Profile") {
      setAnchorElUser(null);
      navigate("/user/profile/overview");
    }
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" sx={{ height: "64px", top: 0 }} color="default">
      <Container maxWidth="false">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            FOODY
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            FOODY
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, color: "black", display: "block" }}
              >
                <Typography variant="h7">{page}</Typography>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* <Tooltip title="Open settings">
              {user ? (
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>{user.first_name && user.first_name[0]}</Avatar>
                </IconButton>
              ) : (
                <NavLink
                  to={
                    "https://auth.foody-app.co/oauth2/authorize?client_id=341mclabt5p0437nm1rcqo0rl7&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fshop.foody-app.co"
                  }
                >
                  Login
                </NavLink>
              )}
            </Tooltip> */}
            <button
              onClick={() =>
                Auth.federatedSignIn({
                  provider: CognitoHostedUIIdentityProvider.Google,
                })
              }
            >
              Open Google
            </button>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
