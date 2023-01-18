import React, { useState } from "react";
import Spinner from "../components/feedback/spinner2";
import blankImage from "../assets/blankImageSquare.png";
import { useMutation } from "react-query";
import { API } from "../config/Api";

const AddTopping = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(blankImage);

  const [toppingData, setToppingData] = useState({
    title: "",
    price: "",
    image: "",
  });

  const handleOnChange = (e) => {
    setToppingData({
      ...toppingData,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handlerAddTopping = useMutation(async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const formData = new FormData();
      formData.set("title", toppingData.title);
      formData.set("price", toppingData.price);
      if (toppingData?.image !== undefined) {
        formData.set(
          "image",
          toppingData?.image[0],
          toppingData?.image[0]?.name
        );
      }

      await API.post("/topping", formData);

      setIsLoading(false);
      setToppingData({ title: "", price: "", image: "" });
      setPreview(blankImage);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="mt-20 lg:mt-32 md:py-4">
      <div className="lg:relative mx-auto max-w-6xl 2xl:max-w-7xl lg:px-10">
        <div className="px-3 mb-5 md:mb-20 lg:hidden">
          <h2 className="text-3xl font-extrabold text-red-600 mb-2">
            Add Topping
          </h2>
        </div>
        <div className="md:flex justify-between md:flex-row-reverse px-3">
          <div className="px-8 pb-16 pt-12 lg:pb-0 md:px-0 md:w-[40%] lg:w-[36%] 2xl:w-[32%] lg:mt-20">
            <img src={preview} className="w-full" />
          </div>
          <div className="mb-6 md:w-[60%] md:pr-6 lg:pr-28 md:flex items-center lg:block">
            <div className="mb-24 hidden lg:block">
              <h2 className="text-3xl font-extrabold text-red-600 mb-2">
                Add Topping
              </h2>
            </div>
            <form
              className="w-full"
              onSubmit={(e) => handlerAddTopping.mutate(e)}
            >
              <div className="mb-3 md:mb-5">
                <input
                  name="title"
                  type="text"
                  required
                  className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 md:py-3 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="Title"
                  value={toppingData.title}
                  onChange={handleOnChange}
                />
              </div>
              <div className="mb-3 md:mb-5">
                <input
                  name="price"
                  type="number"
                  required
                  className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 md:py-3 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="Price"
                  value={toppingData.price}
                  onChange={handleOnChange}
                />
              </div>
              <div className="mb-3 md:mb-12">
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-red-600 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-red-600 focus-within:outline-none hover:text-red-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="image"
                          type="file"
                          className="sr-only"
                          {...(toppingData.image === "" && { value: "" })}
                          onChange={handleOnChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="flex justify-center items-center group w-full rounded-md bg-red-600 hover:bg-red-500 py-[5px] px-4 text-md font-semibold text-white focus:outline-none"
              >
                {isLoading && (
                  <div className="w-7 h-7 mr-2">
                    <Spinner fill="text-red-50" />
                  </div>
                )}
                <div className="h-8 flex items-center">Add Topping</div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTopping;
