"use client";

import { supabase, supabaseAdmin } from "@/utils/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoadingScreenSection } from "./LoadingScreen";
import { IoLogOutOutline } from "react-icons/io5";
import { UserContext } from "@/utils/UserContext";
import { editPersonnalData } from "@/api/userListsData";

const SettingsComponent = () => {
  const { userName, userId, userRole } = useContext(UserContext);

  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const userType = pathname.includes("/admin/")
    ? "admin"
    : pathname.includes("/personnel/")
    ? "personnel"
    : null;

  const [toggleEditEmail, setToggleEditEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // const handleEditEvent = (type: string) => {
  //   if (type === "email") {
  //     setCurrentEmail(email);
  //     setToggleEditEmail(false);
  //   }
  // };

  const memoizedFetchUserData = useCallback(async () => {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
    } else if (data) {
      const userEmail = data.user.email;
      if (userEmail) {
        setEmail(userEmail);
        setCurrentEmail(userEmail);
      }
    }
  }, []);

  useEffect(() => {
    memoizedFetchUserData();
  }, []);

  const handleEditEvent = async (editType: string) => {
    setLoading(true);

    if (editType === "email") {
      const { data: user, error } =
        await supabaseAdmin.auth.admin.updateUserById(userId, { email: email });

      if (!error) {
        const updatedEmail = {
          email: email,
        };

        await editPersonnalData(userId, updatedEmail);

        setToggleEditEmail(false);
        setCurrentEmail(email);
        setLoading(false);
        alert("Successfully updated user email");
        return;
      }

      console.error("Error updating user email:", error);
      setLoading(false);
    } else if (editType === "password") {
      const { data: user, error } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: newPassword,
        });

      if (!error) {
        const updatedPassword = {
          password: newPassword,
        };

        await editPersonnalData(userId, updatedPassword);
        setNewPassword("");
        setConfirmNewPassword("");
        setLoading(false);
        alert("Successfully updated user password");
        return;
      }
      console.error("Error updating user password:", error);
      setLoading(false);
    }
  };

  return (
    <div className="z-0 flex flex-col gap-10 h-full w-full">
      {loading && <LoadingScreenSection />}
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div className="flex gap-5 items-center">
          <h1 className="flex font-bold text-3xl text-sky-700 ">Settings</h1>
        </div>
        {/* <div className="flex flex-col gap-5"></div> */}
      </div>
      <div className="flex flex-col gap-5">
        <div
          className="flex flex-col gap-3 md:grid md:grid-cols-2 items-center pt-7 pb-20 sm:mx-40 lg:gap-x-96 sm:gap-y-6 overflow-y-auto"
          // style={{ gridTemplateColumns: "auto 1fr" }}
        >
          {/* <div
            className={`${
              userType === "admin"
                ? "border-b-2 border-blue-700 justify-end"
                : "justify-between"
            } w-full col-span-2 flex items-center  pb-6 `}>
            {userType !== "admin" && <h4>Sign-out</h4>}
            <button
              onClick={() => {
                setLoading(true);
                supabase.auth.signOut();
                localStorage.removeItem("name");
                localStorage.removeItem("userId");
                // setLoading(false)
                router.push("/");
              }}
              className={`bg-red-700 flex rounded-lg px-3 py-2 text-white text-lg p-2 gap-3 items-center`}>
              <IoLogOutOutline />
              <h5 className="text-sm">Logout</h5>
            </button>
          </div> */}
          {userType === "admin" && (
            <>
              <label htmlFor="email" className="self-start">
                Email Address
              </label>
              <div className="w-full flex gap-2">
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={toggleEditEmail ? email : currentEmail}
                  disabled={!toggleEditEmail}
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-green-700 focus:outline-none focus:ring-green-700 focus:border-green-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <button
                  className={`${
                    toggleEditEmail ? "text-black" : "text-gray-600"
                  } text-xs`}
                  onClick={() => {
                    setToggleEditEmail(!toggleEditEmail);
                    setEmail(currentEmail);
                  }}>
                  {toggleEditEmail ? "Cancel" : "Edit"}
                </button>
              </div>
              <div className="w-full col-span-2 flex justify-end">
                <button
                  onClick={() => handleEditEvent("email")}
                  disabled={
                    !toggleEditEmail ||
                    email === currentEmail ||
                    email.length <= 8
                  }
                  className={`${
                    toggleEditEmail &&
                    email !== currentEmail &&
                    email.length >= 8
                      ? "bg-red-700"
                      : "bg-gray-700"
                  } flex rounded-lg px-3 py-2 text-white`}>
                  Change Email
                </button>
              </div>
              <label htmlFor="newPassword" className="self-start">
                New Password
              </label>
              <input
                type="text"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-green-700 focus:outline-none focus:ring-green-700 focus:border-green-700 focus:z-10 rounded-lg p-2 w-full"
              />
              <label htmlFor="confirmNewPassword" className="self-start">
                Confirm New Password
              </label>
              <input
                type="text"
                name="confirmNewPassword"
                id="confirmNewPassword"
                value={confirmNewPassword}
                placeholder="Confirm New Password"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="border border-green-700 focus:outline-none focus:ring-green-700 focus:border-green-700 focus:z-10 rounded-lg p-2 w-full"
              />
              <div className="w-full col-span-2 flex justify-end">
                <button
                  onClick={() => handleEditEvent("password")}
                  disabled={email.length <= 8}
                  className={`${
                    newPassword &&
                    confirmNewPassword &&
                    newPassword.length >= 8 &&
                    newPassword === confirmNewPassword
                      ? "bg-red-700"
                      : "bg-gray-700"
                  } flex rounded-lg px-3 py-2 text-white`}>
                  Change Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
