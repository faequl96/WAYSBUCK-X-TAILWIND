import { Disclosure } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { API } from "../config/Api";
import { AppContext } from "../contexts/appContexts";
import { UserContext } from "../contexts/userContext";
import editPhoto from "../assets/edit.png";
import editIconGray from "../assets/editIconGray.png";
import editIconRed from "../assets/editIconRed.png";
import checkEditGray from "../assets/checkEditGray.png";
import checkEditRed from "../assets/checkEditRed.png";
import barcodIcon from "../assets/barcod.png";
import logo from "../assets/logo.png";
import Arrow from "../components/icon/arrow";
import Spinner from "../components/feedback/spinner2";

const Profile = () => {
  const contexts = useContext(AppContext);
  const [state] = useContext(UserContext);
  const [trans, setTrans] = useState();
  const [profile, setProfile] = useState();
  const [isEditPhoto, setIsEditPhoto] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditEmail, setIsEditEmail] = useState(false);
  const [preview, setPreview] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    image: "",
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
      setTrans(result.data.data);
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
    setEditData({ name: profile?.name, email: profile?.email });
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

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const formData = new FormData();
      formData.set("name", editData.name);
      formData.set("email", editData.email);
      if (editData?.image !== undefined) {
        formData.set("image", editData?.image[0], editData?.image[0]?.name);
      }

      await API.patch(`/user/${state.user.id}`, formData);

      const result = await API.get("/check-auth");
      setProfile(result.data.data);

      setIsLoading(false);
      contexts.refreshNavbar();
      setIsEditPhoto(false);
      setIsEditName(false);
      setIsEditEmail(false);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="mt-20 lg:mt-32 py-4">
      <div className="lg:relative mx-auto max-w-6xl 2xl:max-w-7xl lg:px-10">
        <div className="px-3 mb-5 lg:hidden">
          <h2 className="text-3xl font-extrabold text-red-600 mb-2">
            My Profile
          </h2>
        </div>
        <div className="lg:flex justify-between lg:mb-4">
          <div className="px-3 lg:w-[50%] mb-16">
            <div className="mb-8 hidden lg:block">
              <h2 className="text-3xl font-extrabold text-red-600 mb-2">
                My Profile
              </h2>
            </div>
            <div className="md:grid grid-cols-[360px,auto] lg:grid-cols-[200px,auto]">
              <div className="w-100 h-48 md:h-auto flex justify-center relative">
                <div className="aspect-[1/1] h-full relative">
                  <div className="aspect-[1/1] rounded-full overflow-hidden flex items-center bg-slate-400">
                    <img src={preview} className="w-full" />
                  </div>
                  {isEditPhoto && (
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
                {isEditPhoto ? (
                  <div
                    className="h-[32px] w-[32px] lg:h-[30px] lg:w-[30px] absolute right-0 bottom-0 lg:-right-1 lg:-bottom-1 cursor-pointer group"
                    onClick={(e) => handleSubmit.mutate(e)}
                  >
                    {isLoading ? (
                      <div className="w-full h-full">
                        <Spinner fill="text-neutral-400" />
                      </div>
                    ) : (
                      <>
                        <img
                          src={checkEditGray}
                          className="lg:group-hover:hidden"
                        />
                        <img
                          src={checkEditRed}
                          className="hidden lg:group-hover:block"
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    className="h-[32px] w-[32px] lg:h-[30px] lg:w-[30px] absolute right-0 bottom-0 lg:-right-1 lg:-bottom-1 cursor-pointer group"
                    onClick={() => setIsEditPhoto(true)}
                  >
                    <img src={editIconGray} className="lg:group-hover:hidden" />
                    <img
                      src={editIconRed}
                      className="hidden lg:group-hover:block"
                    />
                  </div>
                )}
              </div>

              <div className="mt-12 md:mt-0 md:pl-20 lg:pl-8 lg:pr-6 md:flex items-center">
                <div className="w-full">
                  {/* EDIT NAME */}
                  <div>
                    <h5 className="font-semibold text-lg">Name :</h5>
                    <div className="grid grid-cols-[auto,32px] lg:grid-cols-[auto,30px] mb-4">
                      <div className="flex items-center w-full">
                        {isEditName ? (
                          <form className="w-full pr-3">
                            <input
                              type="text"
                              name="name"
                              autoFocus
                              className="p-0 w-full border-0 focus:ring-0 underline text-slate-500"
                              value={editData.name}
                              onChange={handleChange}
                            />
                          </form>
                        ) : (
                          <span className="block w-full pr-3">
                            {profile?.name}
                          </span>
                        )}
                      </div>
                      {isEditName ? (
                        <div
                          className="flex items-center group cursor-pointer"
                          onClick={(e) => handleSubmit.mutate(e)}
                        >
                          {isLoading ? (
                            <div className="w-full h-full">
                              <Spinner fill="text-neutral-400" />
                            </div>
                          ) : (
                            <>
                              <img
                                src={checkEditGray}
                                className="lg:group-hover:hidden"
                              />
                              <img
                                src={checkEditRed}
                                className="hidden lg:group-hover:block"
                              />
                            </>
                          )}
                        </div>
                      ) : (
                        <div
                          className="flex items-center group cursor-pointer"
                          onClick={() => setIsEditName(true)}
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
                      )}
                    </div>
                  </div>
                  {/* EDIT EMAIL */}
                  <div>
                    <h5 className="font-semibold text-lg">Email :</h5>
                    <div className="grid grid-cols-[auto,32px] lg:grid-cols-[auto,30px] mb-4">
                      <div className="flex items-center w-full">
                        {isEditEmail ? (
                          <form className="w-full pr-3">
                            <input
                              type="email"
                              name="email"
                              autoFocus
                              className="p-0 w-full border-0 focus:ring-0 underline text-slate-500"
                              value={editData.email}
                              onChange={handleChange}
                            />
                          </form>
                        ) : (
                          <span className="block w-full pr-3">
                            {profile?.email}
                          </span>
                        )}
                      </div>
                      {isEditEmail ? (
                        <div
                          className="flex items-center group cursor-pointer"
                          onClick={(e) => handleSubmit.mutate(e)}
                        >
                          {isLoading ? (
                            <div className="w-full h-full">
                              <Spinner fill="text-neutral-400" />
                            </div>
                          ) : (
                            <>
                              <img
                                src={checkEditGray}
                                className="lg:group-hover:hidden"
                              />
                              <img
                                src={checkEditRed}
                                className="hidden lg:group-hover:block"
                              />
                            </>
                          )}
                        </div>
                      ) : (
                        <div
                          className="flex items-center group cursor-pointer"
                          onClick={() => setIsEditEmail(true)}
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
                      )}
                    </div>
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
                <div className="h-14 fixed inset-x-0 bottom-0 flex justify-between items-center pl-3 pr-1 lg:hidden border-t-2 bg-white">
                  {open ? (
                    <div></div>
                  ) : (
                    <span className="text-slate-700 text-xl font-semibold">
                      My Transactions
                    </span>
                  )}
                  {open ? (
                    <Disclosure.Button className="flex justify-center items-center pt-1">
                      <div className="w-12 h-12 scale-110">
                        <Arrow fill="text-red-600" />
                      </div>
                    </Disclosure.Button>
                  ) : (
                    <Disclosure.Button className="flex justify-center items-center">
                      <div className="w-12 h-12 scale-110 rotate-180">
                        <Arrow fill="text-red-600" />
                      </div>
                    </Disclosure.Button>
                  )}
                </div>

                <Disclosure.Panel className="lg:hidden h-[100vh]">
                  <div className="">
                    <div className="px-3 pt-24 pb-2 bg-white border-b-2">
                      <h2 className="text-3xl font-extrabold text-red-600 mb-2">
                        My Transactions
                      </h2>
                    </div>
                    <div className="px-3 h-[80vh] overflow-y-scroll pt-3 pb-24">
                      {trans !== 0 && trans !== undefined && (
                        <>
                          {trans?.map((trans) => (
                            <div
                              key={trans.id}
                              className="md:flex rounded-lg p-3 mb-3 bg-rose-100"
                            >
                              <div className="">
                                {trans.carts.map((cart, index) => (
                                  <div
                                    key={index}
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
                                            {contexts.formatRupiah(cart.price)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2 grid grid-cols-[60px,60px,auto] gap-2 border-t-[1px] border-slate-800 pt-3">
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
                                      {contexts.formatRupiah(trans.total_price)}
                                    </span>
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
