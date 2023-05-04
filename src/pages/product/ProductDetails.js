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
import {
  closeSelectedProductDialog,
  resetSelectedProductDialog,
} from "./state/productSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { set } from "date-fns";
import {
  ElevatorSharp,
  IndeterminateCheckBox,
  IndeterminateCheckBoxTwoTone,
} from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import { v4 as uuidv4 } from "uuid";

export const ProductDetails = ({ addProductToCart }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const open = useSelector((state) => state.product.selectedProductDialog.open);
  const defaultData = useSelector(
    (state) => state.product.selectedProductDialog.defaultData
  );
  console.log("DEFAULT DATA ", defaultData);
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(null);
  const [validationError, setValidationError] = useState(null);

  console.log("VALIDATION ERROR ", validationError);
  const [selectedOptions, setSelectedOptions] = useState(null);
  console.log("selectedOptions ", selectedOptions);
  const [checked, setChecked] = useState(false);

  // console.log("DEFAULT DATA ", defaultData);
  // console.log(
  //   "SELECTED OPTIONS SELECTED OPTIONS SELECTED OPTIONS",
  //   selectedOptions
  // );
  useEffect(() => {
    if (defaultData) {
      setTotal(defaultData.price);
      setSelectedOptions(null);
      let hash = {};
      defaultData.options &&
        defaultData.options.forEach((topping) => {
          if (topping.maxChoices == 1) {
            hash[topping.name] = { name: null, price: null };
            setSelectedOptions((selectedOptions) => ({
              ...selectedOptions,
              ...hash,
            }));
          } else if (topping.maxChoices > 1) {
            hash[topping.name] = [];
            // topping.product_toppings_options.forEach(option => {
            //     hash[topping.name].push({name: null, price:null})
            // })
            for (let i = 0; i < topping.maxChoices; i++) {
              hash[topping.name].push({ name: null, price: null });
            }
            setSelectedOptions((selectedOptions) => ({
              ...selectedOptions,
              ...hash,
            }));
          }
        });
    }
  }, [defaultData, open]);

  useEffect(() => {
    setTotal(defaultData.price * count);
  }, [count]);

  useEffect(() => {}, [validationError]);

  //   useEffect(() => {

  //   }, [open]);

  useEffect(() => {
    setTotal(parseInt(defaultData.price));
    let totalTmp = parseInt(defaultData.price);
    selectedOptions &&
      Object.keys(selectedOptions).forEach((key, index) => {
        //   console.log(`${key}: ${selectedToppings[key]}`);
        if (Array.isArray(selectedOptions[key])) {
          //Search for free_choices of this topping
          const indexTopping = defaultData.options.findIndex(
            (e) => e.name === key
          );

          const freeChoices =
            indexTopping != -1 && defaultData.options[indexTopping].freeChoices;
          // console.log("FREE CHOICES ", key, free_choices);

          // Remove all selected option to calcul how free option is already choose
          const newArray = selectedOptions[key].filter((e) => e.name);

          // selectedToppings[key].forEach(e =>{
          //     if(e.price){
          //         // If already choosed all free_choices so add option price

          //         if (newArray.length > free_choices) {
          //             console.log('PRICE ', e.price)
          //             totalTmp = parseInt(totalTmp) + parseInt(e.price)
          //           }
          //     }
          // })
          for (let i = freeChoices; i < newArray.length; i++) {
            if (selectedOptions[key][i].price) {
              // If already choosed all free_choices so add option price

              if (newArray.length > freeChoices) {
                console.log("PRICE ", selectedOptions[key][i].price);
                totalTmp =
                  parseInt(totalTmp) + parseInt(selectedOptions[key][i].price);
              }
            }
          }
        } else {
          if (selectedOptions[key].price) {
            // setTotal(parseInt(defaultData.price) + parseInt(selectedToppings[key].price))
            totalTmp =
              parseInt(totalTmp) + parseInt(selectedOptions[key].price);
          }
        }
      });
    setTotal(totalTmp);
  }, [selectedOptions]);

  const onClose = () => {
    setCount(1);
    setTotal(defaultData.price);
    setSelectedOptions(null);
    dispatch(closeSelectedProductDialog());
    dispatch(resetSelectedProductDialog());
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

  const handleValidation = async () => {
    const promise = new Promise((resolve, reject) => {
      if (!selectedOptions && defaultData.options.length == 0) {
        resolve(true);
      }
      Object.keys(selectedOptions).forEach((key) => {
        defaultData.options.forEach((o) => {
          if (key === o.name) {
            console.log("key ", key);
            console.log("selectedOptions ", selectedOptions[key]);
            console.log("name ", o.name);
            console.log("option min choice ", o.minChoices);
            if (selectedOptions[key].name == null && o.minChoices >= 1) {
              console.log("SET ERROR");
              const productId = defaultData._id;
              const error = { [productId]: { error: "Missing choice" } };
              setValidationError(error);
              resolve(false);
            }
            resolve(true);
          }
        });
      });
    });

    const result = await promise;
    return result;
  };

  const handleSubmit = async () => {
    try {
      const array = [];
      const { name, description, image, price } = defaultData;

      console.log("SELECTED OPTIONS ", selectedOptions);

      const result = {
        id: uuidv4(),
        name,
        description,
        image,
        price,
        options: selectedOptions || [],
        total: parseInt(total),
        count: count,
      };
      const validation = await handleValidation();
      if (!validation) {
        console.log("VALIDATION ERROR ", validation);
      } else {
        addProductToCart(result);
        onClose();
      }
    } catch (err) {
      console.log("err ", err);
    }
  };

  const selectCheckbox = (toppingIndex, optionIndex, topping, option) => {
    // console.log('selectCheckbox - topping ', topping)
    // console.log('selectCheckbox - option ', option)
    if (topping.maxChoices == 1) {
      // console.log('selectedOptions[topping.name] ', selectedOptions[topping.name])
      let updatedValue = {};
      if (selectedOptions[topping.name].name === option.name) {
        updatedValue[topping.name] = { name: null, price: null };
      } else {
        // console.log('updatedValue - option ', option)
        updatedValue[topping.name] = { name: option.name, price: option.price };
      }
      setSelectedOptions((selectedOptions) => ({
        ...selectedOptions,
        ...updatedValue,
      }));
    } else if (topping.maxChoices > 1) {
      const cloneArray = [...selectedOptions[topping.name]];

      if (typeof cloneArray[optionIndex] == "undefined") {
        if (cloneArray[cloneArray.length - 1].name === option.name) {
          cloneArray[cloneArray.length - 1] = { name: null, price: null };
        } else {
          cloneArray[cloneArray.length - 1] = {
            name: option.name,
            price: option.price,
            multiple: option.multiple,
          };
        }
        let updatedValue = {};
        updatedValue[topping.name] = cloneArray;
        setSelectedOptions((selectedOptions) => ({
          ...selectedOptions,
          ...updatedValue,
        }));
      } else {
        if (cloneArray[optionIndex].name === option.name) {
          cloneArray[optionIndex] = { name: null, price: null };
        } else {
          cloneArray[optionIndex] = {
            name: option.name,
            price: option.price,
            multiple: option.multiple,
          };
        }
        let updatedValue = {};
        updatedValue[topping.name] = cloneArray;
        setSelectedOptions((selectedOptions) => ({
          ...selectedOptions,
          ...updatedValue,
        }));
      }
    }
  };

  const renderCheck = (topping, option) => {
    // console.log('RENDER CHECK')
    // console.log("SELECTED TOPPINGS ", selectedOptions);
    if (selectedOptions && topping.maxChoices <= 1) {
      if (
        selectedOptions[topping.name] &&
        selectedOptions[topping.name].name === option.name
      ) {
        return true;
      }
      return false;
    } else if (selectedOptions && topping.maxChoices > 1) {
      const index =
        selectedOptions[topping.name] &&
        selectedOptions[topping.name].findIndex((e) => e.name === option.name);
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
    const selectedToppingObject =
      selectedOptions && selectedOptions[topping.name];
    // console.log('RENDER DISABLED selectedToppingObject ', selectedToppingObject)
    let boolean = false;

    if (Array.isArray(selectedToppingObject)) {
      const maxChoices = topping.maxChoices;
      const filteredArray = selectedToppingObject.filter((e) => e.name);
      const index = selectedToppingObject.findIndex(
        (e) => e.name === option.name
      );
      if (
        filteredArray.length > 0 &&
        filteredArray.length >= maxChoices &&
        index == -1
      ) {
        boolean = true;
      }
      // console.log('RENDER DISABLED FILTERED ARRAY ', filteredArray)
    } else {
      if (
        selectedToppingObject &&
        selectedToppingObject.name &&
        selectedToppingObject.name !== option.name
      ) {
        boolean = true;
      }
    }

    return boolean;
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
    const cloneArray = [...selectedOptions[topping.name]];
    for (let i = 0; i < cloneArray.length; i++) {
      if (!cloneArray[i].name) {
        cloneArray[i] = {
          name: option.name,
          price: option.price,
          multiple: option.multiple,
        };
        break;
      }
    }
    let updatedValue = {};
    updatedValue[topping.name] = cloneArray;
    setSelectedOptions((selectedOptions) => ({
      ...selectedOptions,
      ...updatedValue,
    }));
  };

  const decrementMultiple = (toppingindex, optionIndex, topping, option) => {
    const cloneArray = [...selectedOptions[topping.name]];
    for (let i = 0; i < cloneArray.length; i++) {
      if (cloneArray[i].name === option.name) {
        cloneArray[i] = { name: null, price: null };
        break;
      }
    }
    let updatedValue = {};
    updatedValue[topping.name] = cloneArray;
    setSelectedOptions((selectedOptions) => ({
      ...selectedOptions,
      ...updatedValue,
    }));
  };

  const renderLabel = (toppingIndex, optionIndex, topping, option) => {
    const freeChoices = defaultData.options[toppingIndex].freeChoices;
    // console.log("FREE CHOICES ", topping.name, free_choices);
    let newArray = [];
    let boolean = false;
    if (selectedOptions) {
      Object.keys(selectedOptions).forEach((key, index) => {
        if (key === topping.name && Array.isArray(selectedOptions[key])) {
          newArray = selectedOptions[key].filter((e) => e.name);
          if (newArray.length >= topping.freeChoices) {
            boolean = true;
          }
        }
      });
    }

    let selectedOptionIndex =
      selectedOptions &&
      Array.isArray(selectedOptions[topping.name]) &&
      selectedOptions[topping.name].findIndex((e) => e.name === option.name);

    // console.log("OPTION ", option);

    // console.log("NEW ARRAY ", newArray);
    // if (boolean && selectedOptionIndex === -1)
    if (boolean && selectedOptionIndex === -1) {
      return <Typography>{option.name + ` + ${option.price}`}</Typography>;
    } else if (boolean && option.multiple) {
      return <Typography>{option.name + ` + ${option.price}`}</Typography>;
    } else if (
      selectedOptions &&
      !Array.isArray(selectedOptions[topping.name]) &&
      option.price > 0
    ) {
      return <Typography>{option.name + ` + ${option.price}`}</Typography>;
    } else {
      return <Typography>{option.name}</Typography>;
    }
  };

  const renderToppingOption = (toppingIndex, optionIndex, topping, option) => {
    // console.log('OPTION OPTION ', option)
    const disabled = renderDisabled(topping, option);
    // console.log("DISABLED ", disabled);

    // Check how many choices are already selected
    let newArrayEachOptionSelected = [];
    let newArrayAllOptionsSelected = [];
    if (selectedOptions && Array.isArray(selectedOptions[topping.name])) {
      newArrayAllOptionsSelected = selectedOptions[topping.name].filter(
        (e) => e.name
      );
    }

    if (selectedOptions && Array.isArray(selectedOptions[topping.name])) {
      newArrayEachOptionSelected = selectedOptions[topping.name].filter(
        (e) => e.name === option.name
      );
    }

    // console.log(
    //   "ALL OPTIONS ALREADY SELECTED ",
    //   newArrayAllOptionsSelected.length
    // );

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
                topping.maxChoices === newArrayAllOptionsSelected.length
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
          image={defaultData.image}
          alt="Live from space album cover"
        />
        <Box p={5} mb={5}>
          <Typography variant="h2">{defaultData.name}</Typography>
          <Box>
            {defaultData.options &&
              defaultData.options.map((topping, toppingIndex) => (
                <Box>
                  <Typography variant="h4" sx={{ marginTop: "12px" }}>
                    {topping.name}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "2px" }}>
                    {topping.maxChoices > 1
                      ? `Up to ${topping.maxChoices} choices `
                      : `Up to ${topping.maxChoices} choice `}
                  </Typography>
                  {topping.freeChoices > 0 ? (
                    <Typography
                      variant="body2"
                      sx={{ marginTop: "2px" }}
                      color="primary"
                    >
                      {topping.freeChoices > 1
                        ? `The first ${topping.freeChoices} are free`
                        : `The first ${topping.freeChoices} is free`}
                    </Typography>
                  ) : null}
                  <Box display="flex" flexDirection="column">
                    {topping.choices.map((option, optionIndex) =>
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
          {validationError && validationError[defaultData._id] && (
            <Box>
              <Typography variant="caption" color={"red"}>
                {validationError[defaultData._id].error}
              </Typography>
            </Box>
          )}
        </Box>
        <Box></Box>
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
