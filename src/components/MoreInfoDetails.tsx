import {
  deleteReportViolations,
  fetchViolatorDetails,
  updateReportViolations,
} from "@/api/reportViolationsData";
import { useCallback, useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlinePublishedWithChanges,
} from "react-icons/md";
import { LoadingScreenSection } from "./LoadingScreen";
import { supabase } from "@/utils/supabase";

interface DriverProfile {
  first_name: string;
  id: number;
  last_name: string;
  license_num: string;
  middle_name: string;
}

interface VehicleOwnershipRecord {
  id: number;
  zone: number;
  lto_plate_num: string;
  date_registered: string;
}

interface OperatorProfile {
  VehicleOwnershipRecords: VehicleOwnershipRecord[];
  address: string;
  first_name: string;
  id: number;
  last_name: string;
  middle_name: string;
}

interface Application {
  DriverProfiles: DriverProfile;
  OperatorProfiles: OperatorProfile;
  body_num: string;
  franchise_status: string;
  id: number;
  operator_id: number;
}

interface RecordType {
  id: number;
  body_num: string;
  complain: string;
  date: string;
  time: string;
  Applications: Application;
  action_taken: string;
  complainant_contact_num: string | null;
  complainant_name: string | null;
  enforcer_id: number | null;
  passenger_id: number | null;
  route: string | null;
  violation: string;
}

interface MoreInfoDetailsProps {
  userType: any;
  record: any;
  setShowBottomBar: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleMoreDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const MoreInfoDetailsComponent: React.FC<MoreInfoDetailsProps> = ({
  userType,
  record,
  setShowBottomBar,
  setToggleMoreDetails,
}) => {
  // console.log("record here: ", record);

  const [violatorDetails, setViolatorDetails] = useState<number>(0);

  const memoizedFetchViolatorReports = useCallback(async () => {
    if (record?.body_num) {
      try {
        const response = await fetchViolatorDetails(record?.body_num);
        if (response?.error) {
          console.error(response.error);
        } else if (response?.data) {
          setViolatorDetails(response.data.length);
          // console.log("response:", response.data.length);
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      console.warn("record.body_num is not defined");
    }
  }, [record?.body_num]);

  useEffect(() => {
    memoizedFetchViolatorReports();
  }, [record?.body_num, memoizedFetchViolatorReports]);

  const handleExit = () => {
    // if (window.confirm("Are you sure you want to exit?")) {
    setShowBottomBar(true);
    setToggleMoreDetails(false);

    setToggleUpdateReportStatus(false);
    // }
  };

  const [toggleUpdateReportStatus, setToggleUpdateReportStatus] =
    useState(false);

  const [actionTakenUpdate, setActionTakenUpdate] = useState("");
  const [violationUpdate, setViolationUpdate] = useState("");

  const handleUpdateStatusReport = async (currentReportId: string) => {
    // console.log("currentReportId: ", currentReportId);
    setLoading(true);

    if (actionTakenUpdate === "penalty-imposed" && violationUpdate) {
      // console.log("penalty-imposed: ", violationUpdate);

      const updateData = {
        action_taken: actionTakenUpdate,
        violation: violationUpdate,
      };

      try {
        await updateReportViolations(currentReportId, updateData);
        setLoading(false);
      } catch (error) {
        console.error("Error updating data:", error);
        setLoading(false);
      }
    } else {
      // console.log("resolved: ", actionTakenUpdate);

      const updateData = {
        action_taken: actionTakenUpdate,
      };

      try {
        await updateReportViolations(currentReportId, updateData);
        setLoading(false);
      } catch (error) {
        console.error("Error updating data:", error);
        setLoading(false);
      }
    }

    setToggleUpdateReportStatus(false);
  };

  const [loading, setLoading] = useState(false);

  const handleDeleteViolation = async (currentReportId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this record?"
    );

    if (currentReportId && confirmDelete) {
      try {
        setLoading(true);
        await deleteReportViolations(currentReportId);

        handleExit();
        setLoading(false);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  return (
    <div className="z-0 flex flex-col gap-10 h-full overflow-y-auto">
      {loading && <LoadingScreenSection />}
      <div className="h-full w-full flex flex-col justify-between">
        <div className="flex justify-between items-center flex-col mx-5 h-full overflow-y-hidden sm:overflow-y-auto">
          <div className="w-full text-lg my-3 flex justify-between items-center">
            <button
              onClick={() => {
                handleExit();
              }}
              className="py-1 flex items-center gap-1">
              <IoChevronBack /> <span className="text-sm">back</span>
            </button>
            {userType === "enforcer" && (
              <div className="flex gap-3">
                {record?.action_taken === "pending" && (
                  <div className="flex gap-2">
                    {toggleUpdateReportStatus && (
                      <button
                        className={`${
                          actionTakenUpdate !== ""
                            ? "bg-green-700"
                            : "bg-gray-700"
                        } flex items-center gap-1 py-1 px-3 text-sm rounded-lg capitalize text-white`}
                        disabled={actionTakenUpdate === ""}
                        onClick={() => handleUpdateStatusReport(record.id)}>
                        <MdOutlinePublishedWithChanges />
                        Submit
                      </button>
                    )}
                    <button
                      className={`${
                        toggleUpdateReportStatus ? "bg-red-700" : "bg-sky-700 "
                      }  flex items-center gap-1 py-1 px-3 text-sm rounded-lg capitalize text-white`}
                      onClick={() => {
                        setToggleUpdateReportStatus(!toggleUpdateReportStatus);
                        if (toggleUpdateReportStatus) {
                          setActionTakenUpdate("");
                          setViolationUpdate("");
                        }
                      }}>
                      <MdOutlineEdit />
                      {!toggleUpdateReportStatus ? "Update Status" : "Cancel "}
                    </button>
                  </div>
                )}
                <button
                  className={`border-red-700 text-red-700 
                   border py-1 px-2 text-sm rounded-lg flex items-center gap-2`}
                  onClick={() => handleDeleteViolation(record.id)}>
                  <MdOutlineDelete />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
          <div className="w-full overflow-x-hidden rounded-t-lg rounded-b-lg h-full gap-3 flex flex-col mb-5">
            <div>
              {toggleUpdateReportStatus && (
                <div className="border-b-2 pb-5 border-sky-700">
                  <div
                    className={`${
                      actionTakenUpdate === "penalty-imposed" ? "mb-3" : "mb-0"
                    }`}>
                    <label htmlFor="actionTakenUpdate">
                      Action Taken <span className="text-red-700">*</span>
                    </label>
                    <select
                      name="actionTakenUpdate"
                      id="actionTakenUpdate"
                      value={actionTakenUpdate}
                      onChange={(e) => setActionTakenUpdate(e.target.value)}
                      className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                      <option value="">Select...</option>
                      <option value="penalty-imposed">Penalty Imposed</option>
                      <option value="resolved">Resolved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  {actionTakenUpdate === "penalty-imposed" && (
                    <div>
                      <label htmlFor="violationUpdate">
                        Type of Violation{" "}
                        <span className="text-red-700">*</span>
                      </label>
                      <select
                        name="violationUpdate"
                        id="violationUpdate"
                        value={violationUpdate}
                        onChange={(e) => setViolationUpdate(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                        <option value="">Select...</option>
                        <option value="first-offense">
                          1st Offense: Php300
                        </option>
                        <option value="second-offense">
                          2nd Offense: Php400
                        </option>
                        <option value="third-offense">
                          3rd Offense: Php500
                        </option>
                        <option value="cancel-permit">
                          Cancellation of Permit
                        </option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
            {record?.action_taken !== "pending" && (
              <div className="w-full flex border-b-2 pb-5 border-sky-700 gap-3">
                <div className="w-full">
                  <label htmlFor="actionTaken">Action Taken</label>
                  <input
                    type="text"
                    name="actionTaken"
                    id="actionTaken"
                    value={record?.action_taken}
                    disabled
                    // ${
                    //   record?.action_taken === "penalty-imposed"
                    //     ? "mb-3"
                    //     : "mb-0"
                    // }
                    className={`${
                      record?.action_taken === "pending"
                        ? "bg-yellow-200 text-yellow-700"
                        : record?.action_taken === "resolved"
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    } capitalize border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full`}
                  />
                </div>
                {record?.action_taken === "penalty-imposed" && (
                  <div className="w-full">
                    <label htmlFor="violation">Violation</label>
                    <input
                      type="text"
                      name="violation"
                      id="violation"
                      value={record?.violation}
                      disabled
                      className="bg-red-200 text-red-700 capitalize border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                    />
                  </div>
                )}
              </div>
            )}
            <button className="self-end py-1 px-2 bg-purple-700 text-white rounded-lg text-sm">
              {violatorDetails == 0 ? (
                "No Pending Violations"
              ) : (
                <div>
                  <span className="font-semibold">{violatorDetails}</span>{" "}
                  <span>Pending Violations</span>
                </div>
              )}
            </button>
            <div>
              <label htmlFor="currentBodyNum">Body Number</label>
              <input
                type="text"
                name="currentBodyNum"
                id="currentBodyNum"
                value={record?.body_num}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="currentDriver">Driver&apos;s Name</label>
              <input
                type="text"
                name="currentDriver"
                id="currentDriver"
                // value={`${
                //   record?.Applications?.DriverProfiles?.first_name || ""
                // } ${record?.Applications?.DriverProfiles?.middle_name || ""} ${
                //   record?.Applications?.DriverProfiles?.last_name || ""
                // }`}
                value={record?.driver_name}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="currentDriverLicenseNum">
                Driver&apos;s License No.
              </label>
              <input
                type="text"
                name="currentDriverLicenseNum"
                id="currentDriverLicenseNum"
                value={record?.driver_license_num}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="plate_num">Plate No.</label>
              <input
                type="text"
                name="plate_num"
                id="plate_num"
                // value={
                //   record?.Applications?.OperatorProfiles
                //     ?.VehicleOwnershipRecords[0]?.lto_plate_num
                // }
                value={record?.vehicle_plate_num}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="franchise_status">Franchise Status</label>
              <input
                type="text"
                name="franchise_status"
                id="franchise_status"
                value={record?.franchise_status}
                disabled
                className="capitalize border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="date_registered">Date Registered</label>
              <input
                type="text"
                name="date_registered"
                id="date_registered"
                value={new Date(
                  record?.vehicle_date_registered
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="tricycle_operator">Tricycle Operator</label>
              <input
                type="text"
                name="tricycle_operator"
                id="tricycle_operator"
                value={record?.operator_name}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="operator_address">Operator&apos;s Address</label>
              <input
                type="text"
                name="operator_address"
                id="operator_address"
                value={record?.operator_address}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div className="border-b-2 pt-5 border-sky-700" />
            {record?.complainant_name && (
              <>
                <div className="mt-3">
                  <label htmlFor="complainant_name">Complainant Name</label>
                  <input
                    type="text"
                    name="complainant_name"
                    id="complainant_name"
                    value={record?.complainant_name}
                    disabled
                    className="capitalize border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="complainant_contact_num">
                    Complainant Number
                  </label>
                  <input
                    type="text"
                    name="complainant_contact_num"
                    id="complainant_contact_num"
                    value={record?.complainant_contact_num}
                    disabled
                    className="capitalize border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                </div>
              </>
            )}
            {userType == "enforcer" && record?.passenger_name?.trim() && (
              <div>
                <label htmlFor="passenger_name">
                  Complainant Name (Registered)
                </label>
                <input
                  type="text"
                  name="passenger_name"
                  id="passenger_name"
                  value={record?.passenger_name}
                  disabled
                  className="capitalize border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-3 items-center">
              <label htmlFor="currentDate">Date</label>
              <label htmlFor="currentTime">Time</label>
              <input
                type="date"
                name="currentDate"
                id="currentDate"
                value={record?.date}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
              <input
                type="time"
                name="currentTime"
                id="currentTime"
                value={record?.time}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            {/* {userType === "enforcer" && (
                <div>
                  <label htmlFor="violation">Violation</label>
                  <select
                    name="violation"
                    id="violation"
                    // value={violation}
                    // onChange={(e) => setViolation(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-white">
                    <option value="">Select...</option>
                    <option value="first-offense">1st Offense: Php300</option>
                    <option value="second-offense">
                      2nd Offense: Php400
                    </option>
                    <option value="third-offense">3rd Offense: Php500</option>
                    <option value="cancel-permit">
                      Cancellation of Permit
                    </option>
                  </select>
                </div>
              )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoDetailsComponent;
