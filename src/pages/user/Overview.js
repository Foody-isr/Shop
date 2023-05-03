import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../auth/useAuthContext";

export const Overview = () => {
  const { user, addPhoneAttribute, addAndVerifyPhone, isCodeLoading } =
    useAuthContext();

  console.log("USER ", user);
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const isDisabled = () => {
    // console.log("country code ", countryCode);
    if (countryCode.length > 0 && phone.length >= 9) {
      return false;
    } else {
      return true;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderCodeValidation = () => {
    return (
      <>
        <TextField
          id="outlined-basic"
          label="Verification Code"
          variant="outlined"
          onChange={(e) => setVerificationCode(e.target.value)}
          fullWidth
        />
        <Button
          variant="outlined"
          disabled={isDisabled()}
          onClick={() => console.log("click")}
        >
          Verify
        </Button>
      </>
    );
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <Typography variant="h3">{user.attributes.name}</Typography>
      </Box>
      <Box mt={5}>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          disabled
          value={user.attributes.email}
          fullWidth
        />
      </Box>
      <Box display="flex" flexDirection="row" mt={5}>
        {isCodeLoading ? (
          renderCodeValidation()
        ) : (
          <>
            <TextField
              id="outlined-basic"
              label="Country code"
              variant="outlined"
              onChange={(e) => setCountryCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+</InputAdornment>
                ),
              }}
            />
            <TextField
              id="outlined-basic"
              label="Phone Number"
              variant="outlined"
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            <Button
              variant="outlined"
              disabled={isDisabled()}
              onClick={() =>
                addAndVerifyPhone(user.username, `+${countryCode}${phone}`)
              }
            >
              Verify
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
