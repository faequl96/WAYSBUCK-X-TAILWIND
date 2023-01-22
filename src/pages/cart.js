import React, { Fragment, useContext, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AppContext } from "../contexts/appContexts";
import trashIcon from "../assets/trash.png";
import { useNavigate } from "react-router-dom";
import { API } from "../config/Api";
import { useMutation, useQuery } from "react-query";
import Arrow from "../components/icon/arrow";
import Spinner from "../components/feedback/spinner2";
import Toggle from "../components/interaction/toggle";

const Cart = () => {
  const contexts = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const [requiredRecepient, setRequiredRecepient] = useState(false);
  const [requiredPhone, setRequiredPhone] = useState(false);
  const [requiredPosCode, setRequiredPosCode] = useState(false);
  const [requiredAddress, setRequiredAddress] = useState(false);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  let { data: cart, refetch } = useQuery("cartsCache", async () => {
    const response = await API.get("/cart");

    setIsLoading(false);

    if (response.data.data === 0) {
      contexts.setCartLength(0);
      return [];
    } else {
      contexts.setCartLength(response.data.data.length);
      return response.data.data;
    }
  });

  let cartId = cart?.map((item) => item.id);

  let price = cart?.map((item) => item.price);
  let totalPrice = price?.reduce((a, b) => a + b, 0);

  const handlerDeleteCart = async (id) => {
    setIsLoading(true);
    await API.delete(`/cart/${id}`);
    refetch();
  };

  const [profile, setProfile] = useState();

  useEffect(() => {
    async function getDataProfile() {
      const result = await API.get(`/user`);
      setProfile(result.data.data);
    }
    getDataProfile();
  }, []);

  let [shippingForMe, setShippingForMe] = useState({
    name: "",
    email: "",
    recepient_name: "",
    phone: "",
    pos_code: "",
    address: "",
  });

  useEffect(() => {
    setShippingForMe({
      name: profile?.name,
      email: profile?.email,
      recepient_name: profile?.name,
      phone: profile?.phone,
      pos_code: profile?.pos_code,
      address: profile?.address,
    });
  }, [profile]);

  let [shippingForSomeOneElse, setShippingForSomeOneElse] = useState({
    name: profile?.name,
    email: profile?.email,
    recepient_name: "",
    phone: "",
    pos_code: "",
    address: "",
  });

  const OnChangeFormTrans = (e) =>
    setShippingForSomeOneElse({
      ...shippingForSomeOneElse,
      [e.target.name]: e.target.value,
    });

  const handlerTransaction = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = { headers: { "Content-type": "application/json" } };

      let transData = {
        name: profile.name,
        email: profile.email,
        recepient_name: "",
        phone: "",
        pos_code: "",
        address: "",
        total_price: totalPrice,
        status: "Canceled",
        cart_id: cartId,
      };

      if (enabled) {
        transData.recepient_name = shippingForSomeOneElse.recepient_name;
        transData.phone = shippingForSomeOneElse.phone;
        transData.pos_code = shippingForSomeOneElse.pos_code;
        transData.address = shippingForSomeOneElse.address;
      } else {
        transData.recepient_name = shippingForMe.recepient_name;
        transData.phone = shippingForMe.phone;
        transData.pos_code = shippingForMe.pos_code;
        transData.address = shippingForMe.address;
      }

      const body = JSON.stringify(transData);

      if (
        transData.recepient_name === "" ||
        transData.phone === "" ||
        transData.pos_code === "" ||
        transData.address === ""
      ) {
        if (transData.recepient_name === "") {
          setRequiredRecepient(true);
        } else {
          setRequiredRecepient(false);
        }
        if (transData.phone === "") {
          setRequiredPhone(true);
        } else {
          setRequiredPhone(false);
        }
        if (transData.pos_code === "") {
          setRequiredPosCode(true);
        } else {
          setRequiredPosCode(false);
        }
        if (transData.address === "") {
          setRequiredAddress(true);
        } else {
          setRequiredAddress(false);
        }

        return;
      }

      const resMidtrans = await API.post("/create-transaction", body, config);
      const token = resMidtrans.data.data.token;

      window.snap.pay(token, {
        onSuccess: function (result) {
          navigate("/customer/profile");
        },
        onPending: function (result) {
          navigate("/customer/profile");
        },
        onError: function (result) {
          console.log(result);
        },
        onClose: function () {
          alert("You closed the popup without finishing the payment");
        },
      });

      const days = new Date().getDay();
      let day = "";
      if (days === 0) {
        day = "Sunday";
      } else if (days === 1) {
        day = "Monday";
      } else if (days === 2) {
        day = "Tuesday";
      } else if (days === 3) {
        day = "Wednesday";
      } else if (days === 4) {
        day = "Thursday";
      } else if (days === 5) {
        day = "Friday";
      } else if (days === 6) {
        day = "Saturday";
      }
      let second = new Date().getSeconds();
      if (second < 10) {
        second = `0${second}`;
      }
      let minute = new Date().getMinutes();
      if (minute < 10) {
        minute = `0${minute}`;
      }
      let hour = new Date().getHours();
      if (hour < 10) {
        hour = `0${hour}`;
      }
      let date = new Date().getDate();
      if (date < 10) {
        date = `0${date}`;
      }
      let month = new Date().getMonth() + 1;
      if (month < 10) {
        month = `0${month}`;
      }
      const year = new Date().getFullYear();
      const time = `${date}-${month}-${year} at ${hour}:${minute}:${second}`;

      const bodyUpdateCart = JSON.stringify({
        id: cartId,
        is_payed: true,
        trans_day: day,
        trans_time: time,
      });
      const response = await API.patch("/update-cart", bodyUpdateCart, config);

      if (response.data.data !== 0) {
        contexts.setCartLength(response.data.data.length);
      }

      refetch();
      setShippingForSomeOneElse({
        name: profile?.name,
        email: profile?.email,
        recepient_name: "",
        phone: "",
        pos_code: "",
        address: "",
      });
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <div className="mt-20 lg:mt-32 md:py-4" onLoad={() =>
      setTimeout(() => {
        setWindowHeight(window.innerHeight);
      }, 300)
    }>
      <div className="lg:relative mx-auto max-w-6xl 2xl:max-w-7xl lg:px-10">
        <div className="px-3 mb-5 bg-white fixed lg:static left-0 right-0 top-0">
          <h2 className="text-3xl font-extrabold text-red-600 mb-2 mt-24 lg:mt-0">
            My Cart
          </h2>
          <h5 className="text-xl font-semibold text-red-600 border-b-[1px] lg:border-b-0 border-slate-800 pb-4">
            Review Your Order
          </h5>
        </div>
        <div className="lg:flex justify-between mt-44 md:mt-28 lg:mt-0 mb-8 lg:mb-4">
          <div className="lg:w-[60%]">
            <div
              className={`lg:border-t-[1px] lg:border-b-[1px] border-slate-800 pt-1 px-3 pb-1 lg:mb-8 lg:pr-4 overflow-y-scroll lg:h-[40vh] ${
                contexts.cartLength === 0 && "flex items-center"
              } ${
                windowHeight < 640 ? (windowHeight < 540 ? "h-[36vh]" : "h-[48vh]") : "h-[56vh]"
              }`}
            >
              {contexts.cartLength === 0 ? (
                <div className="h-[100%] lg:h-full w-full flex justify-center items-center">
                  <h3 className="font-bold text-xl text-slate-500">
                    Your cart is empty
                  </h3>
                </div>
              ) : (
                <>
                  {cart?.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[80px,auto] md:grid-cols-[80px,auto,120px] my-5"
                    >
                      <div className="aspect-[3/5] sm:aspect-[3/4] overflow-hidden flex justify-center">
                        <img
                          src={item.product.image}
                          className="h-[100%] max-w-none"
                        />
                      </div>
                      <div className="pl-3 flex flex-col justify-between">
                        <div className="md:pr-10 lg:pr-0">
                          <h5 className="text-lg font-bold text-red-600 leading-4 mb-1">
                            {item.product.title}
                          </h5>
                          <div
                            className="grid"
                            style={{ gridTemplateColumns: "80px auto" }}
                          >
                            <h6 className="text-sm font-semibold">
                              Toppings :
                            </h6>
                            <div className="leading-3">
                              {item.toppings.length === 0 ? (
                                <span className="text-sm">-</span>
                              ) : (
                                <>
                                  {item.toppings?.map((topping, index) => (
                                    <span key={topping.id} className="text-sm">
                                      {item.toppings?.length === index + 1 ? (
                                        <>{topping.title}</>
                                      ) : (
                                        <>{topping.title}, </>
                                      )}
                                    </span>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-end md:hidden h-6">
                          <h6 className="text-red-600 font-semibold leading-4">
                            {contexts.formatRupiah(item.price)}
                          </h6>
                          <Menu as="div" className="h-6">
                            <Menu.Button className="w-5 cursor-pointer group">
                              <img
                                className="group-hover:brightness-200"
                                src={trashIcon}
                              />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0"
                            >
                              <Menu.Items className="fixed inset-0 z-[999] flex items-center px-3">
                                <div className="w-full md:max-w-md rounded-lg bg-white shadow-xl mb-6 pb-6 px-4 mx-auto border-2 border-red-500">
                                  <h3 className="mt-6 text-center text-2xl font-bold tracking-tight text-red-600 mb-6">
                                    Are you sure?
                                  </h3>
                                  <div className="flex justify-center gap-2">
                                    <Menu.Button className="bg-red-600 w-24 py-1 font-bold text-white rounded-md hover:bg-red-500">
                                      No
                                    </Menu.Button>
                                    <button
                                      className="flex justify-center items-center bg-slate-500 w-24 py-1 font-bold text-white rounded-md hover:bg-slate-400"
                                      onClick={() => handlerDeleteCart(item.id)}
                                    >
                                      {isLoading ? (
                                        <div className="w-5 h-5">
                                          <Spinner fill="text-white" />
                                        </div>
                                      ) : (
                                        <span>Yes</span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col items-end gap-4">
                        <h6 className="text-red-600 font-semibold">
                          {contexts.formatRupiah(item.price)}
                        </h6>
                        <Menu as="div">
                          <Menu.Button className="w-5 cursor-pointer group">
                            <img
                              className="group-hover:brightness-200"
                              src={trashIcon}
                            />
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="fixed inset-0 z-[999] flex items-center">
                              <div className="w-full md:max-w-md rounded-lg bg-white shadow-xl mb-6 pb-6 px-4 mx-auto border-2 border-red-500">
                                <h3 className="mt-6 text-center text-2xl font-bold tracking-tight text-red-600 mb-6">
                                  Are you sure?
                                </h3>
                                <div className="flex justify-center gap-2">
                                  <Menu.Button className="bg-red-600 w-24 py-1 font-bold text-white rounded-md hover:bg-red-500">
                                    No
                                  </Menu.Button>
                                  <button
                                    className="bg-slate-500 w-24 py-1 font-bold text-white rounded-md hover:bg-slate-400"
                                    onClick={() => handlerDeleteCart(item.id)}
                                  >
                                    {isLoading ? (
                                      <div className="w-5 h-5">
                                        <Spinner fill="text-white" />
                                      </div>
                                    ) : (
                                      <span>Yes</span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="border-t-[1px] border-b-[1px] border-slate-800 py-3 hidden lg:block">
              <div className="flex justify-between mb-3">
                <span className="text-red-600 font-semibold">Subtotal</span>
                <span className="text-red-600 font-semibold">
                  {contexts.cartLength === 0
                    ? contexts.formatRupiah(0)
                    : contexts.formatRupiah(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600 font-semibold">Qty</span>
                {contexts.cartLength === 0 ? (
                  <span className="text-red-600 font-semibold">-</span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    {cart?.length}
                  </span>
                )}
              </div>
            </div>
            <div className="py-3 hidden lg:block">
              <div className="flex justify-between mb-3">
                <span className="text-red-900 text-lg font-black">Total</span>
                <span className="text-red-900 text-lg font-black">
                  {contexts.cartLength === 0
                    ? contexts.formatRupiah(0)
                    : contexts.formatRupiah(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          <Disclosure
            as="div"
            className={`fixed bg-white bg-opacity-60 backdrop-blur lg:static w-full left-0 right-0 bottom-0 z-[99] lg:w-[40%]`}
          >
            {({ open }) => (
              <>
                {open ? (
                  <></>
                ) : (
                  <div className="px-3 bg-white lg:hidden">
                    <div className="border-t-[1px] border-slate-800 py-3">
                      <div className="flex justify-between mb-3 text-red-600 font-semibold">
                        <span>Qty</span>
                        <span>
                          {contexts.cartLength === 0 ? (
                            <span>-</span>
                          ) : (
                            <span>{cart?.length}</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600 text-lg font-bold">
                          Total
                        </span>
                        <span className="text-red-600 text-lg font-bold">
                          {contexts.cartLength === 0
                            ? contexts.formatRupiah(0)
                            : contexts.formatRupiah(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {open ? (
                  <div className="h-14 flex justify-between items-center px-3 lg:hidden border-t-2">
                    <div className="py-2">
                      <div className="flex items-center">
                        <h3 className="text-xl font-bold text-red-600">
                          Shipping Info & Pay
                        </h3>
                      </div>
                    </div>
                    {open ? (
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 bg-red-600 text-white focus:outline-none">
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <div className="h-14 flex justify-between items-center px-3 lg:hidden border-t-2">
                    <div className="py-2">
                      <div className="flex items-center">
                        <h5 className="text-lg font-semibold text-gray-600">
                          Shipping Info & Pay
                        </h5>
                      </div>
                    </div>
                    {open ? (
                      <></>
                    ) : (
                      <Disclosure.Button className="flex justify-center items-center">
                        <div className="w-[30px] h-[30px] scale-[180%] rotate-180">
                          <Arrow fill="text-red-600" />
                        </div>
                      </Disclosure.Button>
                    )}
                  </div>
                )}
                <Disclosure.Panel className="lg:hidden">
                  <div className="space-y-1 px-3 pt-2">
                    <div className="grid grid-cols-[auto,60px] mb-2">
                      <div>
                        <h6>Shipping For Someone Else</h6>
                      </div>
                      <div className="text-end">
                        <Toggle
                          enabled={enabled}
                          setEnabled={setEnabled}
                          bgEnabled={"bg-red-600"}
                          bgDisabled={"bg-slate-500"}
                        />
                      </div>
                    </div>
                    {enabled && (
                      <form>
                        <div className="mb-3 relative">
                          <input
                            name="recepient_name"
                            type="text"
                            required
                            className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                            placeholder="Recepient Name"
                            value={shippingForSomeOneElse.recepient_name}
                            onChange={OnChangeFormTrans}
                            onClick={() => setRequiredRecepient(false)}
                          />
                          {requiredRecepient && (
                            <div className="absolute right-0 top-[10px] px-3 text-red-500">
                              *Required
                            </div>
                          )}
                        </div>
                        <div className="mb-3 relative">
                          <input
                            name="phone"
                            type="text"
                            required
                            className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                            placeholder="Phone"
                            value={shippingForSomeOneElse.phone}
                            onChange={OnChangeFormTrans}
                            onClick={() => setRequiredPhone(false)}
                          />
                          {requiredPhone && (
                            <div className="absolute right-0 top-[10px] px-3 text-red-500">
                              *Required
                            </div>
                          )}
                        </div>
                        <div className="mb-3 relative">
                          <input
                            name="pos_code"
                            type="text"
                            required
                            className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                            placeholder="Pos Code"
                            value={shippingForSomeOneElse.pos_code}
                            onChange={OnChangeFormTrans}
                            onClick={() => setRequiredPosCode(false)}
                          />
                          {requiredPosCode && (
                            <div className="absolute right-0 top-[10px] px-3 text-red-500">
                              *Required
                            </div>
                          )}
                        </div>
                        <div className="mb-2 relative">
                          <input
                            name="address"
                            type="text"
                            required
                            className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                            placeholder="Address"
                            value={shippingForSomeOneElse.address}
                            onChange={OnChangeFormTrans}
                            onClick={() => setRequiredAddress(false)}
                          />
                          {requiredAddress && (
                            <div className="absolute right-0 top-[10px] px-3 text-red-500">
                              *Required
                            </div>
                          )}
                        </div>
                      </form>
                    )}
                    <div className="h-14 grid grid-cols-[auto,140px] items-center lg:hidden">
                      <div className="py-2">
                        <div className="flex items-center">
                          <div className="flex justify-between w-full">
                            <span className="text-red-600 text-lg font-bold">
                              Total
                            </span>
                            <span className="text-red-700 text-lg font-bold">
                              {contexts.cartLength === 0
                                ? contexts.formatRupiah(0)
                                : contexts.formatRupiah(totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="h-14 flex justify-end items-center">
                        {cart?.length === 0 ? (
                          <button className="py-2 w-32 lg:text-xl lg:w-full rounded-md bg-slate-500 cursor-default font-bold text-white focus:outline-none">
                            Pay
                          </button>
                        ) : (
                          <>
                            {enabled ? (
                              <button
                                className="py-2 w-32 lg:text-xl lg:w-full rounded-md bg-red-600 hover:bg-red-500 font-bold text-white focus:outline-none"
                                onClick={(e) => handlerTransaction.mutate(e)}
                              >
                                Pay
                              </button>
                            ) : (
                              <>
                                {profile?.phone === "" ||
                                profile?.pos_code === "" ||
                                profile?.address === "" ? (
                                  <>
                                    <Menu as="div">
                                      <Menu.Button className="py-2 w-32 lg:text-xl lg:w-full rounded-md bg-red-600 hover:bg-red-500 font-bold text-white focus:outline-none">
                                        Pay
                                      </Menu.Button>
                                      <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0"
                                      >
                                        <Menu.Items className="fixed -top-[88vh] -bottom-[10vh] inset-x-0 h-[120vh] z-[999] flex items-center px-3">
                                          <div className="w-full md:max-w-md rounded-lg bg-white shadow-xl mb-6 pb-6 px-4 mx-auto border-2 border-red-500">
                                            <h3 className="mt-6 text-center text-xl font-semibold tracking-tight text-slate-700 mb-6">
                                              Your profile is not completed! Do
                                              you want to complete it?
                                            </h3>
                                            <div className="flex justify-center gap-2">
                                              <Menu.Button className="bg-red-600 w-24 py-1 font-bold text-white rounded-md hover:bg-red-500">
                                                No
                                              </Menu.Button>
                                              <button
                                                className="flex justify-center items-center bg-slate-500 w-24 py-1 font-bold text-white rounded-md hover:bg-slate-400"
                                                onClick={() =>
                                                  navigate("/customer/profile")
                                                }
                                              >
                                                Yes
                                              </button>
                                            </div>
                                          </div>
                                        </Menu.Items>
                                      </Transition>
                                    </Menu>
                                  </>
                                ) : (
                                  <button
                                    className="py-2 w-32 lg:text-xl lg:w-full rounded-md bg-red-600 hover:bg-red-500 font-bold text-white focus:outline-none"
                                    onClick={(e) =>
                                      handlerTransaction.mutate(e)
                                    }
                                  >
                                    Pay
                                  </button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>

                <div className="hidden lg:block space-y-1 px-3 pl-10">
                  <form>
                    <div className="mb-6">
                      <input
                        name="recepient_name"
                        type="text"
                        required
                        className="block w-full rounded-md border-[2px] border-red-600 px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                        placeholder="Recepient Name"
                        value={shippingForSomeOneElse.recepient_name}
                        onChange={OnChangeFormTrans}
                      />
                    </div>
                    <div className="mb-6">
                      <input
                        name="phone"
                        type="text"
                        required
                        className="block w-full rounded-md border-[2px] border-red-600 px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                        placeholder="Phone"
                        value={shippingForSomeOneElse.phone}
                        onChange={OnChangeFormTrans}
                      />
                    </div>
                    <div className="mb-6">
                      <input
                        name="pos_code"
                        type="text"
                        required
                        className="block w-full rounded-md border-[2px] border-red-600 px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                        placeholder="Pos Code"
                        value={shippingForSomeOneElse.pos_code}
                        onChange={OnChangeFormTrans}
                      />
                    </div>
                    <div className="mb-6">
                      <input
                        name="address"
                        type="text"
                        required
                        className="block w-full rounded-md border-[2px] border-red-600 px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                        placeholder="Address"
                        value={shippingForSomeOneElse.address}
                        onChange={OnChangeFormTrans}
                      />
                    </div>
                  </form>
                  <div className="h-14 flex justify-end items-center">
                    <button
                      className="py-2 w-32 lg:text-xl lg:w-full rounded-md border-[2px] border-red-600 bg-red-600 hover:bg-red-500 font-bold text-white focus:outline-none"
                      onClick={(e) => handlerTransaction.mutate(e)}
                    >
                      Pay
                    </button>
                  </div>
                </div>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
};

export default Cart;
