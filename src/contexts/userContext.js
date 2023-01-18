import { createContext, useReducer } from "react";
import { setAuthToken } from "../config/Api";

export const UserContext = createContext();

const initial = {
  user: {},
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "USER_SUCCESS":
      const tokenAuth = JSON.parse(localStorage.token);
      setAuthToken(tokenAuth.value);

      return {
        user: payload,
      };
    case "LOGIN_SUCCESS":
      const item = {
        value: payload.token,
        expiry: new Date().getTime() + 7200000,
      };
      localStorage.setItem("token", JSON.stringify(item));
      const token = JSON.parse(localStorage.token);

      setAuthToken(token.value);

      return {
        user: payload,
      };
    case "AUTH_ERROR":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        user: {},
      };
    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initial);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
