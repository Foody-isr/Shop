import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Autocomplete from "react-google-autocomplete";
import React, { useEffect, useReducer, useState } from "react";
import ReactWhatsapp from "react-whatsapp";
import { NavLink } from "react-router-dom";
import _ from "lodash";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { closedRestaurant } from "./state/restaurantsSlice";
import { ConstructionOutlined } from "@mui/icons-material";
import { fetchUserDetails } from "../user/state/userSlice";
import axios from "axios";
import "./styles.css";

export const OrderDialog = ({
  children,
  open,
  onClose,
  cart,
  decrement,
  increment,
  total,
  restaurant,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [closed, setClosed] = useState(false);

  const dispatch = useDispatch();

  console.log("RESTAURANT ", restaurant);
  console.log("ORDER DIALOG - CART ", cart);

  const userDetails = useSelector((state) => state.user.details);

  useEffect(() => {
    cart && setData(cart);
  }, [open]);

  useEffect(() => {
    checkDeliveryArea();
  }, [deliveryAddress]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserDetails(user));
    }
  }, [user]);

  useEffect(() => {
    if (restaurant && restaurant.times) {
      restaurant.times.forEach((time) => {
        console.log("RESTAURANT ", restaurant);
        const currentD = new Date();
        const openHours = new Date();
        const closeHours = new Date();
        const start_hours = time.start.split(":")[0];
        const start_minutes = time.start.split(":")[1];
        const end_hours = time.end.split(":")[0];
        const end_minutes = time.end.split(":")[1];
        openHours.setHours(start_hours, start_minutes, 0);
        closeHours.setHours(end_hours, end_minutes, 0);

        console.log("RESTAURANT OPEN", openHours);
        console.log("RESTAURANT CLOSE", closeHours);
        console.log("RESTAURANT CURRENTD", currentD);

        if (currentD >= openHours && currentD <= closeHours) {
          dispatch(closedRestaurant(false));

          let deliveryStart = new Date();
          let deliveryEnd = new Date();

          const start_hours = time.deliveryConditionStart.split(":")[0];
          const start_minutes = time.deliveryConditionStart.split(":")[1];
          const end_hours = time.deliveryConditionEnd.split(":")[0];
          const end_minutes = time.deliveryConditionEnd.split(":")[1];

          deliveryStart.setHours(start_hours, start_minutes, 0);
          deliveryEnd.setHours(end_hours, end_minutes, 0);

          // console.log("RESTAURANT DELIVERY START ", deliveryStart);
          // console.log("RESTAURANT DELIVERY END ", deliveryEnd);

          // deliveryStart.setMinutes(deliveryStart.getMinutes() + 30)

          // console.log("RESTAURANT WE DELIVERY ", deliveryStart);

          let options = [];
          let finalOptions = [];
          let today = new Date();
          console.log("DELIVERY START ", deliveryStart);
          today.setDate(today.getDate() + parseInt(time.deliveryConditionDay));
          let date =
            today.getDate() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getFullYear();

          while (deliveryStart <= deliveryEnd) {
            let minutes = deliveryStart.getMinutes();
            if (minutes < 10) {
              minutes += "0";
            }
            options.push(deliveryStart.getHours() + ":" + minutes);
            deliveryStart.setMinutes(deliveryStart.getMinutes() + 30);
            // console.log("RESTAURANT WE DELIVERY ", deliveryStart.getTime());
          }
          console.log(options);
          for (let i = 0; i < options.length - 1; i++) {
            finalOptions.push(
              date + " at " + options[i] + "-" + options[i + 1]
            );
          }
          setDeliveryOptions(finalOptions);
        } else {
          console.log("RESTAURANT WE ARE CLOSED", currentD);
          dispatch(closedRestaurant(true));
        }
      });
    }
  }, [restaurant]);

  const customerDetails = useSelector(
    (state) => state.restaurants.customerDetails
  );

  const checkDeliveryArea = () => {
    // if (deliveryAddress) {
    //   const found =
    //     restaurant &&
    //     restaurant.cities.filter((city) => city.name === deliveryAddress.city);
    //   if (found.length === 0) {
    //     return (
    //       <Box>
    //         <Typography color="error">
    //           Sorry we are not delivering to {deliveryAddress.city}
    //         </Typography>
    //       </Box>
    //     );
    //   }
    //   console.log("FOUND ", deliveryAddress);
    //   console.log("FOUND ", found);
    // }
    console.log("delivery address ", deliveryAddress);
  };

  const renderUrlMessage = () => {
    let multipleToppingNames = [];
    let multipleToppingOptionNames = [];
    let multipleToppingOptionArray = [];

    data &&
      data.forEach((product) => {
        product.options &&
          Object.keys(product.options).map((key) => {
            for (let i = 0; i < product.options[key].length; i++) {
              if (
                product.options[key][i].name &&
                product.options[key][i].multiple &&
                !multipleToppingNames.includes(key)
              ) {
                multipleToppingNames.push(key);
                break;
              }
            }

            console.log("product.options  ", product.options[key]);

            Array.isArray(product.options[key]) &&
              product.options[key].forEach((topping) => {
                console.log("TOPPING  ", topping);
                if (!multipleToppingOptionNames.includes(topping.name)) {
                  //   console.log("MULTIPLE TRUE ", topping.name);
                  if (topping.name && topping.multiple) {
                    multipleToppingOptionNames.push(topping.name);
                  }
                }
              });

            if (Array.isArray(product.options[key])) {
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
              product.options[key].forEach((option) => {
                // console.log("OPTION OPTION OPTION ", option.name && option.name);

                // Search if option with same name and same produt id already exist
                // If yes increment his count if not push it to the arrray

                console.log("NAME NAME NAME", option);
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
                console.log("ARRAY ARRAY ARRAY ", multipleToppingOptionArray);
                const index = multipleToppingOptionArray.findIndex(
                  (e, index) => {
                    console.log("PRODUCT PRODUCT PRODUCT", e.product);
                    console.log("NAME NAME NAME", e.name);
                    if (e.product === product.id && e.name === option.name) {
                      return index;
                    } else {
                      return -1;
                    }
                  }
                );
                console.log("INDEX INDEX INDEX", index);
                if (option.name && option.multiple) {
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

    multipleToppingOptionArray.forEach((optionMultiple) => {
      if (finalArray.length > 0) {
        const index = finalArray.findIndex(
          (e) =>
            e.product === optionMultiple.product &&
            e.name === optionMultiple.name
        );
        if (index != -1) {
          finalArray[index].count += 1;
        } else {
          finalArray.push({
            product: optionMultiple.product,
            name: optionMultiple.name,
            count: 1,
          });
        }
      } else {
        finalArray.push({
          product: optionMultiple.product,
          name: optionMultiple.name,
          count: optionMultiple.count,
        });
      }
    });

    console.log("MULTIPLE TOPPING OPTION FINAL ARRAY ", finalArray);

    let message = "Order :";
    message += "%0a";
    message += "%0a";
    data.length > 0 &&
      data.forEach((item) => {
        message += item.name + " ";
        message += "*" + item.count + " =";
        message += " " + item.total + "%0a";
        if (item.options) {
          if (Object.keys(item.options).length > 0) {
            // message += JSON.stringify(item.toppings) + "%0a"
            Object.keys(item.options).forEach((key) => {
              message += "  " + key + " :" + "%0a";
              if (Array.isArray(item.options[key])) {
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
                  finalArray.forEach((option) => {
                    if (option.product === item.id) {
                      message +=
                        "    " + option.name + "*" + option.count + "%0a";
                    }
                  });
                } else {
                  item.options[key].forEach((e, index) => {
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
                message += "    " + item.options[key].name + "%0a";
              }
            });
          }
        }
        message += "%0a";
      });

    if (total) {
      message += "Total : " + total;
    }
    if (user && deliveryAddress && userDetails) {
      message += "%0a";
      message += "%0a";
      message += user.first_name + " " + user.last_name + "%0a";
      message += deliveryAddress.city + "%0a";
      message += deliveryAddress.address + "%0a";
      message += deliveryAddress.floor + "%0a";
      message += deliveryAddress.appartment + "%0a";
      message += userDetails.phone + "%0a";
    }
    message += "Delivery Date : " + deliveryDate;

    console.log("PHONE ", restaurant.phone);

    const url = `https://wa.me/${restaurant.phone}?text=${message}`;
    // https://wa.me/972587849377?text=I'm%20interested%20in%20your%20car%20for%20sale
    return url;
  };

  console.log("DATA ", data);

  const renderMultipleTopping = (
    multipleToppingNames,
    options,
    key,
    multipleToppingOptionNames
  ) => {
    let multipleToppingOptionArray = [];

    multipleToppingOptionNames.forEach((name) => {
      const filteredArray = options.filter((e) => e.name === name);
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
      return options.map((topping) => {
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
      product.options &&
      Object.keys(product.options).map((key) => {
        console.log(key);
        console.log(product.options[key]);

        // Filter multiple topping

        // Which topping and how is multiple ?

        let multipleToppingNames = [];
        let multipleToppingOptionNames = [];

        for (let i = 0; i < product.options[key].length; i++) {
          if (
            product.options[key][i].name &&
            product.options[key][i].multiple
          ) {
            multipleToppingNames.push(key);
            break;
          }
        }

        Array.isArray(product.options[key]) &&
          product.options[key].forEach((topping) => {
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

        if (Array.isArray(product.options[key])) {
          return (
            <Box display="flex">
              <Typography>{key + " : "}</Typography>

              <Typography ml={1} display="flex" flexDirection="row">
                {renderMultipleTopping(
                  multipleToppingNames,
                  product.options[key],
                  key,
                  multipleToppingOptionNames
                )}
              </Typography>
            </Box>
          );
        } else {
          return (
            <Typography>{key + " : " + product.options[key].name}</Typography>
          );
        }
      })
    );
  };

  if (!customerDetails) {
    return <div>Loading...</div>;
  }

  const sendOrder = async () => {
    // const response = await axios.post("http://localhost:8000/order", {});
    // console.log("response ", response);
    window.location.replace(
      "https://payments.payplus.co.il/a8344bf1-c85e-4300-a5c6-11dc8e9d1be0"
    );

    //AIzaSyCMf3e-EcZAKTg6qtatJ5e_zAFE-bRmvq4
  };

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
                  image={product.image}
                  alt="Live from space album cover"
                />
              </Box>
            </Box>
          ))}
      </Box>
      <Box m={3}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Choose delivery address
          </InputLabel>
          {/* <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={deliveryAddress}
            label="Choose delivery address"
            onChange={(e) => setDeliveryAddress(e.target.value)}
          >
            {userDetails.addresses &&
              userDetails.addresses.map((option) => (
                <MenuItem value={option}>
                  {option.name} - {option.address} - {option.city}
                </MenuItem>
              ))}
          </Select> */}
          <Select
            labelId="demo-simple-select-label"
            label="Choose delivery address"
            value={deliveryAddress.formatted_address}
            inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
              <Autocomplete
                apiKey={"AIzaSyCMf3e-EcZAKTg6qtatJ5e_zAFE-bRmvq4"}
                {...props}
                onPlaceSelected={(place) => {
                  setDeliveryAddress(place);
                }}
                options={{
                  componentRestrictions: { country: "il" },
                  types: ["address"],
                }}
              />
            )}
          />
        </FormControl>
        {checkDeliveryArea()}
      </Box>
      <Box m={3}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Choose delivery date
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={deliveryDate}
            label="Choose delivery date"
            onChange={(e) => setDeliveryDate(e.target.value)}
          >
            {deliveryOptions.map((option) => (
              <MenuItem value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box m={3} display="flex" flexDirection="row" justifyContent="center">
        {/* <a href={renderUrlMessage()}>
          <Button variant="contained">Order on Whatsapp</Button>
        </a> */}
        <Button onClick={sendOrder} variant="contained">
          Order on Whatsapp
        </Button>
      </Box>
    </Dialog>
  );
};
