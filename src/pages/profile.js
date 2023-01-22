import { Disclosure, Menu, Transition } from "@headlessui/react";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { API } from "../config/Api";
import { AppContext } from "../contexts/appContexts";
import { UserContext } from "../contexts/userContext";
import editPhoto from "../assets/edit.png";
import editIconGray from "../assets/editIconGray.png";
import editIconRed from "../assets/editIconRed.png";
import chekMarkIcon from "../assets/checkmark.png";
import markAllIcon from "../assets/markAll.png";
import markAllActiveIcon from "../assets/markAllActive.png";
import barcodIcon from "../assets/barcod.png";
import logo from "../assets/logo.png";
import trashIcon from "../assets/trash.png";
import Arrow from "../components/icon/arrow";
import Spinner from "../components/feedback/spinner2";
import X from "../components/icon/x";

const Profile = () => {
  const contexts = useContext(AppContext);
  const [state] = useContext(UserContext);
  const [transactions, setTransactions] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState();
  const [isEditForm, setIsEditForm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mark, setMark] = useState([]);
  const [isMarkHistory, setIsMarkHistory] = useState(false);
  const [isMarkAll, setIsMarkAll] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const [profile, setProfile] = useState();
  let [editData, setEditData] = useState({
    name: "",
    email: "",
    image: "",
    phone: "",
    pos_code: "",
    address: "",
  });

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

  useEffect(() => {
    async function getDataTrans() {
      const result = await API.get("/transaction");
      setTransactions(result.data.data);
    }
    getDataTrans();

    async function getDataProfile() {
      const result = await API.get("/check-auth");
      setProfile(result.data.data);
    }
    getDataProfile();
  }, []);

  useEffect(() => {
    setPreview(profile?.image);
    setEditData({
      name: profile?.name,
      email: profile?.email,
      phone: profile?.phone,
      pos_code: profile?.pos_code,
      address: profile?.address,
    });
  }, [profile]);

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const fieldForm = [
    {
      id: 1,
      title: "Name :",
      type: "text",
      name: "name",
      value: editData.name,
      info: profile?.name,
    },
    {
      id: 2,
      title: "Email :",
      type: "email",
      name: "email",
      value: editData.email,
      info: profile?.email,
    },
    {
      id: 3,
      title: "Phone :",
      type: "text",
      name: "phone",
      value: editData.phone,
      info: profile?.phone,
    },
    {
      id: 4,
      title: "Pos Code :",
      type: "text",
      name: "pos_code",
      value: editData.pos_code,
      info: profile?.pos_code,
    },
    {
      id: 5,
      title: "Address :",
      type: "text",
      name: "address",
      value: editData.address,
      info: profile?.address,
    },
  ];

  const handlerEditForm = (id) => {
    let filterID = isEditForm.filter((e) => e === id);
    if (filterID[0] !== id) {
      setIsEditForm([...isEditForm, id]);
    } else {
      setIsEditForm(isEditForm.filter((e) => e !== id));

      if (id === 1) {
        editData.name = profile?.name;
      }
      if (id === 2) {
        editData.email = profile?.email;
      }
      if (id === 3) {
        editData.phone = profile?.phone;
      }
      if (id === 4) {
        editData.pos_code = profile?.pos_code;
      }
      if (id === 5) {
        editData.address = profile?.address;
      }
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const formData = new FormData();
      formData.set("name", editData.name);
      formData.set("email", editData.email);
      formData.set("phone", editData.phone);
      formData.set("pos_code", editData.pos_code);
      formData.set("address", editData.address);
      if (editData?.image !== undefined) {
        formData.set("image", editData?.image[0], editData?.image[0]?.name);
      }

      await API.patch(`/user/${state.user.id}`, formData);

      const result = await API.get("/check-auth");
      setProfile(result.data.data);

      setIsEdit(false);
      setIsEditForm([]);
      setEditData({
        name: profile?.name,
        email: profile?.email,
        phone: profile?.phone,
        pos_code: profile?.pos_code,
        address: profile?.address,
      });
      setIsLoading(false);
      contexts.refreshNavbar();
    } catch (error) {
      console.log(error);
    }
  });

  const handlerMark = (id) => {
    let filterID = mark.filter((e) => e === id);
    if (filterID[0] !== id) {
      setMark([...mark, id]);
    } else {
      setMark(mark.filter((e) => e !== id));
    }
  };

  const handlerMarkAll = () => {
    const markedAll = transactions.map((trans) => trans.id);
    setMark(markedAll);
  };

  const handlerDeleteHistory = useMutation(async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const config = { headers: { "Content-type": "application/json" } };
      const body = JSON.stringify({
        id: mark,
      });

      await API.post(`/delete-transaction`, body, config);

      const result = await API.get("/transaction");
      setTransactions(result.data.data);

      setIsLoading(false);
      setMark([]);
      setIsMarkHistory(false);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="mt-20 lg:mt-32 py-4">
      <div className="lg:relative mx-auto max-w-6xl 2xl:max-w-7xl lg:px-10">
        <div className="px-3 mb-3 lg:hidden flex justify-between">
          <h2 className="text-3xl font-extrabold text-red-600">My Profile</h2>
          {isEdit ? (
            <button
              className="w-[90px] rounded-md flex justify-center items-center bg-red-600 lg:hover:bg-red-500 text-white font-semibold mr-[2px]"
              onClick={(e) => handleSubmit.mutate(e)}
            >
              {isLoading ? (
                <div className="flex items-center h-6 w-6">
                  <div className="w-full h-full">
                    <Spinner fill="text-red-50" />
                  </div>
                </div>
              ) : (
                <span>Save</span>
              )}
            </button>
          ) : (
            <div
              className="group cursor-pointer w-[32px] flex items-center"
              onClick={() => setIsEdit(true)}
            >
              <img src={editIconGray} className="lg:group-hover:hidden" />
              <img src={editIconRed} className="hidden lg:group-hover:block" />
            </div>
          )}
        </div>
        <div className="lg:flex justify-between lg:mb-4">
          <div className="px-3 lg:w-[50%]">
            <div className="mb-8 hidden lg:block">
              <h2 className="text-3xl font-extrabold text-red-600 mb-2">
                My Profile
              </h2>
            </div>
            <div
              className={`pt-1 overflow-y-scroll md:overflow-y-auto ${
                windowHeight < 600 ? "h-[56vh]" : "h-[70vh]"
              }`}
            >
              <div className="md:grid grid-cols-[280px,auto] lg:grid-cols-[160px,auto] xl:grid-cols-[200px,auto] mb-8">
                <div className="w-100 h-32 md:h-64 lg:h-40 xl:h-48 flex justify-center md:justify-start relative">
                  <div className="aspect-[1/1] h-full relative">
                    <div className="aspect-[1/1] rounded-full overflow-hidden flex items-center border-8">
                      <img src={preview} className="w-full" />
                    </div>
                    {isEdit && (
                      <>
                        <form>
                          <input
                            id="photo"
                            type="file"
                            name="image"
                            className="hidden"
                            onChange={handleChange}
                          />
                        </form>
                        <label htmlFor="photo">
                          <img
                            src={editPhoto}
                            className="absolute inset-0 bg-opacity-70 bg-[#333] cursor-pointer rounded-full"
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:pl-20 lg:pl-8 lg:pr-6 md:flex items-center">
                  <div className="w-full">
                    {fieldForm.map((item) => (
                      <div key={item.id}>
                        <h5 className="font-semibold text-lg leading-4 lg:text-md md:leading-5">
                          {item.title}
                        </h5>
                        <div className="grid grid-cols-[auto,28px] lg:grid-cols-[auto,24px] mb-4">
                          <div className="flex items-center w-full">
                            {isEditForm.filter(
                              (element) => element === item.id
                            )[0] === item.id ? (
                              <form className="w-full pr-3">
                                <input
                                  type={item.type}
                                  name={item.name}
                                  autoFocus
                                  onFocus={() =>
                                    setTimeout(() => {
                                      setWindowHeight(window.innerHeight);
                                    }, 300)
                                  }
                                  onBlur={() =>
                                    setTimeout(() => {
                                      setWindowHeight(window.innerHeight);
                                    }, 300)
                                  }
                                  className="p-0 w-full leading-[1.2rem] mt-1 pb-[1px] border-0 focus:ring-0 text-slate-500"
                                  value={item.value}
                                  onChange={handleChange}
                                />
                              </form>
                            ) : (
                              <span className="block w-full mr-3 leading-[1.2rem] mt-1">
                                {item.info !== "" ? item.info : "-"}
                              </span>
                            )}
                          </div>
                          {isEditForm.filter(
                            (element) => element === item.id
                          )[0] === item.id ? (
                            <>
                              {isEdit ? (
                                <div
                                  className="group cursor-pointer"
                                  onClick={() => handlerEditForm(item.id)}
                                >
                                  <div className="lg:group-hover:hidden h-[28px] w-[21px] flex items-center justify-end">
                                    <div className="scale-[160%]">
                                      <X fill={"text-gray-400"} />
                                    </div>
                                  </div>
                                  <div className="hidden lg:group-hover:block">
                                    <X />
                                  </div>
                                </div>
                              ) : (
                                <div className="h-[28px]"></div>
                              )}
                            </>
                          ) : (
                            <>
                              {isEdit ? (
                                <div
                                  className="group cursor-pointer"
                                  onClick={() => handlerEditForm(item.id)}
                                >
                                  <img
                                    src={editIconGray}
                                    className="lg:group-hover:hidden"
                                  />
                                  <img
                                    src={editIconRed}
                                    className="hidden lg:group-hover:block"
                                  />
                                </div>
                              ) : (
                                <div className="h-[28px]"></div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure
            as="div"
            className="fixed bg-white bg-opacity-60 backdrop-blur lg:static w-full left-0 right-0 bottom-0 z-[9] lg:z-0 lg:w-[50%]"
          >
            {({ open }) => (
              <>
                <div className="h-14 fixed inset-x-0 bottom-0 flex justify-between items-center px-3 lg:hidden border-t-2 bg-white">
                  {open ? (
                    <>
                      {isMarkHistory ? (
                        <Menu as="div">
                          <Menu.Button className="px-5 py-1 bg-red-600 rounded text-white font-semibold">
                            Delete
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
                            <Menu.Items className="fixed inset-0 z-[999] px-3 h-[100vh] flex items-center">
                              <div className="w-full md:max-w-md rounded-lg bg-white shadow-xl mb-6 pb-6 px-4 mx-auto border-2 border-red-500">
                                <h3 className="mt-6 text-center text-2xl font-bold tracking-tight text-red-600 mb-6">
                                  Are you sure?
                                </h3>
                                <div className="flex justify-center gap-2">
                                  <Menu.Button
                                    className="bg-red-600 w-24 py-1 font-bold text-white rounded-md hover:bg-red-500"
                                    onClick={() => {
                                      setIsMarkHistory(false);
                                      setMark([]);
                                      setIsMarkAll(false);
                                    }}
                                  >
                                    No
                                  </Menu.Button>
                                  {isLoading ? (
                                    <button className="bg-slate-500 flex justify-center items-center w-24 py-1 font-bold text-white rounded-md hover:bg-slate-400">
                                      <div className="w-5 h-5">
                                        <Spinner fill="text-white" />
                                      </div>
                                    </button>
                                  ) : (
                                    <button
                                      className="bg-slate-500 w-24 py-1 font-bold text-white rounded-md hover:bg-slate-400"
                                      onClick={(e) =>
                                        handlerDeleteHistory.mutate(e)
                                      }
                                    >
                                      <span>Yes</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      ) : (
                        <div
                          className="w-6"
                          onClick={() => {
                            setIsMarkHistory(true);
                          }}
                        >
                          <img src={trashIcon} />
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-700 text-xl font-semibold">
                      My Transactions
                    </span>
                  )}
                  {open ? (
                    <Disclosure.Button className="flex justify-center items-center pt-1">
                      <div className="w-[30px] h-[30px] scale-[180%]">
                        <Arrow fill="text-red-600" />
                      </div>
                    </Disclosure.Button>
                  ) : (
                    <Disclosure.Button className="flex justify-center items-center">
                      <div className="w-[30px] h-[30px] scale-[180%] rotate-180">
                        <Arrow fill="text-red-600" />
                      </div>
                    </Disclosure.Button>
                  )}
                </div>

                <Disclosure.Panel className="lg:hidden h-[100vh]">
                  <div className="">
                    <div className="flex justify-between px-3 pt-24 pb-2 bg-white border-b-2">
                      <h2 className="text-3xl font-extrabold text-red-600 mb-2">
                        My Transactions
                      </h2>
                      {isMarkHistory && (
                        <>
                          {isMarkAll ? (
                            <div
                              className="w-8 pt-[2px] mr-[1px]"
                              onClick={() => {
                                setMark([]);
                                setIsMarkAll(false);
                              }}
                            >
                              <img src={markAllActiveIcon} />
                            </div>
                          ) : (
                            <div
                              className="w-8 pt-[2px] mr-[1px]"
                              onClick={() => {
                                handlerMarkAll();
                                setIsMarkAll(true);
                              }}
                            >
                              <img src={markAllIcon} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div
                      className={`flex flex-col px-3 overflow-y-scroll pb-9 ${
                        windowHeight < 600 ? "h-[56vh]" : "h-[70vh]"
                      }`}
                    >
                      {transactions !== 0 && transactions !== undefined && (
                        <>
                          {transactions?.map((trans, index) => (
                            <div key={trans.id} className="pt-3">
                              <div className="md:flex rounded-lg p-3 bg-rose-100">
                                {isMarkHistory && (
                                  <div className="h-[26px] flex justify-end mb-1">
                                    <div onClick={() => handlerMark(trans.id)}>
                                      {mark.filter(
                                        (element) => element === trans.id
                                      )[0] === trans.id ? (
                                        <div className="bg-red-600 h-full w-[26px] p-[2px] rounded border-2 border-red-400">
                                          <img src={chekMarkIcon} />
                                        </div>
                                      ) : (
                                        <div className="bg-slate-300 h-full w-[26px] p-[2px] rounded border-2 border-red-400"></div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                <div className="">
                                  {trans.carts.map((cart) => (
                                    <div
                                      key={cart.id}
                                      className="grid grid-cols-[90px,auto] mb-4"
                                    >
                                      <div className="aspect-[3/5] flex justify-center rounded overflow-hidden">
                                        <img
                                          src={cart.product.image}
                                          className="h-full max-w-none"
                                        />
                                      </div>
                                      <div className="ml-2 flex flex-col justify-between">
                                        <div>
                                          <div className="mb-2">
                                            <h5 className="text-lg font-semibold text-red-700 leading-5 mb-1">
                                              {cart.product.title}
                                            </h5>
                                            <h6 className="text-sm">
                                              <span className=" text-red-800">
                                                {cart.trans_day},{" "}
                                              </span>
                                              {cart.trans_time}
                                            </h6>
                                          </div>
                                          <div className="grid grid-cols-[64px,auto] mb-1">
                                            <div className="font-semibold text-sm flex justify-between leading-4">
                                              <span className="block">
                                                Topping
                                              </span>
                                              <span className="block">:</span>
                                            </div>
                                            <div className="text-sm ml-2 leading-4 text-slate-700">
                                              {cart.toppings.map(
                                                (topping, index) => (
                                                  <span key={topping.id}>
                                                    {cart.toppings.length ===
                                                    index + 1 ? (
                                                      <>{topping.title}</>
                                                    ) : (
                                                      <>{topping.title}, </>
                                                    )}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-[64px,auto]">
                                          <div className="font-semibold text-sm flex justify-between">
                                            <span className="block">Price</span>
                                            <span className="block">:</span>
                                          </div>
                                          <div className="text-sm ml-2">
                                            <span className="block text-red-700">
                                              {contexts.formatRupiah(
                                                cart.price
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 grid grid-cols-[60px,60px,auto] gap-2 border-t-[1px] border-slate-400 pt-3">
                                  <div className="">
                                    <img className="w-100" src={logo} />
                                  </div>
                                  <div className="">
                                    <img className="w-100" src={barcodIcon} />
                                  </div>
                                  <div className="pl-2 flex flex-col justify-between h-full">
                                    <div className="w-full text-center">
                                      <button className="px-3 py-1 rounded bg-teal-400 text-teal-400 bg-opacity-20">
                                        <span>{trans.status}</span>
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-[50px,auto] text-red-700">
                                      <div className="flex justify-between leading-4 font-semibold">
                                        <span>Total</span>
                                        <span>:</span>
                                      </div>
                                      <span className="leading-4 font-semibold text-end">
                                        {contexts.formatRupiah(
                                          trans.total_price
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </Disclosure.Panel>

                <div className="hidden lg:block space-y-1 px-3 pl-10"></div>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
};

export default Profile;
