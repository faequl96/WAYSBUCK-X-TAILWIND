import { createContext, useEffect } from "react";
import React, { useContext, useState } from "react";
import { useMutation } from "react-query";
import { API, setAuthToken } from "../config/Api";
import { UserContext } from "./userContext";
import { Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useContext(UserContext);
  const navigate = useNavigate();

  // ==================================================================================================================================
  // GLOBAL STATES ====================================================================================================================
  // ==================================================================================================================================

  const [isLogin, setIsLogin] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [regisMessage, setRegisMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [cartLength, setCartLength] = useState();
  const [profilePhoto, setProfilePhoto] = useState();
  const [navbarLoading, setNavbarLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // ==================================================================================================================================
  // FORMAT CURRENCY ==================================================================================================================
  // ==================================================================================================================================

  const formatRupiah = (money) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(money);
  };

  // ==================================================================================================================================
  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ==================================================================================================================================
  // ////////////////////////////////////////////////////// HANDLER AUTH //////////////////////////////////////////////////////////////
  // ==================================================================================================================================
  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ==================================================================================================================================

  // ==================================================================================================================================
  // CHECK USER AUTH ==================================================================================================================
  // ==================================================================================================================================

  const checkUserAuth = async () => {
    try {
      if (localStorage.token) {
        const token = JSON.parse(localStorage.token);
        setAuthToken(token.value);

        const response = await API.get("/check-auth");
        const payload = response.data.data;
        payload.token = token.value;

        dispatch({
          type: "USER_SUCCESS",
          payload,
        });

        const resCart = await API.get("/cart");
        if (resCart?.data.data === 0) {
          setCartLength(0);
        }
        if (resCart.data.data !== 0) {
          setCartLength(resCart.data.data.length);
        }

        setNavbarLoading(false);
        setProfilePhoto(payload.image);
        setIsLogin(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, [isLogin]);

  // ==================================================================================================================================
  // HANDLER REGISTER =================================================================================================================
  // ==================================================================================================================================

  const [regisData, setRegisData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const OnChangeFormRegis = (e) =>
    setRegisData({ ...regisData, [e.target.name]: e.target.value });

  const handlerRegister = useMutation(async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const config = { headers: { "Content-type": "application/json" } };
      const body = JSON.stringify(regisData);
      await API.post("/register", body, config);

      setIsLoading(false);
      setShowRegister(false);
      setTimeout(() => {
        setShowLogin(true);
      }, 400);
      setRegisMessage("");
      setRegisData({
        ...regisData,
        email: "",
        password: "",
        name: "",
        role: "",
      });
    } catch (error) {
      const alert = (
        <Alert color="failure">
          <h5 className="">{error.response.data.message}</h5>
        </Alert>
      );
      setRegisMessage(alert);
    }
  });

  // ==================================================================================================================================
  // HANDLER REGISTER =================================================================================================================
  // ==================================================================================================================================

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const OnChangeFormLogin = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handlerLogin = useMutation(async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const config = { headers: { "Content-type": "application/json" } };
      const body = JSON.stringify(loginData);
      const response = await API.post("/login", body, config);
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data.data });

      // handlerCartLength();
      setProfilePhoto(response.data.data.image);

      setIsLoading(false);
      setIsLogin(true);
      setShowLogin(false);
      setLoginMessage("");
      setLoginData({ email: "", password: "" });
      navigate("/")
    } catch (err) {
      console.log(err);
      const alert = (
        <Alert color="failure">
          <h5 className="">{err.response.data.message}</h5>
        </Alert>
      );
      setLoginMessage(alert);
    }
  });

  // ==================================================================================================================================
  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ==================================================================================================================================
  // /////////////////////////////////////////////////////// HANDLER NAVBAR ///////////////////////////////////////////////////////////
  // ==================================================================================================================================
  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ==================================================================================================================================

  const refreshNavbar = async () => {
    try {
      const response = await API.get(`/user`);
      let payload = response.data.data;
      setProfilePhoto(payload.image);
    } catch (error) {
      console.log(error);
    }
  };

  const appContextsValue = {
    isLogin,
    setIsLogin,
    isLoading,
    navbarLoading,
    setNavbarLoading,

    loginMessage,
    setLoginMessage,
    regisMessage,
    setRegisMessage,

    showLogin,
    setShowLogin,
    showRegister,
    setShowRegister,

    profilePhoto,
    refreshNavbar,
    cartLength,
    setCartLength,

    formatRupiah,

    checkUserAuth,
    regisData,
    OnChangeFormRegis,
    handlerRegister,
    loginData,
    OnChangeFormLogin,
    handlerLogin,
  };
  return (
    <AppContext.Provider value={appContextsValue}>
      {children}
    </AppContext.Provider>
  );
};
