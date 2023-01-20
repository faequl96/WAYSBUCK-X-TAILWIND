import { Disclosure } from "@headlessui/react";
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
  const [isEditPhoto, setIsEditPhoto] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditEmail, setIsEditEmail] = useState(false);
  const [isEditPhone, setIsEditPhone] = useState(false);
  const [isEditPosCode, setIsEditPosCode] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [preview, setPreview] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const [profile, setProfile] = useState();
  const [editData, setEditData] = useState({
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

      setIsLoading(false);
      contexts.refreshNavbar();
      setIsEditPhoto(false);
      setIsEditName(false);
      setIsEditEmail(false);
      setIsEditPhone(false);
      setIsEditPosCode(false);
      setIsEditAddress(false);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="mt-20 lg:mt-32 py-4">
      <div className="lg:relative mx-auto max-w-6xl 2xl:max-w-7xl lg:px-10">
        <div className="px-3 mb-3 lg:hidden">
          <h2 className="text-3xl font-extrabold text-red-600">My Profile</h2>
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
              <div className="md:grid grid-cols-[280px,auto] lg:grid-cols-[160px,auto] xl:grid-cols-[200px,auto] mb-4">
                <div className="w-100 h-32 md:h-64 lg:h-40 xl:h-48 flex justify-center md:justify-start relative">
                  <div className="aspect-[1/1] h-full relative">
                    <div className="aspect-[1/1] rounded-full overflow-hidden flex items-center border-8">
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
                    <>
                      {isLoading ? (
                        <div className="h-[28px] w-[28px] lg:h-[24px] lg:w-[24px] absolute right-0 bottom-0 lg:-right-1 lg:-bottom-1">
                          <div className="w-full h-full">
                            <Spinner fill="text-neutral-400" />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="h-[28px] w-[28px] lg:h-[24px] lg:w-[24px] absolute right-0 md:right-6 bottom-0 lg:-right-1 xl:right-0 lg:bottom-0 cursor-pointer group"
                          onClick={(e) => handleSubmit.mutate(e)}
                        >
                          <img
                            src={checkEditGray}
                            className="lg:group-hover:hidden"
                          />
                          <img
                            src={checkEditRed}
                            className="hidden lg:group-hover:block"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      className="h-[28px] w-[28px] lg:h-[24px] lg:w-[24px] absolute right-0 md:right-6 bottom-0 lg:-right-1 xl:right-0 lg:bottom-0 cursor-pointer group"
                      onClick={() => setIsEditPhoto(true)}
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

                <div className="mt-4 md:mt-0 md:pl-20 lg:pl-8 lg:pr-6 md:flex items-center">
                  <div className="w-full">
                    {/* START OF EDIT NAME */}
                    <div>
                      <h5 className="font-semibold text-lg leading-4 lg:text-md md:leading-5">
                        Name :
                      </h5>
                      <div className="grid grid-cols-[auto,28px] lg:grid-cols-[auto,24px] mb-4">
                        <div className="flex items-center w-full">
                          {isEditName ? (
                            <form className="w-full pr-3">
                              <input
                                type="text"
                                name="name"
                                autoFocus
                                onFocus={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
                                onBlur={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
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
                          <>
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="w-full h-full">
                                  <Spinner fill="text-neutral-400" />
                                </div>
                              </div>
                            ) : (
                              <div
                                className="flex items-center group cursor-pointer"
                                onClick={(e) => handleSubmit.mutate(e)}
                              >
                                <img
                                  src={checkEditGray}
                                  className="lg:group-hover:hidden"
                                />
                                <img
                                  src={checkEditRed}
                                  className="hidden lg:group-hover:block"
                                />
                              </div>
                            )}
                          </>
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
                    {/* END OF EDIT NAME */}
                    {/* START OF EDIT EMAIL */}
                    <div>
                      <h5 className="font-semibold text-lg leading-4 lg:text-md md:leading-5">
                        Email :
                      </h5>
                      <div className="grid grid-cols-[auto,28px] lg:grid-cols-[auto,24px] mb-4">
                        <div className="flex items-center w-full">
                          {isEditEmail ? (
                            <form className="w-full pr-3">
                              <input
                                type="email"
                                name="email"
                                autoFocus
                                onFocus={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
                                onBlur={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
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
                          <>
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="w-full h-full">
                                  <Spinner fill="text-neutral-400" />
                                </div>
                              </div>
                            ) : (
                              <div
                                className="flex items-center group cursor-pointer"
                                onClick={(e) => handleSubmit.mutate(e)}
                              >
                                <img
                                  src={checkEditGray}
                                  className="lg:group-hover:hidden"
                                />
                                <img
                                  src={checkEditRed}
                                  className="hidden lg:group-hover:block"
                                />
                              </div>
                            )}
                          </>
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
                    {/* END OF EDIT EMAIL */}
                    {/* START OF EDIT PHONE */}
                    <div>
                      <h5 className="font-semibold text-lg leading-4 lg:text-md md:leading-5">
                        Phone :
                      </h5>
                      <div className="grid grid-cols-[auto,28px] lg:grid-cols-[auto,24px] mb-4">
                        <div className="flex items-center w-full">
                          {isEditPhone ? (
                            <form className="w-full pr-3">
                              <input
                                type="text"
                                name="phone"
                                autoFocus
                                onFocus={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
                                onBlur={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
                                className="p-0 w-full border-0 focus:ring-0 underline text-slate-500"
                                value={editData.phone}
                                onChange={handleChange}
                              />
                            </form>
                          ) : (
                            <span className="block w-full pr-3">
                              {profile?.phone !== "" ? profile?.phone : "-"}
                            </span>
                          )}
                        </div>
                        {isEditPhone ? (
                          <>
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="w-full h-full">
                                  <Spinner fill="text-neutral-400" />
                                </div>
                              </div>
                            ) : (
                              <div
                                className="flex items-center group cursor-pointer"
                                onClick={(e) => handleSubmit.mutate(e)}
                              >
                                <img
                                  src={checkEditGray}
                                  className="lg:group-hover:hidden"
                                />
                                <img
                                  src={checkEditRed}
                                  className="hidden lg:group-hover:block"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="flex items-center group cursor-pointer"
                            onClick={() => setIsEditPhone(true)}
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
                    {/* END OF EDIT PHONE */}
                    {/* START OF EDIT POS CODE */}
                    <div>
                      <h5 className="font-semibold text-lg leading-4 lg:text-md md:leading-5">
                        Pos Code :
                      </h5>
                      <div className="grid grid-cols-[auto,28px] lg:grid-cols-[auto,24px] mb-4">
                        <div className="flex items-center w-full">
                          {isEditPosCode ? (
                            <form className="w-full pr-3">
                              <input
                                type="text"
                                name="pos_code"
                                autoFocus
                                onFocus={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
                                onBlur={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
                                className="p-0 w-full border-0 focus:ring-0 underline text-slate-500"
                                value={editData.pos_code}
                                onChange={handleChange}
                              />
                            </form>
                          ) : (
                            <span className="block w-full pr-3">
                              {profile?.pos_code !== "" ? profile?.pos_code : "-"}
                            </span>
                          )}
                        </div>
                        {isEditPosCode ? (
                          <>
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="w-full h-full">
                                  <Spinner fill="text-neutral-400" />
                                </div>
                              </div>
                            ) : (
                              <div
                                className="flex items-center group cursor-pointer"
                                onClick={(e) => handleSubmit.mutate(e)}
                              >
                                <img
                                  src={checkEditGray}
                                  className="lg:group-hover:hidden"
                                />
                                <img
                                  src={checkEditRed}
                                  className="hidden lg:group-hover:block"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="flex items-center group cursor-pointer"
                            onClick={() => setIsEditPosCode(true)}
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
                    {/* END OF EDIT POS CODE */}
                    {/* START OF EDIT ADDRESS */}
                    <div className="">
                      <h5 className="font-semibold text-lg leading-4 lg:text-md md:leading-5">
                        Address :
                      </h5>
                      <div className="grid grid-cols-[auto,28px] lg:grid-cols-[auto,24px] mb-4">
                        <div className="flex items-center w-full">
                          {isEditAddress ? (
                            <form className="w-full pr-3">
                              <input
                                type="text"
                                name="address"
                                autoFocus
                                onFocus={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
                                onBlur={() => setTimeout(() => {setWindowHeight(window.innerHeight)}, 300)}
                                className="p-0 w-full border-0 focus:ring-0 underline text-slate-500"
                                value={editData.address}
                                onChange={handleChange}
                              />
                            </form>
                          ) : (
                            <span className="block w-full pr-3 leading-[1.2rem] mt-1">
                              {profile?.address !== "" ? profile?.address : "-"}
                            </span>
                          )}
                        </div>
                        {isEditAddress ? (
                          <>
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="w-full h-full">
                                  <Spinner fill="text-neutral-400" />
                                </div>
                              </div>
                            ) : (
                              <div
                                className="group cursor-pointer"
                                onClick={(e) => handleSubmit.mutate(e)}
                              >
                                <img
                                  src={checkEditGray}
                                  className="lg:group-hover:hidden"
                                />
                                <img
                                  src={checkEditRed}
                                  className="hidden lg:group-hover:block"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="group cursor-pointer"
                            onClick={() => setIsEditAddress(true)}
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
                    {/* END OF EDIT ADDRESS */}
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
                    <div className="flex flex-col-reverse px-3 h-[80vh] overflow-y-scroll pt-3 pb-24">
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
