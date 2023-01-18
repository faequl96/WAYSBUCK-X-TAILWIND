import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Navbars from "./components/navbars";
import { AppContext } from "./contexts/appContexts";
import AddProduct from "./pages/addProduct";
import AddTopping from "./pages/addTopping";
import Cart from "./pages/cart";
import DetailProduct from "./pages/detailProduct";
import LandingPage from "./pages/landingPage";
import Profile from "./pages/profile";

function App() {
  const contexts = useContext(AppContext);

  useEffect(() => {
    if (localStorage.token) {
      const token = JSON.parse(localStorage.token);
      if (new Date().getTime() > token.expiry) {
        localStorage.removeItem("token");
      }
    }
  });
  useEffect(() => {
    if (localStorage.token) {
      contexts.checkUserAuth();
    } else {
      contexts.setNavbarLoading(false);
    }
  }, []);

  return (
    <>
      <Navbars />
      <Login />
      <Register />
      <Routes>
        <Route exact path="/" element={<LandingPage />}></Route>
        <Route
          exact
          path="/menu/:id/:menuName"
          element={<DetailProduct />}
        ></Route>
        <Route exact path="/mycart" element={<Cart />}></Route>
        <Route exact path="/customer/profile" element={<Profile />}></Route>
        {/* <Route
          exact
          path="/admin/transaction"
          element={<Transactions />}
        ></Route> */}
        <Route exact path="/add-product" element={<AddProduct />}></Route>
        <Route exact path="/add-topping" element={<AddTopping />}></Route>
      </Routes>
    </>
  );
}

export default App;
