import * as React from "react";
import styled from "styled-components/macro";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../pages/restaurant/state/restaurantsSlice";
import { NavLink } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "red",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Spacer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

function FormRow(restaurantByThree) {
  console.log("CHUNK OF THREE", restaurantByThree);
  return (
    <React.Fragment>
      {restaurantByThree.restaurantByThree.map((restaurant) => (
        <Grid item xs>
          <NavLink to={`/restaurant/${restaurant.restaurantId}`}>
            <Box maxWidth={'400px'} mb={10}>
              <Card variant="outlined">
                <CardMedia
                  component="img"
                  src={process.env.PUBLIC_URL + "/image.jpg"}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {restaurant.name}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </NavLink>
        </Grid>
      ))}
    </React.Fragment>
  );
}

export default function NestedGrid() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"));
  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log("NESTED GRID");
    dispatch(fetchRestaurants());
  }, []);

  const restaurantsArray = useSelector(
    (state) => state.restaurants.restaurants
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Spacer />
      <Container>
      <Typography variant="h1">Restaurants</Typography>
      <Spacer />
        <Grid container spacing={1}>
            {restaurantsArray.map((restaurantByThree) => (
            <Grid
                container
                item
                spacing={5}
                direction={desktop ? "row" : "column"}
            >
                <FormRow restaurantByThree={restaurantByThree} />
            </Grid>
            ))}
        </Grid>
      </Container>
    </Box>
  );
}
