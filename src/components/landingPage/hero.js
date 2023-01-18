import React from "react";
import heroImg from "../../assets/heroImg.png";
import heroImgFliped from "../../assets/heroImgFliped.png";
import hero from "../../assets/hero.png";

const Hero = () => {
  return (
    <div className="bg-red-700 lg:bg-white mt-20 lg:mt-32 py-4">
      <div className="lg:relative mx-auto max-w-6xl 2xl:max-w-7xl lg:px-10">
        <div className="pr-3 hidden lg:block">
          <img src={hero} />
        </div>
        <div className="lg:absolute md:flex md:items-center md:justify-between lg:top-16 xl:top-24 lg:left-24 xl:left-24 lg:w-[40%]">
          <div className="md:w-[50%] md:ml-6 lg:w-full">
            <div className="px-3">
              <h1 className="font-black text-5xl text-red-50 mb-2 lg:mb-8">
                WAYSBUCKS
              </h1>
            </div>
            <div className="pr-3 md:hidden">
              <img src={heroImg} />
            </div>
            <div className="px-3">
              <h5 className="font-semibold text-red-50 mb-3 leading-6 lg:mb-4 mt-3 text-lg lg:text-lg">
                Things are changing, but we're still here for you
              </h5>
              <p className="text-red-50">
                We have temporarily closed our in-store cafes, but select
                grocery and drive-thru locations remaining open. Waysbucks
                Drivers is also available.
              </p>
            </div>
          </div>
          <div className="pr-0 hidden md:block lg:hidden md:w-[46%]">
            <img src={heroImgFliped} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
