// import { ConstructionOutlined, NearMe } from "@mui/icons-material";
// import {
//   Box,
//   Button,
//   Container,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import { fetchAllCities } from "../restaurant/state/restaurantsSlice";

// export const SignUp = () => {
// const dispatch = useDispatch()
//     useEffect(() => {
//         dispatch(fetchAllCities())
//     }, [])

//   const cities = useSelector(state => state.restaurants.cities)
//   const { signUp } = useAuth();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [city, setCity] = useState("");
//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");
//   const [buildingType, setBuildingType] = useState("");
//   const [floor, setFloor] = useState("");
//   const [apartmentNumber, setApartmentNumber] = useState("");

//   const handleSubmit = async () => {
//     console.log(email, password);
//     const addresses = [
//         {
//             name: 'Default',
//             city,
//             address,
//             buildingType,
//             floor,
//             appartment: apartmentNumber
//         }
//     ]
//     const customer = {
//         name,
//         phone,
//         addresses
//     }
//     await signUp(email, password, customer);
//     navigate("/");
//   };

//   return (
//     <Container maxWidth={"sm"}>
//       <Box mb={10}>
//         <Typography variant="h4">Sign Up</Typography>
//       </Box>
//       <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
//         <TextField
//           id="outlined-basic"
//           label="Full Name"
//           variant="outlined"
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           sx={{ marginBottom: "20px" }}
//         />
//         <TextField
//           id="outlined-basic"
//           label="Email"
//           variant="outlined"
//           onChange={(e) => setEmail(e.target.value)}
//           value={email}
//           sx={{ marginBottom: "20px" }}
//         />
//         <TextField
//           id="outlined-basic"
//           label="Password"
//           variant="outlined"
//           onChange={(e) => setPassword(e.target.value)}
//           value={password}
//           sx={{ marginBottom: "20px" }}
//         />
//         <TextField
//           id="outlined-basic"
//           label="Phone"
//           variant="outlined"
//           onChange={(e) => setPhone(e.target.value)}
//           value={phone}
//           sx={{ marginBottom: "20px" }}
//         />
//         <Box display="flex" flexDirection="row">
//         <FormControl fullWidth>
//             <InputLabel id="demo-simple-select-label">
//               Choose city
//             </InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               value={city}
//               label="Choose delivery date"
//               onChange={(e) => setCity(e.target.value)}
//             >
//                 {cities.map(city => (
//                     <MenuItem value={city.name}>{city.name}</MenuItem>
//                 ))}
//             </Select>
//           </FormControl>
//           <TextField
//             fullWidth
//             id="outlined-basic"
//             label="Address"
//             variant="outlined"
//             onChange={(e) => setAddress(e.target.value)}
//             value={address}
//             sx={{ marginBottom: "20px" }}
//           />
//         </Box>

//         <FormControl fullWidth sx={{marginBottom: "20px"}}>
//             <InputLabel id="demo-simple-select-label">
//               Kind of place
//             </InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               value={buildingType}
//               label="Kind of place"
//               onChange={(e) => setBuildingType(e.target.value)}
//             >
//                 <MenuItem value={'Apartment'}>Apartment</MenuItem>
//                 <MenuItem value={'House'}>House</MenuItem>

//             </Select>
//           </FormControl>

//           {
//               buildingType === 'Apartment'
//               ?
//               <Box display="flex" flexDirection="row">
//               <TextField
//                 type="number"
//                 fullWidth
//                 id="outlined-basic"
//                 label="Floor"
//                 variant="outlined"
//                 onChange={(e) => setFloor(e.target.value)}
//                 value={floor}
//                 sx={{ marginBottom: "20px" }}
//               />
//               <TextField
//                 type="number"
//                 fullWidth
//                 id="outlined-basic"
//                 label="Apartment Number"
//                 variant="outlined"
//                 onChange={(e) => setApartmentNumber(e.target.value)}
//                 value={apartmentNumber}
//                 sx={{ marginBottom: "20px" }}
//               />
//             </Box>
//               : null
//           }
//         <Button variant="contained" type={"submit"} onClick={handleSubmit}>
//           Sign up
//         </Button>
//       </Box>
//     </Container>
//   );
// };
