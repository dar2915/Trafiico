"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { LuScanLine } from "react-icons/lu";
import {
  MdOutlineCameraAlt,
  MdOutlineChecklist,
  MdOutlineMyLocation,
} from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";

import QrScannerComponent from "../QrScanner";
// import dynamic from "next/dynamic";
import Reports from "../Reports";
import TopbarFloat from "../TopbarFloat";
import { UserContext } from "@/utils/UserContext";
import { useRouter } from "next/navigation";
import SettingsPassengerComponents from "./Settings";

// const MapContainerComponent = dynamic(() => import("../MapContainer"), {
//   ssr: false,
// });

const DashboardPassengerComponent = () => {
  const [currentView, setCurrentView] = useState("lists");
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { userName, userId, userRole } = useContext(UserContext);

  const router = useRouter();

  // useEffect(() => {
  //   console.log("userRole", userRole);
  // }, [userRole]);

  useEffect(() => {
    // console.log("userRole", userRole);
    if (userRole === "unauthenticated") {
      setCurrentView("report");
    }
  }, [userRole]);

  const confirmShownRef = useRef(false);

  useEffect(() => {
    if (
      userRole === "unauthenticated" &&
      !confirmOpen &&
      !confirmShownRef.current
    ) {
      if (
        window.confirm(
          "The site will use of your camera. Do you want to proceed?"
        )
      ) {
        confirmShownRef.current = true;
        setConfirmOpen(true);
      } else {
        confirmShownRef.current = true;
        router.push("/");
      }
      return;
    }
    setConfirmOpen(true);
  }, [userRole, confirmOpen]);

  return (
    <div className="w-screen h-[100svh] flex flex-col relative">
      {userRole !== "unauthenticated" &&
        (currentView === "lists" || currentView === "settings") && (
          <TopbarFloat />
        )}
      {userRole !== "unauthenticated" && currentView === "lists" && (
        <Reports setShowBottomBar={setShowBottomBar} />
      )}
      {userRole !== "unauthenticated" && currentView === "settings" && (
        <SettingsPassengerComponents />
      )}
      {/* {currentView === "fare" && <MapContainerComponent />} */}
      {/* {!userRole && !confirmOpen &&
      (
        <div>
          <button></button>
          <MdOutlineCameraAlt />
        </div>
      )} */}
      {currentView === "report" && confirmOpen && (
        <QrScannerComponent
          setCurrentView={setCurrentView}
          setShowBottomBar={setShowBottomBar}
        />
      )}
      {showBottomBar && (
        <div className="z-50 w-full absolute bottom-0 flex flex-col">
          {userRole !== "unauthenticated" && (
            <div className="bg-[#171A20] justify-around items-center gap-2 flex flex-row py-4 my-10 mx-20 rounded-2xl">
              <button
                className={`w-full flex flex-col items-center justify-center text-[38px] ${
                  currentView === "lists" ? "text-sky-700" : "text-white"
                }`}
                onClick={() => {
                  setCurrentView("lists");
                }}>
                <MdOutlineChecklist />
              </button>
              {/* <button
              className={`w-full flex flex-col items-center justify-center text-[38px] ${
                currentView === "fare" ? "text-sky-700" : "text-white"
              }`}
              onClick={() => {
                setCurrentView("fare");
              }}>
              <MdOutlineMyLocation />
            </button> */}
              <button
                className={`w-full flex flex-col items-center justify-center text-[38px] ${
                  currentView === "report" ? "text-sky-700" : "text-white"
                }`}
                onClick={() => {
                  setCurrentView("report");
                }}>
                <LuScanLine />
                {/* <p className="text-sm">Orders</p> */}
              </button>
              <button
                className={`w-full flex flex-col items-center justify-center text-[38px] ${
                  currentView === "settings" ? "text-sky-700" : "text-white"
                }`}
                onClick={() => {
                  setCurrentView("settings");
                }}>
                {/* <MdOutlineSettings /> */}
                <RiSettings3Line />
                {/* <p className="text-sm">Orders</p> */}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPassengerComponent;
