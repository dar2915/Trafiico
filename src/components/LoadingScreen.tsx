"use client";

import { RotatingLines } from "react-loader-spinner";

export const LoadingScreenSection = () => {
  return (
    <div className="z-[100] flex w-full h-full justify-center items-center absolute inset-0 bg-opacity-50 bg-black">
      <RotatingLines
        visible={true}
        strokeColor="darkblue"
        width="80"
        animationDuration="0.80"
      />
    </div>
  );
};

export const LoadingScreenFullScreen = () => {
  return (
    <div className="z-[200] flex w-screen h-[100svh] justify-center items-center">
      <RotatingLines
        visible={true}
        strokeColor="darkblue"
        width="80"
        animationDuration="0.80"
      />
    </div>
  );
};
