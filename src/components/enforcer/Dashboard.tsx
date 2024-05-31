"use client";

import { useState } from "react";
import { IoListOutline, IoPersonCircleOutline } from "react-icons/io5";
import { LuScanLine } from "react-icons/lu";
import {
  MdOutlineMyLocation,
  MdOutlineSettings,
  MdOutlineShareLocation,
  MdOutlineChecklist,
} from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";
import Reports from "../Reports";
import TopbarFloat from "../TopbarFloat";
import QrScannerComponent from "../QrScanner";

const EnforcerDashboardComponent = () => {
  const [currentView, setCurrentView] = useState("lists");
  const [showBottomBar, setShowBottomBar] = useState(true);

  return (
    <div className="w-screen h-[100svh] flex flex-col relative">
      <div className="h-full flex flex-col bg-[#f2f2f2]">
        {/* <TopbarFloat /> */}
        {currentView === "lists" && <TopbarFloat />}
        {currentView === "lists" && (
          <Reports setShowBottomBar={setShowBottomBar} />
        )}
        {currentView === "report" && (
          <QrScannerComponent
            setCurrentView={setCurrentView}
            setShowBottomBar={setShowBottomBar}
          />
        )}
      </div>
      {showBottomBar && (
        <div className="z-50 w-full absolute bottom-0 flex flex-col">
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
            <button
              className={`w-full flex flex-col items-center justify-center text-[38px] ${
                currentView === "report" ? "text-sky-700" : "text-white"
              }`}
              onClick={() => {
                setCurrentView("report");
              }}>
              <LuScanLine />
            </button>
            {/* <button
              className={`w-full flex flex-col items-center justify-center text-[38px] ${
                currentView === "settings" ? "text-sky-700" : "text-white"
              }`}
              onClick={() => {
                setCurrentView("settings");
              }}>
              <MdOutlineSettings />
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnforcerDashboardComponent;
