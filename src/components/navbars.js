import { Fragment, useContext, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import brandLogo from "../assets/logo.png";
import profileIcon from "../assets/profile.png";
import transIcon from "../assets/transactions.png";
import cartIcon from "../assets/cartIcon.png";
import productIcon from "../assets/drink.png";
import toppingIcon from "../assets/toping.png";
import logoutIcon from "../assets/logout.png";
import { AppContext } from "../contexts/appContexts";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import Spinner from "./feedback/spinner";

export default function Navbars() {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const contexts = useContext(AppContext);

  const [classBorder, setClassBorder] = useState("");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      setClassBorder("border-b-2");
    } else {
      setClassBorder("");
    }
  });

  const handlerLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    contexts.setIsLogin(false);
    contexts.setCartLength(0);
    navigate("/");
  };

  return (
    <Disclosure
      as="nav"
      className={`bg-white bg-opacity-60 backdrop-blur fixed left-0 right-0 top-0 z-[99] ${classBorder}`}
    >
      <div className="mx-auto px-2 xl:px-12">
        <div className="relative flex h-20 md:h-20 lg:h-24 items-center justify-between">
          <Link
            to={"/"}
            className="h-16 w-16 lg:h-[70px] lg:w-[70px] xl:h-[76px] xl:w-[76px] ml-1"
          >
            <img className="w-full" src={brandLogo} alt="Waysbucks" />
          </Link>
          {contexts.navbarLoading ? (
            <div className="flex items-center pr-2">
              <Spinner
                bgColor="text-gray-400"
                fill="fill-red-600 group-hover:fill-red-500"
              />
            </div>
          ) : (
            <>
              {contexts.isLogin === true ? (
                <div className="flex items-center pr-2">
                  <div
                    className="relative mr-1 lg:mr-2 cursor-pointer group"
                    onClick={() => navigate("/mycart")}
                  >
                    {state.user.role === "customer" && (
                      <>
                        <div className="h-8 w-8 lg:h-10 lg:w-10">
                          <img className="w-full" src={cartIcon} alt="" />
                        </div>
                        {contexts.cartLength !== 0 && (
                          <div className="absolute right-[-8px] top-[2px] md:top-1 rounded-full w-fit py-[3px] md:py-[4px] px-[8px] md:px-[9px] bg-red-600 group-hover:bg-red-400 bg-opacity-80">
                            <span className="text-white text-xs font-semibold block">
                              {contexts.cartLength}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex h-11 w-11 lg:h-14 lg:w-14 overflow-hidden rounded-full text-sm border-rose-700 border-[2px]">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="w-full"
                          src={contexts.profilePhoto}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 top-14 mt-1 lg:mt-4 w-48 origin-top-right border-rose-600 border-opacity-50 border-[1px] rounded-md bg-white py-1 shadow-md">
                        <div className="bg-white border-rose-600 border-t-[1px] border-l-[1px] border-opacity-50 w-4 h-4 absolute rotate-45 top-[-8.8px] right-3 lg:right-[17px]"></div>
                        <Menu.Item>
                          <div className="pt-2 pb-2">
                            <div
                              onClick={() => {
                                state.user.role === "customer"
                                  ? navigate("/customer/profile")
                                  : navigate("/admin/transaction");
                              }}
                              className="px-4 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-red-100"
                            >
                              {state.user.role === "customer" ? (
                                <>
                                  <div className="w-8 mr-3">
                                    <img
                                      className="w-full"
                                      src={profileIcon}
                                      alt=""
                                    />
                                  </div>
                                  <span>Profile</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-8 mr-3">
                                    <img
                                      className="w-full"
                                      src={transIcon}
                                      alt=""
                                    />
                                  </div>
                                  <span>Transactions</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Menu.Item>
                        {state.user.role === "admin" && (
                          <>
                            <Menu.Item>
                              <div className="pb-2">
                                <div
                                  className="px-4 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-red-100"
                                  onClick={() => navigate(`/add-product`)}
                                >
                                  <div className="w-8 mr-3">
                                    <img
                                      className="w-full"
                                      src={productIcon}
                                      alt=""
                                    />
                                  </div>
                                  <span>Add Product</span>
                                </div>
                              </div>
                            </Menu.Item>
                            <Menu.Item>
                              <div className="pb-2">
                                <div
                                  className="px-4 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-red-100"
                                  onClick={() => navigate(`/add-topping`)}
                                >
                                  <div className="w-8 mr-3">
                                    <img
                                      className="w-full"
                                      src={toppingIcon}
                                      alt=""
                                    />
                                  </div>
                                  <span>Add Toppping</span>
                                </div>
                              </div>
                            </Menu.Item>
                          </>
                        )}
                        <Menu.Item>
                          <div className="pt-2 pb-2 border-t-2">
                            <div
                              className="px-4 py-2 text-sm text-gray-700 flex items-center cursor-pointer hover:bg-red-100"
                              onClick={handlerLogout}
                            >
                              <div className="w-8 mr-3">
                                <img
                                  className="w-full"
                                  src={logoutIcon}
                                  alt=""
                                />
                              </div>
                              <span>Logout</span>
                            </div>
                          </div>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <div className="flex items-center pr-2">
                  <button
                    className="py-1 w-[100px] border-red-600 hover:bg-red-600 border-[3px] rounded-md text-red-600 hover:text-white font-bold mr-2"
                    onClick={() => contexts.setShowLogin(true)}
                  >
                    Login
                  </button>
                  <button
                    className="py-1 w-[100px] border-red-600 hover:bg-red-600 border-[3px] rounded-md text-red-600 hover:text-white font-bold"
                    onClick={() => contexts.setShowRegister(true)}
                  >
                    Register
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Disclosure>
  );
}
