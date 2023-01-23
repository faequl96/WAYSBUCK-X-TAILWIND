import { Checkbox, Table } from "flowbite-react";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { API } from "../config/Api";
import { AppContext } from "../contexts/appContexts";
import chekMarkIcon from "../assets/checkmark.png";
import markAllIcon from "../assets/markAll.png";
import markAllActiveIcon from "../assets/markAllActive.png";
import barcodIcon from "../assets/barcod.png";
import logo from "../assets/logo.png";
import { useMutation } from "react-query";
import Spinner from "../components/feedback/spinner2";
import { UserContext } from "../contexts/userContext";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Transactions = () => {
  const [state, dispatch] = useContext(UserContext);
  const contexts = useContext(AppContext);
  const [transactions, setTransactions] = useState();
  const [mark, setMark] = useState([]);
  const [isMarkAll, setIsMarkAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState([]);

  useEffect(() => {
    async function getDataTrans() {
      const result = await API.get("/transactions");
      setTransactions(result.data.data);
    }
    getDataTrans();
  }, []);

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

  const handlerDetail = (id) => {
    let filterID = detail.filter((e) => e === id);
    if (filterID[0] !== id) {
      setDetail([id]);
    } else {
      setDetail(detail.filter((e) => e !== id));
    }
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

      const result = await API.get("/transactions");
      setTransactions(result.data.data);

      setIsLoading(false);
      setMark([]);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="mt-20 lg:mt-32 py-4">
      <div className="lg:relative mx-auto max-w-6xl 2xl:max-w-7xl lg:px-10 px-3">
        <div className="mb-7 bg-white left-0 right-0 top-0 flex justify-between">
          <h2 className="text-3xl font-extrabold text-red-600 mb-2 lg:mt-0">
            Transactions
          </h2>
          {state.user.email === "ulul@email.com" && (
            <>
              {isLoading ? (
                <button className="bg-red-600 flex justify-center items-center w-24 h-9 text-white rounded-md cursor-default">
                  <div className="w-5 h-5">
                    <Spinner fill="text-white" />
                  </div>
                </button>
              ) : (
                <button
                  className="bg-red-600 w-24 h-9 font-bold text-white rounded-md hover:bg-red-500"
                  onClick={(e) => handlerDeleteHistory.mutate(e)}
                >
                  <span>Delete</span>
                </button>
              )}
            </>
          )}
        </div>
        <div className="max-h-[70vh] lg:max-h-[60vh] w-full overflow-scroll">
          <div className="w-[1680px]">
            <Table hoverable={true} striped={true}>
              <Table.Head className="bg-slate-200">
                {state.user.email === "ulul@email.com" && (
                  <Table.HeadCell className="!p-4">
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
                  </Table.HeadCell>
                )}
                <Table.HeadCell>No</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Recepient Name</Table.HeadCell>
                <Table.HeadCell>Phone</Table.HeadCell>
                <Table.HeadCell>Address</Table.HeadCell>
                <Table.HeadCell>Post Code</Table.HeadCell>
                <Table.HeadCell>Income</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Detail</Table.HeadCell>
              </Table.Head>
              <tbody>
                {transactions !== 0 && transactions !== undefined && (
                  <>
                    {transactions?.map((tran, index) => (
                      <Table.Row
                        key={index}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        {state.user.email === "ulul@email.com" && (
                          <Table.Cell className="!p-4">
                            <div className="h-[24px] flex justify-end pr-2">
                              <div onClick={() => handlerMark(tran.id)}>
                                {mark.filter(
                                  (element) => element === tran.id
                                )[0] === tran.id ? (
                                  <div className="bg-red-600 h-full w-[24px] rounded border-2 border-red-400">
                                    <img src={chekMarkIcon} />
                                  </div>
                                ) : (
                                  <div className="bg-slate-300 h-full w-[24px] rounded border-2 border-red-400"></div>
                                )}
                              </div>
                            </div>
                          </Table.Cell>
                        )}
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{tran?.name}</Table.Cell>
                        <Table.Cell>{tran?.email}</Table.Cell>
                        <Table.Cell>{tran?.recepient_name}</Table.Cell>
                        <Table.Cell>{tran?.phone}</Table.Cell>
                        <Table.Cell>{tran?.address}</Table.Cell>
                        <Table.Cell>{tran?.pos_code}</Table.Cell>
                        <Table.Cell>
                          {contexts.formatRupiah(tran?.total_price)}
                        </Table.Cell>
                        <Table.Cell>
                          {tran.status === "Success" && (
                            <button className="px-3 py-1 rounded bg-teal-400 text-teal-400 bg-opacity-20 w-full">
                              <span>{tran.status}</span>
                            </button>
                          )}
                          {tran.status === "Failed" && (
                            <button className="px-3 py-1 rounded bg-red-500 text-red-500 bg-opacity-20 w-full">
                              <span>{tran.status}</span>
                            </button>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <button
                            className="cursor-pointer bg-red-600 hover:bg-red-500 py-1 px-4 text-white rounded"
                            onClick={() => handlerDetail(tran.id)}
                          >
                            Show
                          </button>
                        </Table.Cell>
                      </Table.Row>
                    ))}

                    {transactions?.map((trans) => (
                      <div key={trans.id}>
                        {detail.filter((element) => element === trans.id)[0] ===
                          trans.id && (
                          <div className="fixed inset-0 bg-slate-700 bg-opacity-60 backdrop-blur z-[999] flex justify-center items-center">
                            <div className="rounded-lg p-3 w-[96vw] max-w-2xl bg-rose-100 relative">
                              <div
                                className="absolute right-0 -top-10 bg-red-600 hover:bg-red-500 rounded cursor-pointer"
                                onClick={() => handlerDetail(trans.id)}
                              >
                                <XMarkIcon
                                  className="block h-8 w-8 text-white"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="md:grid grid-cols-[auto,170px]">
                                <div className="max-h-72 overflow-y-scroll py-3">
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
                                <div className="mt-2 md:mt-0 grid grid-cols-[60px,60px,auto] gap-2 md:block border-t-[1px] md:border-t-0 md:border-l-[1px] border-red-300 md:pl-3 pt-3 md:pt-0">
                                  <div className="md:flex justify-center md:mb-1">
                                    <div className="md:w-14">
                                      <img className="w-100" src={logo} />
                                    </div>
                                  </div>
                                  <div className="md:flex justify-center md:mb-2">
                                    <div className="md:w-16">
                                      <img className="w-100" src={barcodIcon} />
                                    </div>
                                  </div>
                                  <div className="pl-2 md:pl-0 flex flex-col justify-between md:block h-full">
                                    <div className="w-full text-center md:mb-2">
                                      {trans.status === "Success" && (
                                        <button className="px-3 py-1 rounded bg-teal-400 text-teal-400 bg-opacity-20">
                                          <span>{trans.status}</span>
                                        </button>
                                      )}
                                      {trans.status === "Failed" && (
                                        <button className="px-3 py-1 rounded bg-red-500 text-red-500 bg-opacity-20">
                                          <span>{trans.status}</span>
                                        </button>
                                      )}
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
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
