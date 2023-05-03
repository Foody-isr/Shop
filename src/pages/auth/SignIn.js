import { ConstructionOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeModal } from "./state/authSlice";
import { useAuthContext } from "../../auth/useAuthContext";

export const SignIn = () => {
  const { signUpWithPhone, isCodeLoading, confirmPhone } = useAuthContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const modalOpen = useSelector((state) => state.auth.modalOpen);

  // console.log("IS CODE LOADING ", isCodeLoading);

  const handleSubmit = async () => {
    //   console.log(phone , password)
    //   await signIn(phone ,password)
    //   navigate('/')
    await signUpWithPhone(phone);
  };

  const handleVerifyCode = async () => {
    //   console.log(phone , password)
    //   await signIn(phone ,password)
    //   navigate('/')
    await confirmPhone(phone, code);
  };

  const renderVerificationCode = () => {
    return (
      <>
        <Box mb={10}>
          <Typography variant="h4">Verify Code</Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          <TextField
            id="outlined-basic"
            label="Verification code"
            variant="outlined"
            onChange={(e) => setCode(e.target.value)}
            value={code}
            sx={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            type={"submit"}
            onClick={handleVerifyCode}
          >
            Verify code
          </Button>
        </Box>
      </>
    );
  };
  return (
    <Dialog open={modalOpen} onClose={() => dispatch(closeModal())}>
      <Container maxWidth={"sm"}>
        {isCodeLoading ? (
          renderVerificationCode()
        ) : (
          <>
            <Box mb={10}>
              <Typography variant="h4">Sign In</Typography>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              <TextField
                id="outlined-basic"
                label="Phone"
                variant="outlined"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                sx={{ marginBottom: "20px" }}
              />
              <Button
                variant="contained"
                type={"submit"}
                onClick={handleSubmit}
              >
                Send verification code
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Dialog>
  );
};
