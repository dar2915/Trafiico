"use client";

import { UserContext } from "@/utils/UserContext";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { LoadingScreenSection } from "./LoadingScreen";
import { supabase } from "@/utils/supabase";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { fetchNotifications } from "@/api/notificationsData";
import {
  MdOutlineAnnouncement,
  MdOutlineNotificationsNone,
} from "react-icons/md";
import { generateMessage } from "@/functions/generateMessage";

const TopbarFloat = () => {
  const { userName, userId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRefNotif = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRefNotif.current &&
        !dropdownRefNotif.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const getNotifications = async () => {
      const response = await fetchNotifications(true);
      if (response) {
        setNotifications(response.data);
        // console.log(response.data);
      }
    };

    getNotifications();
  }, []);

  return (
    <div className="w-full flex flex-col gap-1 mt-3 px-1">
      {loading && <LoadingScreenSection />}

      {/* bg-[#171A20] */}
      <div className="rounded-full justify-between items-center gap-2 flex p-2">
        <div className="flex items-center justify-center font-bold gap-2 text-lg">
          <Image src="/logo.svg" alt="Traffico Logo" width={45} height={45} />
          <h2>Traffico</h2>
        </div>
        <div className="flex gap-2">
          <div
            className="relative flex items-center justify-center space-x-4 z-10"
            ref={dropdownRefNotif}>
            <button
              className="flex items-center text-2xl space-x-2"
              onClick={() => {
                setShowNotifications(!showNotifications);
              }}>
              <MdOutlineNotificationsNone />
            </button>
            {showNotifications && (
              <div
                className={`absolute top-full mt-2 bg-gray-600 opacity-95 text-gray-400 py-2 pr-8 md:pr-0 px-3 w-[18rem] md:w-96 h-60 -right-36 md:-left-56 rounded-lg z-40 flex flex-col`}>
                <div className="absolute w-3 h-3 bg-inherit transform rotate-45 left-[70%] md:left-3/4 -top-1.5 translate-x-[-620%]" />

                <div className="w-full py-3 px-2 text-md opacity-100 text-sky-300 flex flex-col gap-5 overflow-y-auto scrollbar-hide">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-sky-700 text-white rounded-full p-2 ">
                          <MdOutlineAnnouncement />
                        </div>
                        <div>
                          <h5 className="w-full whitespace-normal word-wrap">
                            {generateMessage(notification)}
                          </h5>
                          <h6 className="text-xs text-yellow-400">
                            {new Date(
                              `${notification.date}T${notification.time}`
                            ).toLocaleString()}
                          </h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className="relative flex items-center justify-center space-x-4 pr-5"
            ref={dropdownRef}>
            <button
              className="flex items-center text-2xl space-x-2"
              onClick={() => setShowLogout(!showLogout)}>
              <CgProfile />
              <h5 className="text-base md:text-xl">
                Hi,{" "}
                <span className="text-sky-700 font-semibold">
                  {userName.split(" ")[0]}
                </span>
              </h5>
            </button>
            {showLogout && (
              <div className="absolute top-full mt-2 bg-gray-600 text-gray-400 opacity-95 py-1 pl-3 pr-14 right-[0.20rem] rounded-lg z-40">
                <div className="absolute w-3 h-3 bg-inherit transform rotate-45 left-3/4 -top-1.5 translate-x-[-50%]" />
                <button
                  className="flex items-center text-lg space-x-2 text-sky-300 hover:text-purple-300 my-1"
                  onClick={() => {
                    setLoading(true);
                    supabase.auth.signOut();
                    localStorage.removeItem("name");
                    localStorage.removeItem("userId");
                    router.push("/");
                  }}>
                  <div className="bg-sky-700 text-white rounded-full p-2 ">
                    <IoLogOutOutline />
                  </div>

                  <h5 className="text-md">Logout</h5>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopbarFloat;
