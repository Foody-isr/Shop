import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchRestaurantDetails } from "./state/restaurantsSlice";
import { useTheme } from "@mui/material/styles";

const SpacerLeft = styled.div`
  margin-left: 20px;
`;

const SpacerTop = styled.div`
  margin-top: 20px;
`;

const CategoriesContainer = styled(Paper)(({ theme }) => ({
  position: "sticky",
  top: "64px",
  // display: "flex",
  // flexDirection: "row",
  paddingTop: "10px",
  paddingBottom: "10px",
  borderTop: `1px solid ${theme.palette.grey[300]}`,
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
}));

const CategoryLink = styled.a`
  color: inherit;
  text-decoration: none;
`;

// const CategoryContainer = styled(Box)`
//   padding-left: 60px;
// `;

export const RestaurantDetails = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();
  const restaurantId = useParams().id;

  const [categorySelected, setCategorySelected] = useState(null);

  useEffect(() => {
    dispatch(fetchRestaurantDetails(restaurantId));
  }, []);

  const restaurant = useSelector(
    (state) => state.restaurants.restaurantDetails
  );

  const CategoryContainer = styled(Box)(({ theme, category }) => ({
    backgroundColor:
      categorySelected === category.trim()
        ? theme.palette.primary.main
        : "white",
    color: categorySelected === category.trim() ? "white" : "inherit",
    paddingTop: "7px",
    paddingBottom: "7px",
    paddingLeft: "25px",
    paddingRight: "25px",
    borderRadius: "20px",
    marginRight: "20px",
  }));

  const handleNavigateToCategory = (category) => {};

  const renderCategories = () => {
    return Object.keys(restaurant.formated_products).map((category) => {
      //   renderProducts(category, restaurant.formated_products[category])
      return (
        <>
          <a id={category.trim()}>
            <Typography fontWeight="800" variant="h3">
              {category.toLocaleUpperCase()}
            </Typography>
          </a>
          <Box mt={5}>
            {/* <Grid container spacing={1}>
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
            </Grid> */}

            <Grid container spacing={1}>
              {restaurant.formated_products[category].map((product) => (
                <Grid
                  container
                  item
                  spacing={3}
                  direction={desktop ? "row" : "column"}
                >
                  <Grid item xs>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ padding: "10px" }}>
                        <Typography variant="h5">{product.name}</Typography>
                        <Typography mt={2} variant="body2">
                          {product.description}
                        </Typography>
                        <Typography mt={2} variant="subtitle1">
                          {product.price}
                        </Typography>
                      </Box>
                      <CardMedia
                        component="img"
                        sx={{ width: 200 }}
                        image={product.picture}
                        alt="Live from space album cover"
                      />
                    </Card>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      );
    });
  };

  if (!restaurant.name) {
    return <div>Loading</div>;
  }
  return (
    <>
      <Container maxWidth={"false"}>
        <Box
          sx={
            desktop
              ? { display: "flex", flexDirection: "row" }
              : { display: "flex", flexDirection: "column" }
          }
        >
          <CardMedia
            component="img"
            src={process.env.PUBLIC_URL + "/image.jpg"}
            sx={{ width: "100%", maxWidth: "400px", height: "auto" }}
          />
          <SpacerLeft />
          <Typography variant="h1">{restaurant.name}</Typography>
        </Box>
      </Container>
      <SpacerTop />

      <CategoriesContainer variant="elevation" square>
        <Container
          sx={{ display: "flex", flexDirection: "row" }}
          maxWidth={"false"}
        >
          {restaurant.categories_ordered.map((category) => (
            <CategoryContainer
              onClick={() => setCategorySelected(category.trim())}
              category={category}
            >
              <CategoryLink href={`#${category.trim()}`}>
                {category}
              </CategoryLink>
            </CategoryContainer>
          ))}
        </Container>
      </CategoriesContainer>
      <SpacerTop />
      <Container maxWidth={"false"}>
        <Box mt={5}>{renderCategories()}</Box>
      </Container>
    </>
  );
};
