import { ConstructionOutlined } from "@mui/icons-material";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const SignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
      console.log(email , password)
      await signIn(email ,password)
      navigate('/')
  }

  return (
    <Container maxWidth={"sm"}>
      <Box mb={10}>
        <Typography variant="h4">Sign In</Typography>
      </Box>
      <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            sx={{marginBottom: '20px'}}
          />
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            sx={{marginBottom: '20px'}}
          />
        <Button
        variant="contained"
        type={"submit"}
        onClick={handleSubmit}
        >
            Sign in
            </Button>
      </Box>
    </Container>
  );
};
