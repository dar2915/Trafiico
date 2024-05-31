"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  IoHomeOutline,
  IoPeopleOutline,
  IoClipboardOutline,
  IoCalendarOutline,
  IoArchiveOutline,
  IoSettingsOutline,
  IoDownloadOutline,
  IoLogOutOutline,
  IoMenuOutline,
} from "react-icons/io5";

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

  return (
    <div className="w-screen h-[100svh] flex flex-col items-center justify-center font-Montserrat bg-[#03396C] gap-y-10 px-5">
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

      <div className="w-full h-[70svh] md:w-[50%] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="rounded-3xl overflow-hidden">
            <Image
              src="/logo.svg"
              alt="Traffico Logo"
              width={200}
              height={200}
            />
          </div>
          {/* <div className="circle-animation"></div> */}
        </div>
        <button
          className="flex items-center justify-center bg-white shadow-lg rounded-full py-4 mt-16"
          onClick={() => router.push("/report")}>
          <span className="text-center font-semibold px-16">Report Driver</span>
        </button>
      </div>
      <div className="w-full h-[30svh] flex flex-col justify-center items-center sm:gap-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="flex items-center justify-center bg-white shadow-lg rounded-full py-2.5 sm:py-3 text-center text-sm font-semibold px-20 sm:w-[50%]"
            onClick={() => router.push("/admin/signin")}>
            Signin as Admin/Personnel
          </button>
          <button
            className="flex items-center justify-center bg-white shadow-lg rounded-full py-2.5 sm:py-3 text-center text-sm font-semibold px-20 sm:w-[50%]"
            onClick={() => router.push("/passenger/signin")}>
            Signin as Passenger
          </button>
        </div>
        <button
          className="flex items-center justify-center py-3 text-center text-white text-xs"
          onClick={() => router.push("/passenger/signup")}>
          Create Passenger Account
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
