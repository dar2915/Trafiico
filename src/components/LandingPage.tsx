"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoChevronBack, IoRefresh } from "react-icons/io5";
import { LoadingScreenSection } from "./LoadingScreen";
import dynamic from "next/dynamic";
import { formatDistance, calculateFare } from "@/utils/utils";

const MapContainerComponent = dynamic(() => import("./MapContainer"), {
  ssr: false,
});

const LandingPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState(
    pathname === "/passenger/signin" ? "passenger" : "admin"
  );

  // const buttons = [
  //   {
  //     path: "/signin",
  //     label: "Sign-In",
  //     icon: <IoHomeOutline />,
  //   },
  //   {
  //     path: "/admin/dashboard/reports",
  //     label: "Report Driver",
  //     icon: <IoClipboardOutline />,
  //   },
  // ];

  const [showMap, setShowMap] = useState(false);
  const [origin, setOrigin] = useState<[number, number]>([7.22428, 125.638435]);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     setOrigin([position.coords.latitude, position.coords.longitude]);
  //   });
  // }, []);

  const [distance, setDistance] = useState<number | null>(null);

  return (
    <div className="w-screen h-[100svh] flex flex-col items-center justify-center font-Montserrat bg-[#03396C] gap-y-1 px-5">
      {loading && <LoadingScreenSection />}
      {/* <div className="w-full bg-white md:w-[450px] px-5 py-10 flex flex-col items-center rounded-xl backdrop-blur-2xl shadow-2xl font-Montserrat border-b-4 border-b-[#338FFF] space-y-8 ">
        <div className="rounded-3xl overflow-hidden">
          <Image src="/logo.svg" alt="Traffico Logo" width={200} height={200} />
        </div>
        <div className="w-full flex flex-col space-y-3 items-center text-white text-lg">
          {buttons.map((button, index) => (
            <button
              key={button.label + index}
              className="w-full flex text-left items-center justify-between space-x-3 bg-[#03396C] rounded-2xl py-5 px-10"
              onClick={() => router.push(button.path)}>
              {button.label}
              <span>{button.icon}</span>
            </button>
          ))}
        </div>
      </div> */}

      {showMap ? (
        <div className="relative overflow-hidden">
          <div className="w-full mx-5 text-lg my-5 z-10 absolute flex gap-3">
            <button
              onClick={() => setShowMap(false)}
              className="bg-sky-700 text-white rounded-lg px-3 py-2 flex items-center gap-1">
              <IoChevronBack />{" "}
              <span className="text-sm">{destination ? "OK" : "back"}</span>
            </button>
            {destination && (
              <button
                onClick={() => {
                  setDestination([0, 0]);
                  setDistance(null);
                }}
                className="bg-red-700 text-white rounded-lg px-3 py-2 flex items-center gap-1">
                <IoRefresh />
                <span className="text-sm">Reset</span>
              </button>
            )}
          </div>
          <div className="w-full mx-5 text-lg my-5 z-50 absolute bottom-0">
            <button className="bg-sky-700 text-white rounded-lg px-3 py-2 flex items-center gap-1">
              <span className="text-sm">
                Distance: {formatDistance(distance)}
              </span>
            </button>
          </div>
          {distance && (
            <>
              <div className="w-full mx-5 text-lg my-5 z-50 absolute bottom-10">
                <button className="bg-green-700 text-white rounded-lg px-3 py-2 flex items-center gap-1">
                  <span className="text-sm">
                    Fare: {calculateFare(distance)}
                  </span>
                </button>
              </div>
              <div className="w-full mx-5 text-lg z-50 absolute bottom-28">
                <p className="text-red-600 italic text-xs">
                  Note: Mock-up fare calculation <br />
                  (P12.00 base fare + P2.00 per km after 1st km)
                </p>
              </div>
            </>
          )}
          <MapContainerComponent
            key={1}
            origin={origin}
            destination={destination}
            setOrigin={setOrigin}
            setDestination={setDestination}
            distance={distance}
            setDistance={setDistance}
          />
        </div>
      ) : (
        <>
          <div className="w-full h-[50svh] md:w-[50%] flex flex-col items-center justify-center">
            {/* <div className="relative"> */}
            <button
              className="rounded-full overflow-hidden shadow-xl shadow-sky-700 drop-shadow-2xl active:scale-95 active:shadow-lg"
              onClick={() => {
                setLoading(true);
                router.push("/report");
              }}>
              <Image
                src="/logo.svg"
                alt="Traffico Logo"
                width={250}
                height={250}
                className="w-64 h-64 md:w-72 md:h-72"
              />
            </button>
            {/* <div className="circle-animation"></div> */}
            {/* </div> */}

            {/* <button
          className="flex items-center justify-center bg-white shadow-lg rounded-full py-4 mt-16"
          onClick={() => router.push("/report")}>
          <span className="text-center font-semibold px-16">Report Driver</span>
        </button> */}
          </div>
          <div className="w-full h-[50svh] flex flex-col justify-center items-center sm:gap-5">
            <p className="text-xs text-gray-400 italic mb-20">
              Tap logo to start report
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex items-center justify-center bg-white shadow-lg rounded-full py-2.5 sm:py-3 text-center text-sm font-semibold px-20 sm:w-[50%]"
                onClick={() => {
                  setLoading(true);
                  router.push("/admin/signin");
                }}>
                Signin as Auth
              </button>
              <button
                className="flex items-center justify-center bg-white shadow-lg rounded-full py-2.5 sm:py-3 text-center text-sm font-semibold px-20 sm:w-[50%]"
                onClick={() => {
                  setLoading(true);
                  router.push("/passenger/signin");
                }}>
                Signin as Passenger
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <button
                className="flex items-center justify-center py-3 text-center text-white text-xs"
                onClick={() => {
                  setLoading(true);
                  router.push("/passenger/signup");
                }}>
                Create Passenger Account
              </button>

              <button
                className="flex items-center justify-center py-2 text-center bg-green-200 text-black rounded-full px-5 text-xs"
                onClick={() => {
                  setLoading(true);
                  setShowMap(true);
                  setLoading(false);
                }}>
                Show Map
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LandingPage;
