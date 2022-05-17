import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import {
  Box,
  Button,
  Card,
  CardContent,
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
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { fetchRestaurantDetails } from "./state/restaurantsSlice";
import { useTheme } from "@mui/material/styles";
import { ProductDetails } from "../product/ProductDetails";
import { openSelectedProductDialog } from "../product/state/productSlice";
import { OrderDialog } from "./OrderDialog";
import _ from "lodash";
import { keyboardImplementationWrapper } from "@testing-library/user-event/dist/keyboard";
import { OtherHouses } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

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

const Chip = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  width: "30px",
  height: "30px",
  borderRadius: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CategoryLink = styled.a`
  color: inherit;
  text-decoration: none;
`;

// const CategoryContainer = styled(Box)`
//   padding-left: 60px;
// `;

export const RestaurantDetails = () => {
  const { user } = useAuth()
  const navigate = useNavigate();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const [orderDialog, setOrderDialog] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalItemsOrder, setTotalItemsOrder] = useState(0);
  const dispatch = useDispatch();
  const restaurantId = useParams().id;

  const [categorySelected, setCategorySelected] = useState(null);

  const restaurant = useSelector(
    (state) => state.restaurants.restaurantDetails
  );

  const closed = useSelector(
    (state) => state.restaurants.closed
  );

  console.log('RESTAURANT CLOSE', closed)

  useEffect(() => {
    dispatch(fetchRestaurantDetails(restaurantId));
  }, []);

  console.log('CART CART CART CART CART', cart)

  useEffect(() => {
    let resultTotal = 0;
    let resultTotalItems = 0;
    cart.forEach((item) => {
      resultTotal += item.total;
      resultTotalItems += item.count;
    });
    setTotalOrder(resultTotal);
    setTotalItemsOrder(resultTotalItems);
  }, [cart]);

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

  const compareObjectsOrder = (object, other) => {
    console.log("COMPARE OBJECT");
    if (
      object.description === other.description &&
      object.picture === other.picture &&
      _.isEqual(object.toppings, other.toppings)
    ) {
      return true;
    }
    console.log("FALSE");
    console.log(object);
    console.log(other);
    return false;
  };
  // function customizer(objValue, othValue, key, object, other) {
  //   // if (object && object.count != other && other.count ) {
  //   //     console.log("object ", object)
  //   //     console.log("other ", other)
  //   //   return true;
  //   // }
  //   // console.log("object ", object.count)
  //   return key === "count" ? true : undefined;
  // }

  const addProductToCart = (result) => {
    //   let cloneArray = [...cart];
    // //   console.log('CLONE ARRAY ', cloneArray)
    //   const resultArray = cloneArray.concat(arrayOfProducts);
    // //   console.log('CLONE ARRAY ', resultArray)
    //   setCart(resultArray);
    //   arrayOfProducts.forEach(product => {
    //     setTotalOrder(totalOrder + parseInt(product.total))
    //   })

    //First item
    let cloneArray = [...cart];
    // let filterArrray = cloneArray.filter(e => e.name === result.name)

    if (cloneArray.length > 0) {
      console.log(" > 0 ");
      const index = cloneArray.findIndex(e => e.name === result.name);
      if(index != -1){
        if (compareObjectsOrder(cloneArray[index], result)) {
          console.log("EQUAL");
          cloneArray[index].count += result.count;
          cloneArray[index].total += parseInt(result.total);
        }else{
          cloneArray.push(result);
        }
      }else{
        cloneArray.push(result);
      }
      // cloneArray.forEach((product) => {
      //   console.log(" product ", product);
      //   console.log(" result ", result);
      //   if (product.name === result.name) {
      //     if (compareObjectsOrder(product, result)) {
      //       console.log("EQUAL");
      //       product.count += result.count;
      //       product.total += parseInt(result.total);
      //     } else {
      //       cloneArray.push(result);
      //     }
      //   }else{
      //     cloneArray.push(result);
      //   }
      // });
    } else {
      cloneArray.push(result);
    }
    setCart(cloneArray);
  };

  const decrementProduct = (product) => {

    console.log('DECREMENT PRODUCT')

    let cloneArray  = [...cart];
    const index = cloneArray.findIndex(e => e.name === product.name);
    if(index != -1){
      cloneArray[index].count -= 1;
      cloneArray[index].total -= parseInt(product.price);
      setCart(cloneArray)
    }

  }

  const incrementProduct = (product) => {

    console.log('INCREMENT PRODUCT')

    let cloneArray  = [...cart];
    const index = cloneArray.findIndex(e => e.name === product.name);
    if(index != -1){
      cloneArray[index].count += 1;
      cloneArray[index].total += parseInt(product.price);
      setCart(cloneArray)
    }

  }

  const openProductDialog = (product) => {
    if(!user){
      alert('You need to login')
    }else{

        dispatch(
          openSelectedProductDialog({ defaultData: product })
        )

    }
  }

  const renderCategories = () => {
    return Object.keys(restaurant.formated_products).map((category) => {
      //   renderProducts(category, restaurant.formated_products[category])
      return (
        <>
          <div id={category.trim()} style={{ scrollMarginTop: "150px" }}>
            <Typography mt={10} mb={10} fontWeight="800" variant="h3">
              {category.toLocaleUpperCase()}
            </Typography>
          </div>
          <Box>
            <Grid container spacing={1}>
              {restaurant.formated_products[category].map((product) => (
                <Grid container item spacing={3}>
                  <Grid item xs>
                    <Card
                      onClick={() =>

                          openProductDialog(product)

                      }
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        maxHeight: "150px",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <Box sx={{ padding: "10px" }}>
                        <Typography variant="h5">{product.name}</Typography>
                        <Typography mt={2} variant="body2">
                          {product.description}
                        </Typography>
                        <Typography mt={2} variant="subtitle1">
                          {product.price} ₪
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
        <OrderDialog
          open={orderDialog}
          onClose={() => setOrderDialog(false)}
          cart={cart}
          decrement={(product) => decrementProduct(product)}
          increment={(product) => incrementProduct(product)}
          total={totalOrder}
          restaurant={restaurant}
        />
        <ProductDetails
          addProductToCart={(product) => addProductToCart(product)}

        />
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
          sx={{ display: "flex", flexDirection: "row", overflowX: "auto" }}
          maxWidth={"false"}
        >
          {restaurant.categories_ordered.map((category) => (
            <CategoryLink href={`#${category.trim()}`}>
              <CategoryContainer
                onClick={() => setCategorySelected(category.trim())}
                category={category}
              >
                <Typography
                  fontSize="20px"
                  fontWeight={300}
                  sx={{ overflow: "hidden", whiteSpace: "nowrap" }}
                >
                  {category}
                </Typography>
              </CategoryContainer>
            </CategoryLink>
          ))}
        </Container>
      </CategoriesContainer>
      <SpacerTop />
      <Container maxWidth={"false"}>
        <Box mt={5}>{renderCategories()}</Box>
      </Container>
      {cart.length > 0 ? (
        <Box sx={{ position: "sticky", bottom: 0 }}>
          <Button
            variant="contained"
            sx={{ height: "50px" }}
            fullWidth
            onClick={() => setOrderDialog(true)}
          >
            <Chip>
              <Typography variant="h4" fontWeight={900} color="primary">
                {totalItemsOrder}
              </Typography>
            </Chip>
            <Typography variant="h4" fontWeight={900} ml={2} mr={2}>
              View order
            </Typography>
            <Typography variant="h4" fontWeight={900}>
              {totalOrder} ₪
            </Typography>
          </Button>
        </Box>
      ) : null}
    </>
  );
};
