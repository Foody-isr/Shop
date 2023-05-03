import PropTypes from "prop-types";
import { createContext, useEffect, useReducer, useCallback } from "react";
import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { Amplify, Auth, Hub } from "aws-amplify";
// utils
import axios from "../utils/axiosInstance";
// config
import { COGNITO_API } from "../config";

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isCodeLoading: false,
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === "PHONE_AUTH_LOADING") {
    return {
      isCodeLoading: true,
    };
  }
  if (action.type === "AUTH") {
    return {
      ...state,
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === "LOGOUT") {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

// console.log("COGNITO_API ", COGNITO_API);
const userPool = new CognitoUserPool({
  UserPoolId: "us-east-1_cDd9TR9a5",
  ClientId: "341mclabt5p0437nm1rcqo0rl7",
});

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getUserAttributes = useCallback(
    (currentUser) =>
      new Promise((resolve, reject) => {
        const payload = currentUser.getSignInUserSession().getIdToken().payload;
        if (!payload) {
          reject("no payload");
          console.error("no payload");
        } else {
          const { name, sub, email } = currentUser
            .getSignInUserSession()
            .getIdToken().payload;
          const results = { name, sub, email };
          resolve(results);
        }
      }),
    []
  );

  const getSession = useCallback(
    () =>
      new Promise(async (resolve, reject) => {
        // const cognitoUser = userPool.getCurrentUser();

        const cognitoUser = await Auth.currentAuthenticatedUser();

        if (cognitoUser) {
          console.log("CONGITO USER ", cognitoUser);
          // const attributes = cognitoUser.attributes;
          cognitoUser.getSession(async (error, session) => {
            if (error) {
              reject(error);
              console.error(error);
            }
            // const attributes = cognitoUser.attributes;
            console.log("session", session);
            const accessToken = session?.getAccessToken().getJwtToken();
            // console.log("accessToken", accessToken);
            const token = session?.getIdToken().getJwtToken();
            const attributes = session?.getIdToken().payload;
            console.log("USER ATTRIBUTES ", attributes);

            console.log("ID TOKEN ", token);
            // console.log("PAYLOAD ", payload);

            // use the token or Bearer depend on the wait BE handle, by default amplify API only need to token.
            axios.defaults.headers.common.Authorization = token;

            resolve({
              cognitoUser,
              session,
              headers: {
                Authorization: token,
              },
            });

            dispatch({
              type: "AUTH",
              payload: {
                isAuthenticated: true,
                user: {
                  ...cognitoUser,
                  attributes,
                  displayName: attributes.name,
                  role: "admin",
                },
              },
            });
          });
        } else {
          dispatch({
            type: "AUTH",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }),
    [getUserAttributes]
  );

  // const sendVerificationCode = (phoneNumber, onSuccess, onFailure) => {
  //   console.log("sendVerificationCode");
  //   const attributeList = [];
  //   const dataPhoneNumber = {
  //     Name: "phone_number",
  //     Value: "+9720587849377",
  //   };
  //   const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
  //   attributeList.push(attributePhoneNumber);

  //   userPool.signUp(
  //     "username@gmail.com",
  //     "password",
  //     attributeList,
  //     null,
  //     (err, result) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log(result);
  //       }
  //     }
  //   );
  // };

  const initialize = useCallback(async () => {
    try {
      await getSession();
    } catch {
      dispatch({
        type: "AUTH",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [getSession]);

  useEffect(() => {
    initialize();
    // sendVerificationCode();
  }, [initialize]);

  // We make sure to handle the user update here, but return the resolve value in order for our components to be
  // able to chain additional `.then()` logic. Additionally, we `.catch` the error and "enhance it" by providing
  // a message that our React components can use.

  // LOGIN
  const login = useCallback(
    (email, password) =>
      new Promise((resolve, reject) => {
        const userData = new CognitoUser({
          Username: email,
          Pool: userPool,
        });

        const authDetails = new AuthenticationDetails({
          Username: email,
          Password: password,
        });

        userData.authenticateUser(authDetails, {
          onSuccess: (result) => {
            getSession();
            resolve(result);
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      }),
    [getSession]
  );

  // const loginWithPhone = useCallback(
  //   (phoneNumber, verificationCode) =>
  //     new Promise((resolve, reject) => {
  //       console.log("PHONE NUMBER ", phoneNumber);

  //       const authenticationData = {
  //         Username: phoneNumber,
  //         Password: "Foodyz@89z",
  //       };
  //       const authenticationDetails = new AuthenticationDetails(
  //         authenticationData
  //       );

  //       const cognitoUser = new CognitoUser({
  //         Username: phoneNumber,
  //         Pool: userPool,
  //       });

  //       cognitoUser.authenticateUser(authenticationDetails, {
  //         onSuccess: function (result) {
  //           console.log("User authenticated", result);
  //         },
  //         onFailure: function (err) {
  //           console.error(err);
  //         },
  //       });
  //     }),
  //   [getSession]
  // );

  // const signUpWithPhone = async (phoneNumber) => {
  //   try {
  //     userPool.signUp(
  //       phoneNumber,
  //       "Foodyz@89z",
  //       null,
  //       null,
  //       function (err, result) {
  //         if (err) {
  //           console.error(err);
  //           return;
  //         }
  //         dispatch({
  //           type: "PHONE_AUTH_LOADING",
  //         });
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const confirmPhone = async (phoneNumber) => {
    // const cognitoUser = userPool.getCurrentUser();

    // cognitoUser.getSession(async (error, session) => {});

    // cognitoUser.getAttributeVerificationCode("phone_number", {
    //   onSuccess: function (result) {
    //     console.log("Code sent successfully ", result);
    //   },
    //   onFailure: function (err) {
    //     console.error(err);
    //   },
    // });

    const user = await Auth.currentAuthenticatedUser();
    console.log("AMPLIFY USER ", user);
    Auth.verifyCurrentUserAttribute("phone_number")
      .then(() => {
        console.log("Successfully sent verification code");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const addPhoneAttribute = async (username, phoneNumber) => {
  //   new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //     }, 100);
  //   });
  // };

  async function addAndVerifyPhone(username, phoneNumber) {
    // const promise = new Promise((resolve, reject) => {
    //   // Some asynchronous task
    //   setTimeout(() => {
    //     const cognitoUser = userPool.getCurrentUser();
    //     cognitoUser.getSession(async (error, session) => {
    //       console.log("SESSION ", session);
    //     });
    //     // Add phone number attribute
    //     const attributeList = [];
    //     const phoneNumberAttribute = {
    //       Name: "phone_number",
    //       Value: phoneNumber,
    //     };
    //     const attribute = new CognitoUserAttribute(phoneNumberAttribute);
    //     attributeList.push(attribute);

    //     // Update user attributes
    //     cognitoUser.updateAttributes(attributeList, (err, result) => {
    //       if (err) {
    //         console.log(err);
    //         reject(err);
    //       }
    //       console.log("Phone number added:", result);
    //       resolve(result);
    //       // dispatch({
    //       //   type: "PHONE_AUTH_LOADING",
    //       // });
    //     });
    //   }, 2000);
    // });

    // const result = await promise;
    // console.log("result ", result);
    confirmPhone(phoneNumber);
  }

  // REGISTER
  const register = useCallback(
    (email, password, firstName, lastName) =>
      new Promise((resolve, reject) => {
        const newAttributes = [
          new CognitoUserAttribute({
            Name: "email",
            Value: email,
          }),
          new CognitoUserAttribute({
            Name: "name",
            Value: `${firstName} ${lastName}`,
          }),
        ];

        userPool.signUp(email, password, newAttributes, [], async (error) => {
          if (error) {
            reject(error);
            console.error(error);
            return;
          }

          resolve(undefined);
          window.location.href = "/login";
        });
      }),
    []
  );

  // LOGOUT
  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.signOut();
      dispatch({
        type: "LOGOUT",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "cognito",
        login,
        addAndVerifyPhone,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
