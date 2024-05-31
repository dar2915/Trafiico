"use client";

import { fetchReportViolations } from "@/api/reportViolationsData";
import { supabase } from "@/utils/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import MoreInfoDetailsComponent from "./MoreInfoDetails";
import { IoLogOutOutline } from "react-icons/io5";
import { UserContext } from "@/utils/UserContext";
import { LoadingScreenSection } from "./LoadingScreen";

const Reports = ({
  setShowBottomBar,
}: {
  setShowBottomBar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [currentView, setCurrentView] = useState("personal");
  const [records, setRecords] = useState<any[]>([]);
  const [toggleMoreDetails, setToggleMoreDetails] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any[]>([]);
  const router = useRouter();

  const { userName, userId, userRole } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const userType = pathname.includes("/passenger/")
    ? "passenger"
    : pathname.includes("/enforcer/")
    ? "enforcer"
    : null;

  useEffect(() => {
    if (userRole === "passenger") {
      setCurrentView("passenger");
    }
  }, [userRole]);

  useEffect(() => {
    setRecords([]);
  }, [currentView]);

  // useEffect(() => {
  //   if (records) {
  //     setLoading(false);
  //   } else {
  //     setLoading(true);
  //   }
  // }, [records]);

  const memoizedFetchReportViolations = useCallback(async () => {
    if (userRole && currentView && userId) {
      let reCurrentView;
      {
        userType === "passenger"
          ? (reCurrentView = "passenger")
          : (reCurrentView = currentView);
      }

      try {
        const response = await fetchReportViolations(
          reCurrentView,
          userId,
          userRole
        );

        // console.log("currentView:", currentView);
        // console.log("userRole:", userRole);
        if (response?.error) {
          console.error(response.error);
        } else {
          setRecords(response?.data || []);
          // console.log("response:", response?.data);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  }, [userRole, currentView, userId]);

  useEffect(() => {
    memoizedFetchReportViolations();

    const channel = supabase
      .channel(`realtime report validations enforcer`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ViewTricycleDriverViolationsAdmin",
          // filter: userRole !== "enforcer" ? `passenger_id.eq.${userId}` : "",
        },
        (payload) => {
          if (payload.new) {
            setRecords((prevRecord: any) => [
              payload.new as any,
              ...prevRecord,
            ]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ViewTricycleDriverViolationsAdmin",
          // filter:
          //   currentView === "personal" && userRole === "enforcer"
          //     ? `enforcer_id.eq.${userId}`
          //     : currentView === "passenger" && userRole === "passenger"
          //     ? `passenger_id.eq.${userId}`
          //     : "",
        },
        (payload) => {
          if (payload.new) {
            setRecords((prevRecord: any) =>
              prevRecord.map((record: any) =>
                record.id === payload.new.id
                  ? { ...record, ...payload.new }
                  : record
              )
            );
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "ViewTricycleDriverViolationsAdmin",
          // filter:
          //   currentView === "personal" && userRole === "enforcer"
          //     ? `enforcer_id.eq.${userId}`
          //     : currentView === "passenger" && userRole === "passenger"
          //     ? `passenger_id.eq.${userId}`
          //     : "",
        },
        (payload) => {
          if (payload.old) {
            setRecords((prevRecords: any[]) =>
              prevRecords.filter((record) => record.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userRole, currentView, userId, memoizedFetchReportViolations]);

  const headerNamesEnforcer = [
    "Body No.",
    "Name",
    // "Driver's License",
    // "Plate No.",
    // "Body Color",
    // "Assigned Route",
    // "Franchise No.",
    // "Date Registered",
    "Complain",
    "Action Taken",
    // "Tricycle Owner",
    // "Address Operator",
  ];

  return (
    <div className="flex flex-col items-center select-none overflow-y-hidden h-full p-3 gap-5 overflow-hidden">
      {loading && <LoadingScreenSection />}
      {userType === "enforcer" && (
        <div className="w-full flex gap-3">
          <button
            className={`${
              currentView === "personal"
                ? "bg-gray-300 font-semibold text-sky-700"
                : "bg-gray-200"
            } w-1/2 rounded-full py-2 px-3 text-sm`}
            onClick={() => {
              setCurrentView("personal");
              setShowBottomBar(true);
              setToggleMoreDetails(false);
            }}>
            Personal Reports
          </button>
          <button
            className={`${
              currentView === "passenger"
                ? "bg-gray-300 font-semibold text-sky-700"
                : "bg-gray-200"
            } w-1/2 rounded-full py-2 px-3 text-sm`}
            onClick={() => {
              setCurrentView("passenger");
              setShowBottomBar(true);
              setToggleMoreDetails(false);
            }}>
            Passenger Reports
          </button>
        </div>
      )}
      {/* <div className="w-full h-[20rem] flex justify-start rounded-t-3xl bg-red-500 overflow-x-auto border border-blue-500"> */}
      <div className="w-full overflow-x-auto sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-full border border-sky-700">
        {/* && currentView === "personal" */}
        {!toggleMoreDetails && (
          <>
            <table className="w-full text-sm text-center">
              <thead className="text-xs uppercase bg-sky-700 text-white py-2">
                <tr>
                  {headerNamesEnforcer.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b border-sky-700 hover:bg-sky-100"
                    onClick={() => {
                      setCurrentRecord(record);
                      setShowBottomBar(false);
                      setToggleMoreDetails(true);
                    }}>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {record.body_num}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {record.driver_name}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {record.complain}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <button
                        className={`py-2 px-5 text-sm rounded-lg capitalize ${
                          record.action_taken === "pending"
                            ? "bg-yellow-200 text-yellow-700"
                            : record.action_taken === "resolved"
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}>
                        {record.action_taken}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {toggleMoreDetails && (
          <MoreInfoDetailsComponent
            userType={userType}
            record={currentRecord}
            setShowBottomBar={setShowBottomBar}
            setToggleMoreDetails={setToggleMoreDetails}
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
