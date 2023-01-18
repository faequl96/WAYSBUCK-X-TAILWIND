import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/Api";
import { AppContext } from "../../contexts/appContexts";
import Loading from "../feedback/loading3";

const Products = () => {
  const navigate = useNavigate();
  const contexts = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const { data: products } = useQuery("productsCache", async () => {
    setIsLoading(true);
    const response = await API.get("/products");
    setIsLoading(false);
    return response.data.data;
  });

  return (
    <div className="mt-4">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl lg:px-10">
        {isLoading ? (
          <div className="flex items-center px-3 lg:px-0 h-11">
            <h1 className="font-extrabold text-2xl xl:text-4xl text-red-700 mr-1">
              Let's Order
            </h1>
            <div className="h-11 w-11">
              <Loading fill="fill-red-700" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center px-3 lg:px-0 h-11">
              <h1 className="font-extrabold text-2xl xl:text-4xl text-red-700">
                Let's Order
              </h1>
            </div>
            <div className="mt-4 md:mt-8 grid grid-cols-1 gap-4 md:gap-8 md:px-16 lg:px-0 md:grid-cols-2 lg:grid-cols-4 mb-12 px-3">
              {products?.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer bg-red-100 rounded-xl overflow-hidden flex md:block h-28 md:h-full p-4 md:p-0 items-center border-2 border-red-600 border-opacity-20"
                  onClick={() => {
                    !contexts.isLogin
                      ? contexts.setShowLogin(true)
                      : navigate(`/menu/${item.id}/${item.title}`);
                  }}
                >
                  <div className="aspect-[3/4] w-16 md:w-full bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.image}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <div className="px-4">
                    <h3 className="text-md font-bold text-red-700 md:mt-4 md:mb-1">
                      {item.title}
                    </h3>
                    <p className="text-lg font-medium text-red-900 md:mb-4">
                      {contexts.formatRupiah(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
