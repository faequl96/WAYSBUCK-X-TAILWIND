import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { API } from "../config/Api";
import { AppContext } from "../contexts/appContexts";
import checkIcon from "../assets/check.png";
import Spinner from "../components/feedback/spinner2";
import { UserContext } from "../contexts/userContext";

const DetailProduct = () => {
  const { id } = useParams();
  const [state] = useContext(UserContext);

  const contexts = useContext(AppContext);

  let { data: product } = useQuery("productCache", async () => {
    const response = await API.get("/product/" + id);
    return response.data.data;
  });

  let { data: toppings } = useQuery("toppingsCache", async () => {
    const response = await API.get("/toppings");
    return response.data.data;
  });

  const [toppingCheck, setToppingCheck] = useState([]);
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    setTotalPrice(product?.price);
  }, [product]);

  const handlerCheckTopping = (id, price) => {
    let filterID = toppingCheck.filter((e) => e === id);
    if (filterID[0] !== id) {
      setToppingCheck([...toppingCheck, id]);
      setTotalPrice(totalPrice + price);
    } else {
      setToppingCheck(toppingCheck.filter((e) => e !== id));
      setTotalPrice(totalPrice - price);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handlerAddCart = useMutation(async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const config = { headers: { "Content-type": "application/json" } };
      const body = JSON.stringify({
        product_id: parseInt(id),
        toppings_id: toppingCheck,
        price: totalPrice,
      });
      await API.post("/add-cart", body, config);

      setToppingCheck([]);
      setTotalPrice(product.price);
      setIsLoading(false);

      const response = await API.get("/cart");
      contexts.setCartLength(response.data.data.length);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="mt-20 lg:mt-32 md:py-4">
      <div className="lg:relative mx-auto max-w-6xl 2xl:max-w-7xl lg:px-10">
        <div className="px-3 mb-3 md:hidden">
          <h2 className="font-extrabold text-3xl text-red-700 mb-2">
            {product?.title}
          </h2>
          <span className="font-semibold text-lg text-red-900">
            {contexts.formatRupiah(product?.price)}
          </span>
        </div>
        <div className="md:flex justify-between">
          <div className="px-3 md:px-0 aspect-[1/1] md:aspect-[2/3] lg:aspect-[5/7] overflow-hidden md:w-[40%] lg:w-[44%] xl:w-[40%]">
            <div className="flex justify-center md:h-full">
              <img src={product?.image} className="md:max-w-none" />
            </div>
          </div>
          <div className="px-3 md:px-6 lg:pl-10 md:w-[60%] lg:w-[56%] xl:w-[60%]">
            <div className="hidden md:block">
              <h2 className="font-extrabold text-3xl md:text-4xl text-red-700 mb-4">
                {product?.title}
              </h2>
              <span className="font-semibold text-xl lg:text-2xl text-red-900">
                {contexts.formatRupiah(product?.price)}
              </span>
            </div>
            <h5 className="font-extrabold text-2xl text-red-700 mt-4 md:mt-8">
              Topping
            </h5>
            <div className="mt-5 md:mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:px-0 mb-16 lg:mb-4">
              {toppings?.map((item) => (
                <div key={item.id} className="flex mb-3 lg:block">
                  <div className="aspect-[1/1] w-[36%] lg:w-[38%] xl:w-[44%] mr-2 flex items-center lg:mx-auto relative">
                    <img
                      src={item.image}
                      className="cursor-pointer"
                      onClick={() => handlerCheckTopping(item.id, item.price)}
                    />
                    {toppingCheck.filter(
                      (element) => element === item.id
                    )[0] === item.id && (
                      <div className="absolute right-0 bottom-0 lg:top-0 rounded-full">
                        <img
                          src={checkIcon}
                          alt=""
                          style={{ height: "25px", width: "25px" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center w-[64%] lg:w-full">
                    <div className="lg:w-full">
                      <p className="text-red-700 text-[.96rem] font-semibold mt-1 mb-1 leading-[1.2rem] lg:text-center">
                        {item.title}
                      </p>
                      <p className="text-red-900 lg:text-center">
                        {contexts.formatRupiah(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {state.user.role === "customer" && (
              <div className="fixed lg:static bottom-0 lg:bottom-auto left-0 lg:left-auto right-0 lg:right-auto h-14 lg:w-full bg-white bg-opacity-60 backdrop-blur border-t-2 lg:border-t-0">
                <div className="h-14 px-3 lg:px-0">
                  <div className="h-full flex lg:block justify-between items-center">
                    <div className="h-full w-[30%] lg:w-full">
                      <div className="flex items-center lg:justify-between h-full">
                        <h5 className="font-bold text-lg lg:text-2xl text-red-900">
                          Total
                        </h5>
                        <h5 className="hidden lg:block font-bold text-lg lg:text-2xl text-red-900 mr-3 lg:mr-0">
                          {contexts.formatRupiah(totalPrice)}
                        </h5>
                      </div>
                    </div>

                    <div className="text-end w-[70%] lg:w-full">
                      <div className="flex justify-end items-center h-full">
                        <h5 className="lg:hidden font-bold text-lg lg:text-2xl text-red-900 mr-3">
                          {contexts.formatRupiah(totalPrice)}
                        </h5>
                        {isLoading ? (
                          <button className="py-2 w-32 lg:text-xl lg:w-full bg-red-600 rounded text-white font-bold flex justify-center items-center">
                            <div className="w-6 h-6">
                              <Spinner fill="text-red-50" />
                            </div>
                          </button>
                        ) : (
                          <button
                            className="py-2 w-32 lg:text-xl lg:w-full rounded-md bg-red-600 hover:bg-red-500 font-bold text-white"
                            onClick={(e) => handlerAddCart.mutate(e)}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
