"use client";

import { useState } from "react";
import { LoadingScreenSection } from "../LoadingScreen";
import { useRouter } from "next/navigation";
import { createNewUser } from "@/api/userListsData";
import Image from "next/image";

const SignupPassenger = () => {
  const [loading, setLoading] = useState(false);

  const [newLastName, setNewLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newBirthdate, setNewBirthdate] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [currentView, setCurrentView] = useState(1);

  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    setLoading(true);

    const newRecord = {
      last_name: newLastName,
      first_name: newFirstName,
      // gender: newGender,
      //   birth_date: "",
      //   address: "",
      phone_number: newPhoneNumber,
      email: newEmail,
      password: newPassword,
      role: "passenger",
    };

    try {
      await createNewUser(newEmail, newPassword, newRecord);

      router.push("/");

      setNewLastName("");
      setNewFirstName("");
      // setNewGender("");
      //   setNewBirthdate("");
      //   setNewAddress("");
      setNewPhoneNumber("");
      setNewEmail("");
      setNewPassword("");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(`error: ${error}`);
      //   alert(
      //     "Failed to create user: A user with this email address has already been registered."
      //   );
    }
  };

  return (
    <>
      <div className="min-h-[100svh] h-[100svh] flex flex-col  bg-sky-50 md:bg-sky-100">
        {loading && <LoadingScreenSection />}
        <div className="h-full flex flex-col items-center px-4 sm:px-6 lg:px-8 container mx-auto">
          <div className="md:pl-52 w-full mt-4">
            <button
              className="flex items-center gap-2"
              onClick={() => {
                setLoading(true);
                router.push("/");
              }}>
              <Image
                src="/logo.svg"
                alt="Traffico Logo"
                width={70}
                height={70}
              />
              <h1 className="text-2xl md:text-3xl font-semibold font-serif text-sky-700">
                Traffico
              </h1>
            </button>
          </div>
          <div className="max-w-md w-full space-y-8 mt-[10%] md:mt-[5%] self-center justify-center overflow-y-auto md:overflow-y-hidden pb-10 md:pb-0">
            <div className="md:border md:shadow-lg md:bg-white rounded-xl md:px-5 md:py-10">
              <div className="flex flex-col items-start">
                <h1 className="mt-2 text-center text-3xl text-sky-700">
                  Sign up
                </h1>
              </div>
              <div className="mt-5 space-y-6">
                <input type="hidden" name="remember" value="true" />
                <div className="flex flex-col rounded-md shadow-sm gap-3">
                  <div>
                    <label htmlFor="newFirstName" className="text-sm">
                      First Name
                    </label>
                    <input
                      id="newFirstName"
                      name="newFirstName"
                      type="newFirstName"
                      required
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-gray-50"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="newLastName" className="text-sm">
                      Last Name
                    </label>
                    <input
                      id="newLastName"
                      name="newLastName"
                      type="newLastName"
                      required
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-gray-50"
                      placeholder="Last Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPhoneNumber" className="text-sm">
                      Phone Number
                    </label>
                    <input
                      id="newPhoneNumber"
                      name="newPhoneNumber"
                      type="newPhoneNumber"
                      required
                      value={newPhoneNumber}
                      onChange={(e) => setNewPhoneNumber(e.target.value)}
                      className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-gray-50"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <label htmlFor="email-address" className="text-sm">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="newEmail"
                      type="newEmail"
                      autoComplete="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-gray-50"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="text-sm">
                      Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="newPassword"
                      autoComplete="current-password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-gray-50"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleSubmit()}
                    disabled={
                      !newLastName ||
                      !newFirstName ||
                      !newPhoneNumber ||
                      !newEmail ||
                      !newPassword ||
                      !emailRegex.test(newEmail)
                    }
                    className={`${
                      !newLastName ||
                      !newFirstName ||
                      !newPhoneNumber ||
                      !newEmail ||
                      !newPassword ||
                      !emailRegex.test(newEmail)
                        ? "bg-gray-700"
                        : "bg-sky-700"
                    } group relative w-full flex justify-center p-3 border border-transparent text-sm font-medium rounded-lg text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-700`}>
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPassenger;
