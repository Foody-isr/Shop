import {
  Box,
  Button,
  Card,
  CardMedia,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  Radio,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSelectedProductDialog, resetSelectedProductDialog } from "./state/productSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { set } from "date-fns";
import {
  ElevatorSharp,
  IndeterminateCheckBox,
  IndeterminateCheckBoxTwoTone,
} from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import { v4 as uuidv4 } from 'uuid';

export const ProductDetails = ({ addProductToCart }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const open = useSelector((state) => state.product.selectedProductDialog.open);
  const defaultData = useSelector(
    (state) => state.product.selectedProductDialog.defaultData
  );
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState(null);
  const [checked, setChecked] = useState(false);

  console.log('DEFAULT DATA ', defaultData);
  console.log('SELECTED TOPPINGS SELECTED TOPPINGS SELECTED TOPPINGS', selectedToppings);
  useEffect(() => {
    if (defaultData) {
      setTotal(defaultData.price)
      setSelectedToppings(null)
      let hash = {};
      defaultData.toppings &&
        defaultData.toppings.forEach((topping) => {
          if (topping.max_choices == 1) {
            hash[topping.name] = { name: null, price: null };
            setSelectedToppings((selectedToppings) => ({
              ...selectedToppings,
              ...hash,
            }));
          } else if (topping.max_choices > 1) {
            hash[topping.name] = [];
            // topping.product_toppings_options.forEach(option => {
            //     hash[topping.name].push({name: null, price:null})
            // })
            for (let i = 0; i < topping.max_choices; i++) {
              hash[topping.name].push({ name: null, price: null });
            }
            setSelectedToppings((selectedToppings) => ({
              ...selectedToppings,
              ...hash,
            }));
          }
        });
    }

  }, [defaultData, open])

  useEffect(() => {
    setTotal(defaultData.price * count);
  }, [count]);

//   useEffect(() => {

//   }, [open]);

  useEffect(() => {
    setTotal(parseInt(defaultData.price));
    let totalTmp = parseInt(defaultData.price);
    selectedToppings && Object.keys(selectedToppings).forEach((key, index) => {
      //   console.log(`${key}: ${selectedToppings[key]}`);
      if (Array.isArray(selectedToppings[key])) {
        //Search for free_choices of this topping
        const indexTopping = defaultData.toppings.findIndex(
          (e) => e.name === key
        );

        const free_choices = indexTopping != -1 && defaultData.toppings[indexTopping].free_choices;
        // console.log("FREE CHOICES ", key, free_choices);

        // Remove all selected option to calcul how free option is already choose
        const newArray = selectedToppings[key].filter((e) => e.name);

        // selectedToppings[key].forEach(e =>{
        //     if(e.price){
        //         // If already choosed all free_choices so add option price

        //         if (newArray.length > free_choices) {
        //             console.log('PRICE ', e.price)
        //             totalTmp = parseInt(totalTmp) + parseInt(e.price)
        //           }
        //     }
        // })
        for (let i = free_choices; i < newArray.length; i++) {
          if (selectedToppings[key][i].price) {
            // If already choosed all free_choices so add option price

            if (newArray.length > free_choices) {
              console.log("PRICE ", selectedToppings[key][i].price);
              totalTmp =
                parseInt(totalTmp) + parseInt(selectedToppings[key][i].price);
            }
          }
        }
      } else {
        if (selectedToppings[key].price) {
          // setTotal(parseInt(defaultData.price) + parseInt(selectedToppings[key].price))
          totalTmp = parseInt(totalTmp) + parseInt(selectedToppings[key].price);
        }
      }
    });
    setTotal(totalTmp);
  }, [selectedToppings]);

  const onClose = () => {
    setCount(1)
    setTotal(defaultData.price)
    setSelectedToppings(null);
    dispatch(closeSelectedProductDialog());
    dispatch(resetSelectedProductDialog())
  };

  const incrementCount = () => {
    setCount(count + 1);
    // setTotal(total*count)
  };

  const decrementCount = () => {
    if (count === 1) {
    } else {
      setCount(count - 1);
    }
  };

  const handleSubmit = () => {
    //   console.log("SUBMIT", selectedToppings)
    // console.log("SUBMIT", defaultData);
    const array = []
    const { name, description, picture, price, } = defaultData;
    const result = {
      id: uuidv4(),
      name,
      description,
      picture,
      price,
      toppings: selectedToppings,
      total: parseInt(total),
      count: count,

    };
    console.log("SUBMIT", result);
    // for(let i = 0; i<count; i++){
    //     console.log('FOR LOOP', count)
    //     array.push(result)
    // }
    addProductToCart(result);
    onClose()
  };

  const selectCheckbox = (toppingIndex, optionIndex, topping, option) => {
    if (topping.max_choices == 1) {
      let updatedValue = {};
      if (selectedToppings[topping.name].name === option.name) {
        updatedValue[topping.name] = { name: null, price: null};
      } else {
        updatedValue[topping.name] = { name: option.name, price: option.price };
      }
      setSelectedToppings((selectedToppings) => ({
        ...selectedToppings,
        ...updatedValue,
      }));
    } else if (topping.max_choices > 1) {
      const cloneArray = [...selectedToppings[topping.name]];

      if (typeof cloneArray[optionIndex] == "undefined") {
        if (cloneArray[cloneArray.length - 1].name === option.name) {
          cloneArray[cloneArray.length - 1] = { name: null, price: null };
        } else {
          cloneArray[cloneArray.length - 1] = {
            name: option.name,
            price: option.price,
            multiple: option.multiple
          };
        }
        let updatedValue = {};
        updatedValue[topping.name] = cloneArray;
        setSelectedToppings((selectedToppings) => ({
          ...selectedToppings,
          ...updatedValue,
        }));
      } else {
        if (cloneArray[optionIndex].name === option.name) {
          cloneArray[optionIndex] = { name: null, price: null };
        } else {
          cloneArray[optionIndex] = { name: option.name, price: option.price, multiple: option.multiple };
        }
        let updatedValue = {};
        updatedValue[topping.name] = cloneArray;
        setSelectedToppings((selectedToppings) => ({
          ...selectedToppings,
          ...updatedValue,
        }));
      }
    }
  };

  const renderCheck = (topping, option) => {
    console.log('RENDER CHECK')
    console.log("SELECTED TOPPINGS ", selectedToppings);
    if (selectedToppings && topping.max_choices <= 1) {
      if (
        selectedToppings[topping.name] &&
        selectedToppings[topping.name].name === option.name
      ) {
        return true;
      }
      return false;
    } else if (selectedToppings && topping.max_choices > 1) {
      const index =
        selectedToppings[topping.name] &&
        selectedToppings[topping.name].findIndex((e) => e.name === option.name);
      if (index !== -1) {
        return true;
      } else {
        return false;
      }
    }
  };

  const renderDisabled = (topping, option) => {

    // console.log('RENDER DISABLED ', topping)
    // console.log('RENDER DISABLED ', option)
    const selectedToppingObject = selectedToppings && selectedToppings[topping.name];
    // console.log('RENDER DISABLED selectedToppingObject ', selectedToppingObject)
    let boolean = false;


    if(Array.isArray(selectedToppingObject)){
        const max_choices = topping.max_choices;
        const filteredArray = selectedToppingObject.filter(e => e.name)
        const index = selectedToppingObject.findIndex(e => e.name === option.name);
        if(filteredArray.length > 0 && filteredArray.length >= max_choices && index == -1){
            boolean = true;
        }
        console.log('RENDER DISABLED FILTERED ARRAY ', filteredArray)
    }else{
        if((selectedToppingObject && selectedToppingObject.name && selectedToppingObject.name !== option.name )){
            boolean = true;
        }
    }

    return boolean
    // const toppingIndex = selectedToppings.findIndex( toppingElement => toppingElement.name === topping.name)
    // let condition = false;
    // if(toppingIndex !== -1){
    //     const optionIndex = selectedToppings[toppingIndex].options.findIndex( e => e.name === option.name );
    //     selectedToppings[toppingIndex].options.forEach((optionElement, index) => {
    //         console.log('ELEMENT ', optionElement)
    //         if(optionElement.checked && index !== optionIndex){
    //             console.log('CHECKED ', optionElement)
    //             condition = true;
    //             return condition;
    //         }
    //     })
    // }
    // return condition;
  };

  const incrementMultiple = (toppingindex, optionIndex, topping, option) => {
    const cloneArray = [...selectedToppings[topping.name]];
    for (let i = 0; i < cloneArray.length; i++) {
      if (!cloneArray[i].name) {
        cloneArray[i] = { name: option.name, price: option.price, multiple: option.multiple };
        break;
      }
    }
    let updatedValue = {};
    updatedValue[topping.name] = cloneArray;
    setSelectedToppings((selectedToppings) => ({
      ...selectedToppings,
      ...updatedValue,
    }));
  };

  const decrementMultiple = (toppingindex, optionIndex, topping, option) => {
    const cloneArray = [...selectedToppings[topping.name]];
    for (let i = 0; i < cloneArray.length; i++) {
      if (cloneArray[i].name === option.name) {
        cloneArray[i] = { name: null, price: null };
        break;
      }
    }
    let updatedValue = {};
    updatedValue[topping.name] = cloneArray;
    setSelectedToppings((selectedToppings) => ({
      ...selectedToppings,
      ...updatedValue,
    }));
  };

  const renderLabel = (toppingIndex, optionIndex, topping, option) => {
    const free_choices = defaultData.toppings[toppingIndex].free_choices;
    // console.log("FREE CHOICES ", topping.name, free_choices);
    let newArray = [];
    let boolean = false;
    if(selectedToppings){
        Object.keys(selectedToppings).forEach((key, index) => {
            if (key === topping.name && Array.isArray(selectedToppings[key])) {
              newArray = selectedToppings[key].filter((e) => e.name);
              if (newArray.length >= topping.free_choices) {
                boolean = true;
              }
            }
          });
    }

    let selectedOptionIndex =
      selectedToppings && Array.isArray(selectedToppings[topping.name]) &&
      selectedToppings[topping.name].findIndex((e) => e.name === option.name);

    console.log("OPTION ", option);

    // console.log("NEW ARRAY ", newArray);
    // if (boolean && selectedOptionIndex === -1)
    if (boolean && selectedOptionIndex === -1) {
      return <Typography>{option.name + ` + ${option.price}`}</Typography>;
    } else if (boolean && option.multiple) {
      return <Typography>{option.name + ` + ${option.price}`}</Typography>;
    } else if (
       selectedToppings &&
      !Array.isArray(selectedToppings[topping.name]) &&
      option.price > 0
    ) {
      return <Typography>{option.name + ` + ${option.price}`}</Typography>;
    } else {
      return <Typography>{option.name}</Typography>;
    }
  };

  const renderToppingOption = (toppingIndex, optionIndex, topping, option) => {
    const disabled = renderDisabled(topping, option);
    console.log("DISABLED ", disabled);

    // Check how many choices are already selected
    let newArrayEachOptionSelected = [];
    let newArrayAllOptionsSelected = [];
    if (selectedToppings && Array.isArray(selectedToppings[topping.name])) {
      newArrayAllOptionsSelected = selectedToppings[topping.name].filter(
        (e) => e.name
      );
    }

    if (selectedToppings && Array.isArray(selectedToppings[topping.name])) {
      newArrayEachOptionSelected = selectedToppings[topping.name].filter(
        (e) => e.name === option.name
      );
    }

    console.log(
      "ALL OPTIONS ALREADY SELECTED ",
      newArrayAllOptionsSelected.length
    );

    return (
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <FormControlLabel
          control={
            <Checkbox
              onChange={() =>
                selectCheckbox(toppingIndex, optionIndex, topping, option)
              }
              checked={renderCheck(topping, option)}
              disabled={disabled}
            />
          }
          label={renderLabel(toppingIndex, optionIndex, topping, option)}
        />

        {option.multiple && newArrayEachOptionSelected.length > 0 ? (
          <Box>
            <IconButton
              color="primary"
              onClick={() =>
                decrementMultiple(toppingIndex, optionIndex, topping, option)
              }
            >
              <RemoveCircleOutlineIcon fontSize={"large"} />
            </IconButton>
            <Typography variant="button">
              {newArrayEachOptionSelected.length}
            </Typography>
            <IconButton
              color="primary"
              onClick={() =>
                incrementMultiple(toppingIndex, optionIndex, topping, option)
              }
              disabled={
                topping.max_choices === newArrayAllOptionsSelected.length
              }
            >
              <AddCircleOutlineIcon fontSize={"large"} />
            </IconButton>
          </Box>
        ) : null}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box>
        <CardMedia
          component="img"
          image={defaultData.picture}
          alt="Live from space album cover"
        />
        <Box p={5} mb={5}>
          <Typography variant="h2">{defaultData.name}</Typography>
          <Box>
            {defaultData.toppings &&
              defaultData.toppings.map((topping, toppingIndex) => (
                <Box>
                  <Typography variant="h4" sx={{ marginTop: "12px" }}>
                    {topping.name}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "2px" }}>
                    {topping.max_choices > 1
                      ? `Up to ${topping.max_choices} choices `
                      : `Up to ${topping.max_choices} choice `}
                  </Typography>
                  {topping.free_choices > 0 ? (
                    <Typography
                      variant="body2"
                      sx={{ marginTop: "2px" }}
                      color="primary"
                    >
                      {topping.free_choices > 1
                        ? `The first ${topping.free_choices} are free`
                        : `The first ${topping.free_choices} is free`}
                    </Typography>
                  ) : null}
                  <Box display="flex" flexDirection="column">
                    {topping.product_toppings_options.map(
                      (option, optionIndex) =>
                        renderToppingOption(
                          toppingIndex,
                          optionIndex,
                          topping,
                          option
                        )
                    )}
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
        <Box sx={{ position: "sticky", bottom: 0 }}>
          <Card
            variant="outlined"
            sx={{ boxShadow: "rgba(0, 0, 0, 0.30) 0px 5px 15px" }}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <IconButton
                color="primary"
                onClick={decrementCount}
                disabled={count === 1}
              >
                <RemoveCircleOutlineIcon fontSize={"large"} />
              </IconButton>
              <Typography
                variant="button"
                fontSize={22}
                sx={{ marginLeft: "50px", marginRight: "50px" }}
              >
                {count}
              </Typography>
              <IconButton color="primary" onClick={() => incrementCount()}>
                <AddCircleOutlineIcon fontSize={"large"} />
              </IconButton>
            </Box>
            <Box m={3}>
              <Button
                variant="contained"
                sx={{ height: "50px" }}
                fullWidth
                onClick={handleSubmit}
              >
                <Typography variant="h4" fontWeight={900}>
                  Add for {total} ₪
                </Typography>
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </Dialog>
  );
};
