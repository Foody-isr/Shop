import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useReducer, useState } from "react";
import ReactWhatsapp from "react-whatsapp";
import { NavLink } from "react-router-dom";
import _ from "lodash";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerDetails } from "./state/restaurantsSlice";

export const OrderDialog = ({
  children,
  open,
  onClose,
  cart,
  decrement,
  increment,
  total,
  restaurant
}) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    cart && setData(cart);
  }, [open]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCustomerDetails(user));
    }
  }, [user]);

  const customerDetails = useSelector(
    (state) => state.restaurants.customerDetails
  );
  console.log("CUSTOMER DETAILS ", customerDetails);

  const renderUrlMessage = () => {
    let multipleToppingNames = [];
    let multipleToppingOptionNames = [];
    let multipleToppingOptionArray = [];

    data &&
      data.forEach((product) => {
        product.toppings &&
          Object.keys(product.toppings).map((key) => {
            for (let i = 0; i < product.toppings[key].length; i++) {
              if (
                product.toppings[key][i].name &&
                product.toppings[key][i].multiple &&
                !multipleToppingNames.includes(key)
              ) {
                multipleToppingNames.push(key);
                break;
              }
            }

            Array.isArray(product.toppings[key]) &&
              product.toppings[key].forEach((topping) => {
                if (!multipleToppingOptionNames.includes(topping.name)) {
                //   console.log("MULTIPLE TRUE ", topping.name);
                  if (topping.name && topping.multiple) {
                    multipleToppingOptionNames.push(topping.name);
                  }
                }
              });

            if (Array.isArray(product.toppings[key])) {
              // if(multipleToppingOptionNames.length > 0){
              //     multipleToppingOptionNames.forEach((name) => {
              //         const filteredArray = product.toppings[key].filter((e) => e.name === name);
              //         const index = multipleToppingOptionArray.findIndex(e => e.product === product.id)
              //         console.log('MULTIPLE INDEX INDEX INDEX ', multipleToppingOptionArray)
              //         console.log('MULTIPLE INDEX INDEX INDEX ', product.id)
              //         console.log('MULTIPLE INDEX INDEX INDEX ', name)
              //         console.log('MULTIPLE INDEX INDEX INDEX ', index)
              //         if(index == -1){
              //             multipleToppingOptionArray.push({
              //                 product: product.id,
              //                 name: name,
              //                 count: filteredArray.length,
              //               });
              //         }
              //       });
              // }
            //   console.log("PRODUCT PRODUCT PRODUCT ", product.id);
              product.toppings[key].forEach((option) => {
                // console.log("OPTION OPTION OPTION ", option.name && option.name);

                // Search if option with same name and same produt id already exist
                // If yes increment his count if not push it to the arrray

                console.log('NAME NAME NAME', option)
                // if(multipleToppingOptionArray.length > 0 && option.name){
                //     const index = multipleToppingOptionArray.findIndex((e, index) => {
                //         console.log('PRODUCT PRODUCT PRODUCT', e.product)
                //         console.log('NAME NAME NAME', e.name)
                //         if(e.product === product.id && e.name === option.name){
                //             return index
                //         }else{
                //             return -1
                //         }
                //     });
                //     console.log('INDEX INDEX INDEX INDEX' ,index)

                //     //If already in the array
                //     if (index != -1) {
                //       //Increment his count
                //       multipleToppingOptionArray[index].count += 1;
                //     }
                //     // If is not already in array push it
                //     else {
                //         if(option.name && option.multiple){
                //             multipleToppingOptionArray.push({
                //                 product: product.id,
                //                 name: option.name,
                //                 count: 1,
                //               });
                //         }
                //     }
                // }                    // If is not already in array push it
                // else {
                //     if(option.name && option.multiple){
                //         multipleToppingOptionArray.push({
                //             product: product.id,
                //             name: option.name,
                //             count: 1,
                //           });
                //     }
                // }
                console.log('ARRAY ARRAY ARRAY ', multipleToppingOptionArray)
                const index = multipleToppingOptionArray.findIndex((e, index) => {
                console.log('PRODUCT PRODUCT PRODUCT', e.product)
                console.log('NAME NAME NAME', e.name)
                if(e.product === product.id && e.name === option.name){
                    return index
                }else{
                    return -1
                    }
                });
                console.log('INDEX INDEX INDEX', index)
                if(option.name && option.multiple){
                    // if(index != -1){
                    //     multipleToppingOptionArray[index].count += 1
                    // }else{
                    //     multipleToppingOptionArray.push({
                    //         product: product.id,
                    //         name: option.name,
                    //         count: 1,
                    //       });
                    // }
                    multipleToppingOptionArray.push({
                        product: product.id,
                        name: option.name,
                        count: 1,
                      });
                }
              });

              let finalArray = [];

            }
          });
      });


    console.log("MULTIPLE TOPPING NAMES ", multipleToppingNames);
    console.log("MULTIPLE TOPPING OPTION NAMES ", multipleToppingOptionNames);
    console.log("MULTIPLE TOPPING OPTION ARRAY ", multipleToppingOptionArray);

    let finalArray = [];

    // multipleToppingOptionArray.forEach(optionMultiple => {
    //     const index = finalArray.findIndex(e => e.product === optionMultiple.product);
    //     if(index != -1){
    //         finalArray[index].count += 1
    //     }else{
    //         finalArray.push({
    //             product: optionMultiple.product,
    //             name: optionMultiple.name,
    //             count: 1,
    //           })
    //     }
    // })

    multipleToppingOptionArray.forEach(optionMultiple => {
        if(finalArray.length > 0){
        const index = finalArray.findIndex(e => e.product === optionMultiple.product && e.name === optionMultiple.name);
        if(index != -1){
            finalArray[index].count += 1
        }else{
            finalArray.push({
                product: optionMultiple.product,
                name: optionMultiple.name,
                count: 1,
              })
        }
        }else{
            finalArray.push({
                product: optionMultiple.product,
                name: optionMultiple.name,
                count: optionMultiple.count,
              })
        }
    })

    console.log("MULTIPLE TOPPING OPTION FINAL ARRAY ", finalArray);

    let message = "Order :";
    message += "%0a";
    message += "%0a";
    data.length > 0 &&
      data.forEach((item) => {
        message += item.name + " ";
        message += "*" + item.count + " =";
        message += " " + item.total + "%0a";
        if (item.toppings) {
          if (Object.keys(item.toppings).length > 0) {
            // message += JSON.stringify(item.toppings) + "%0a"
            Object.keys(item.toppings).forEach((key) => {
              message += "  " + key + " :" + "%0a";
              if (Array.isArray(item.toppings[key])) {
                if (multipleToppingNames.includes(key)) {
                //   console.log("ITEM ID ", item.id);
                //   const index = multipleToppingOptionArray.findIndex(
                //     (e) => e.product === item.id
                //   );
                //   if (index != -1) {
                //     console.log("INDEX INDEX INDEX INDEX ", index);
                //     // console.log('ITEM ID ', item.id)
                //     message +=
                //       "    " +
                //       multipleToppingOptionArray[index].name +
                //       "*" +
                //       multipleToppingOptionArray[index].count +
                //       "%0a";
                //   }
                finalArray.forEach(option => {
                    if(option.product === item.id ){
                        message +=
                        "    " +
                        option.name +
                        "*" +
                        option.count +
                        "%0a";
                    }
                })
                } else {
                  item.toppings[key].forEach((e, index) => {
                    if (e.name) {
                      //   if (index == item.toppings[key].length - 1) {
                      //     message += "    " + e.name;
                      //   } else {
                      //     message += "    " + e.name + ",";
                      //   }
                      message += "    " + e.name + "%0a";
                    }
                  });
                  //   message += "%0a";
                  //   message += "%0a";
                }
              } else {
                message += "    " + item.toppings[key].name + "%0a";
              }
            });
          }
        }
        message += "%0a";
      });

    if (total) {
      message += "%0a";
      message += "Total : " + total;
    }
    if (user && customerDetails) {
      message += "%0a";
      message += "%0a";
      message += user.first_name + " " + user.last_name + "%0a";
      message += customerDetails.address + "%0a";
      message += customerDetails.floor + "%0a";
      message += customerDetails.appartment + "%0a";
      message += customerDetails.phone + "%0a";
    }

    console.log("MESSAGE ", message);

    const url = `https://api.whatsapp.com/send/?phone=${restaurant.phone}&text=${message}&app_absent=0`;
    return url;
  };

  console.log("DATA ", data);

  const renderMultipleTopping = (
    multipleToppingNames,
    toppings,
    key,
    multipleToppingOptionNames
  ) => {
    let multipleToppingOptionArray = [];

    multipleToppingOptionNames.forEach((name) => {
      const filteredArray = toppings.filter((e) => e.name === name);
      multipleToppingOptionArray.push({
        name: name,
        count: filteredArray.length,
      });
    });

    // console.log("NEW MULTIPLE OPTION ARRAY ", multipleToppingOptionArray);

    if (multipleToppingNames.includes(key)) {
      return multipleToppingOptionArray.map((option) => (
        <Box display="flex">
          <Typography>{option.name}</Typography>
          <Typography ml={1} mr={1}>
            {option.count}
          </Typography>
        </Box>
      ));
    } else {
      return toppings.map((topping) => {
        if (topping.name && !topping.multiple) {
          return <Typography ml={1}>{topping.name}</Typography>;
        }
      });
    }
  };

  //   const formatMultipleToppings = () => {

  //   }

  const renderToppings = (product) => {
    console.log("RENDER TOPPINGS ", product);

    // Format multiple toppings

    return (
      product.toppings &&
      Object.keys(product.toppings).map((key) => {
        console.log(key);
        console.log(product.toppings[key]);

        // Filter multiple topping

        // Which topping and how is multiple ?

        let multipleToppingNames = [];
        let multipleToppingOptionNames = [];

        for (let i = 0; i < product.toppings[key].length; i++) {
          if (
            product.toppings[key][i].name &&
            product.toppings[key][i].multiple
          ) {
            multipleToppingNames.push(key);
            break;
          }
        }

        Array.isArray(product.toppings[key]) &&
          product.toppings[key].forEach((topping) => {
            if (!multipleToppingOptionNames.includes(topping.name)) {
              if (topping.name && topping.multiple) {
                multipleToppingOptionNames.push(topping.name);
              }
            }
          });

        // console.log("MULTIPLE TOPPING NAMES ", multipleToppingNames);
        // console.log(
        //   "MULTIPLE TOPPING OPTION NAMES ",
        //   multipleToppingOptionNames
        // );

        //Create array of object of topping mutiple with count

        if (Array.isArray(product.toppings[key])) {
          return (
            <Box display="flex">
              <Typography>{key + " : "}</Typography>

              <Typography ml={1} display="flex" flexDirection="row">
                {renderMultipleTopping(
                  multipleToppingNames,
                  product.toppings[key],
                  key,
                  multipleToppingOptionNames
                )}
              </Typography>
            </Box>
          );
        } else {
          return (
            <Typography>{key + " : " + product.toppings[key].name}</Typography>
          );
        }
      })
    );
  };

  if (!customerDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Box>
        <Box p={3}>
          <Typography variant="h3">Order details</Typography>
        </Box>
        {data &&
          data.map((product) => (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              m={3}
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <IconButton color="primary" onClick={() => decrement(product)}>
                  <RemoveCircleOutline fontSize={"small"} />
                </IconButton>
                <Typography
                  variant="button"
                  sx={{ marginLeft: "10px", marginRight: "10px" }}
                >
                  {product.count}
                </Typography>
                <IconButton color="primary" onClick={() => increment(product)}>
                  <AddCircleOutline fontSize={"small"} />
                </IconButton>
              </Box>

              <Box display="flex" flexDirection="column">
                <Typography variant="h5">
                  {product.name} {product.total} ₪
                </Typography>
                {renderToppings(product)}
                {/* <Typography variant="body">{product.total} ₪</Typography> */}
              </Box>
              <Box>
                <CardMedia
                  component="img"
                  sx={{ width: 100 }}
                  image={product.picture}
                  alt="Live from space album cover"
                />
              </Box>
            </Box>
          ))}
      </Box>
      <Box m={3} display="flex" flexDirection="row" justifyContent="center">
        <a href={renderUrlMessage()}>
          <Button variant="contained">Order on Whatsapp</Button>
        </a>
      </Box>
    </Dialog>
  );
};
