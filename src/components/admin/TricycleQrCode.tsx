"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import QRCode from "qrcode.react";
import { supabase } from "@/utils/supabase";
import { fetchApplicationData } from "@/api/applicationsData";
import { routes } from "@/api/dataValues";
import ImageUploader from "./ImageUploader";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoPrint } from "react-icons/io5";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const printQr = (currentBodyNum: any) => {
  const id = "qr-print";
  const pdf = new jsPDF("p", "pt", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const input = document.getElementById(id);
  if (input === null) return;
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 400;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    for (let i = 0; i < 6; i++) {
      pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
      if (i < 5) {
        pdf.addPage();
      }
    }

    pdf.save(`${currentBodyNum}-qr.pdf`);
  });
};

const TricycleQrCode = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentDetailsPage, setCurrentDetailsPage] = useState(1);
  const [records, setRecords] = useState<any[]>([]);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const [selectedOption, setSelectedOption] = useState("bodyNum");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const memoizedFetchApplicationData = useCallback(async () => {
    try {
      const response = await fetchApplicationData(searchValue,startDate,endDate);
      if (response?.error) {
        console.error(response.error);
      } else {
        setRecords(response?.data || []);
        setNumOfEntries(response?.count || 1);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [searchValue, selectedOption]);

  useEffect(() => {
    memoizedFetchApplicationData();

    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Applications",
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
          table: "Applications",
        },
        (payload) => {
          if (payload.new) {
            setRecords((prevRecord: any) =>
              prevRecord.map((record: any) =>
                record.app_id === payload.new.id ? payload.new : record
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
          table: "Applications",
        },
        (payload) => {
          if (payload.old) {
            setRecords((prevRecord: any) =>
              prevRecord.filter(
                (record: any) => record.app_id !== payload.old.id
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchValue, selectedOption]);

  const [currentBodyNum, setCurrentBodyNum] = useState("");
  const [currentApplicationDate, setCurrentApplicationDate] = useState("");
  const [currentOperator, setCurrentOperator] = useState("");
  const [currentDriver, setCurrentDriver] = useState("");
  const [currentPlateNum, setCurrentPlateNum] = useState("");
  const [currentDriverLicenseNum, setCurrentDriverLicenseNum] = useState("");
  const [currentFranchiseNum, setCurrentFranchiseNum] = useState("");
  const [currentFranchiseExpiration, setCurrentFranchiseExpiration] =
    useState("");
  const [currentZone, setCurrentZone] = useState("");
  const [currentRoute, setCurrentRoute] = useState("");
  const [currentFareRate, setCurrentFareRate] = useState<number[]>([]);

  const handleViewMoreDetailsPage = (bodyNum: string) => {
    const record = records.find((record) => record.body_num === bodyNum);

    // console.log("record", record);
    // console.log(
    //   "record",
    //   record.OperatorProfiles.VehicleOwnershipRecords.body_num
    // );

    // record.OperatorProfiles.VehicleOwnershipRecords.forEach(
    //   (vehicleRecord: { body_num: any; lto_plate_num: any }) => {
    //     if (
    //       record.bodyNum ===
    //       record.OperatorProfiles.VehicleOwnershipRecords.body_num
    //     ) {
    //       console.log("record", vehicleRecord.lto_plate_num);
    //     }
    //   }
    // );
    // console.log("record", record.DriverProfiles.last_name);

    if (record) {
      setCurrentBodyNum(record.body_num);
      setCurrentApplicationDate(record.application_date);
      setCurrentOperator(record.operator_name);
      setCurrentDriver(record.driver_name);
      setCurrentPlateNum(record.lto_plate_num);
      setCurrentDriverLicenseNum(record.driver_license_num);
      setCurrentFranchiseNum(record.franchise_num);
      setCurrentFranchiseExpiration(record.insurance_expiry_date);
      setCurrentZone(record.zone);

      const matchingRoute = routes.find((route) => route.zone === record.zone);

      if (matchingRoute) {
        setCurrentRoute(matchingRoute.route);
        setCurrentFareRate([matchingRoute.adult, matchingRoute.student]);
      }

      const STORAGE_BUCKET_OPERATOR_VEHICLES = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/operators/vehicles/`;

      setFrontViewPreview(
        `${STORAGE_BUCKET_OPERATOR_VEHICLES}${record.front_view_image}`
      );
      setLeftSideViewPreview(
        `${STORAGE_BUCKET_OPERATOR_VEHICLES}${record.left_side_view_image}`
      );
      setRightSideViewPreview(
        `${STORAGE_BUCKET_OPERATOR_VEHICLES}${record.right_side_view_image}`
      );
      setInsideFrontViewPreview(
        `${STORAGE_BUCKET_OPERATOR_VEHICLES}${record.inside_front_image}`
      );
      setBackViewPreview(
        `${STORAGE_BUCKET_OPERATOR_VEHICLES}${record.back_view_image}`
      );

      setCurrentDetailsPage(2);
    }
  };

  const [frontView, setFrontView] = useState<File | null>(null);
  const [frontViewPreview, setFrontViewPreview] = useState<string | null>(null);
  const [leftSideView, setLeftSideView] = useState<File | null>(null);
  const [leftSideViewPreview, setLeftSideViewPreview] = useState<string | null>(
    null
  );
  const [rightSideView, setRightSideView] = useState<File | null>(null);
  const [rightSideViewPreview, setRightSideViewPreview] = useState<
    string | null
  >(null);
  const [insideFrontView, setInsideFrontView] = useState<File | null>(null);
  const [insideFrontViewPreview, setInsideFrontViewPreview] = useState<
    string | null
  >(null);
  const [backView, setBackView] = useState<File | null>(null);
  const [backViewPreview, setBackViewPreview] = useState<string | null>(null);

  const [showQrModal, setQrModal] = useState(false);

  return (
    <div className="z-0 flex flex-col gap-10 h-full">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div className="flex gap-5 items-center">
          <h1 className="flex font-bold text-3xl text-sky-700 ">
            List of Generated QR Code
          </h1>
        </div>
        {currentDetailsPage === 1 && (
          <div className="flex gap-2">
            <div className="relative">
              <MdOutlineSearch className="z-0 absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2 text-2xl" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setCurrentDetailsPage(1);
                }}
                placeholder="Search"
                className="w-full border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg pl-3 pr-10 py-2"
              />
            </div>
            <select
              name="searchOption"
              id="searchOption"
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg py-2 text-sm"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}>
              <option value="bodyNum">Body Number</option>
              <option value="driver">Driver</option>
              <option value="operator">Operator</option>
            </select>
          </div>
        )}
      </div>
      <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-full sm:h-[78dvh] border border-sky-700 ">
        <h1 className="px-3 py-2 sm:px-4 border-b border-sky-700">
          {currentDetailsPage === 1 ? "QR Code Details" : "More Details"}
        </h1>
        {showQrModal && (
          <div
            className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black`}>
            <div
              className={`rounded-2xl bg-white text-black mx-3 p-4 gap-4 flex flex-col`}>
              <div className="no-print flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Assigned QR CODE
                </h3>
                <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-right flex gap-3">
                  <button
                    onClick={() => printQr(currentBodyNum)}
                    className="flex items-center gap-1 ">
                    Print
                    <span className="text-2xl">
                      <IoPrint />
                    </span>
                  </button>
                  <button
                    className="text-2xl flex items-center justify-center"
                    onClick={() => setQrModal(false)}>
                    <IoMdCloseCircleOutline />
                  </button>
                </div>
              </div>
              <div className="print-border flex flex-col rounded-lg border border-sky-700 py-3 px-5 gap-3 items-center">
                <div id="qr-print" className="flex justify-center">
                  <QRCode value={currentBodyNum} size={400} />
                </div>
              </div>
              <div className="no-print w-full flex gap-4">
                <button
                  className="w-full border-sky-700 text-sky-700 border py-2 px-4 text-sm rounded-lg"
                  onClick={() => setQrModal(false)}>
                  Close
                </button>
                {/* <button
                  className={`w-full border-sky-700 bg-sky-700 text-white border py-2 px-4 text-sm rounded-lg`}
                  onClick={() => {
                    //  router.push("/admin/dashboard/tricycle-qr");
                    setQrModal(false);
                  }}>
                  OK
                </button> */}
              </div>
            </div>
          </div>
        )}
        {currentDetailsPage === 1 ? (
          <div className="grid sm:grid-cols-3 items-start content-start pt-7 px-5 pb-20 gap-5 overflow-y-auto w-full h-full">
            {records.map((record, index) => (
              <Card
                key={index}
                bodyNum={record.body_num}
                operator={record.operator_name}
                driver={record.driver_name}
                handleViewMoreDetailsPage={handleViewMoreDetailsPage}
                qrBg={true}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="grid grid-cols-4 gap-5 pt-5 px-5">
              <ImageUploader
                isDisabled={true}
                title="Left Side View"
                setImage={setLeftSideView}
                setPreview={setLeftSideViewPreview}
                preview={leftSideViewPreview}
              />
              <ImageUploader
                isDisabled={true}
                title="Right Side View"
                setImage={setRightSideView}
                setPreview={setRightSideViewPreview}
                preview={rightSideViewPreview}
              />
              <ImageUploader
                isDisabled={true}
                title="Front View"
                setImage={setFrontView}
                setPreview={setFrontViewPreview}
                preview={frontViewPreview}
              />
              <ImageUploader
                isDisabled={true}
                title="Back View"
                setImage={setBackView}
                setPreview={setBackViewPreview}
                preview={backViewPreview}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start content-start pt-7 px-5 pb-20 gap-5 overflow-y-auto w-full h-[70dvh]]">
              <div className="h-full flex flex-col items-center justify-around gap-3">
                <h3>Assigned QR CODE</h3>
                <button onClick={() => setQrModal(true)}>
                  <QRCode value={currentBodyNum} size={300} />
                </button>
              </div>
              <div
                className="grid grid-cols-2 gap-3 items-center"
                style={{ gridTemplateColumns: "auto 1fr" }}>
                <label htmlFor="currentApplicationDate">Date Registered</label>
                <input
                  type="date"
                  name="currentApplicationDate"
                  id="currentApplicationDate"
                  value={
                    currentApplicationDate
                      ? new Date(currentApplicationDate)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700"
                />
                <label htmlFor="currentOperator">Operator&lsquo;s Name</label>
                <input
                  type="text"
                  name="currentOperator"
                  id="currentOperator"
                  value={currentOperator}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700"
                />
                <label htmlFor="currentPlateNum">Plate Number</label>
                <input
                  type="text"
                  name="currentPlateNum"
                  id="currentPlateNum"
                  value={currentPlateNum}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700"
                />
                <label htmlFor="currentDriver">Driver&lsquo;s Name</label>
                <input
                  type="text"
                  name="currentDriver"
                  id="currentDriver"
                  value={currentDriver}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700"
                />
                <label htmlFor="currentDriverLicenseNum">
                  Driver&lsquo;s License No.
                </label>
                <input
                  type="text"
                  name="currentDriverLicenseNum"
                  id="currentDriverLicenseNum"
                  value={currentDriverLicenseNum}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700"
                />
                <label htmlFor="currentFranchiseNum">Franchise No.</label>
                <input
                  type="text"
                  name="currentFranchiseNum"
                  id="currentFranchiseNum"
                  value={currentFranchiseNum}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700"
                />
                <label htmlFor="currentFranchiseExpiration">Expiry Date</label>
                <input
                  type="date"
                  name="currentFranchiseExpiration"
                  id="currentFranchiseExpiration"
                  value={
                    currentFranchiseExpiration
                      ? new Date(currentFranchiseExpiration)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700"
                />
              </div>

              <div
                className="grid grid-cols-2 gap-3 items-center"
                style={{ gridTemplateColumns: "auto 1fr" }}>
                <label htmlFor="currentBodyNum">Body No.</label>
                <input
                  type="text"
                  name="currentBodyNum"
                  id="currentBodyNum"
                  value={currentBodyNum}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700"
                />
                <label htmlFor="currentZone">Zone</label>
                <input
                  type="text"
                  name="currentZone"
                  id="currentZone"
                  value={currentZone}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700"
                />
                <label htmlFor="currentRoute">Route</label>
                <textarea
                  name="currentRoute"
                  id="currentRoute"
                  value={currentRoute}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700 resize-none"
                  style={{ whiteSpace: "pre-wrap" }}
                />
                <label htmlFor="currentFareRate">Fare Rate</label>
                <div className="flex flex-col gap-3">
                  <div className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700 resize-none">
                    Student / Senior Citizen / PWD / Solo Parent:{" "}
                    <span className="font-semibold">{currentFareRate[0]}</span>
                  </div>
                  <div className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-gray-100 text-sky-700 resize-none">
                    Adult:{" "}
                    <span className="font-semibold">{currentFareRate[1]}</span>
                  </div>
                </div>
                <div className="w-full col-span-2 text-end mt-3">
                  <button
                    className={`bg-sky-700 border-sky-700 text-white border py-2 px-4 text-sm rounded-lg`}
                    onClick={() => {
                      setCurrentDetailsPage(1);

                      setCurrentBodyNum("");
                      setCurrentApplicationDate("");
                      setCurrentOperator("");
                      setCurrentDriver("");
                      setCurrentPlateNum("");
                      setCurrentDriverLicenseNum("");
                      setCurrentFranchiseNum("");
                      setCurrentFranchiseExpiration("");
                      setCurrentZone("");
                      setCurrentRoute("");
                      setCurrentFareRate([]);

                      setFrontView(null);
                      setFrontViewPreview(null);
                      setLeftSideView(null);
                      setLeftSideViewPreview(null);
                      setRightSideView(null);
                      setRightSideViewPreview(null);
                      setInsideFrontView(null);
                      setInsideFrontViewPreview(null);
                      setBackView(null);
                      setBackViewPreview(null);
                    }}>
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TricycleQrCode;

interface CardProps {
  bodyNum: string;
  operator: string;
  driver: string;
  handleViewMoreDetailsPage: (bodyNum: string) => void;
  qrBg?: boolean;
}

const Card: React.FC<CardProps> = ({
  bodyNum,
  operator,
  driver,
  handleViewMoreDetailsPage,
  qrBg = false,
}) => {
  return (
    <>
      <div
        className="bg-white rounded-lg drop-shadow-xl border border-gray-200 p-3 grid grid-cols-2 items-center gap-y-5 gap-x-2"
        style={{ gridTemplateColumns: "1fr 2fr" }}>
        <div
          className={`flex justify-center ${
            qrBg && "p-3 bg-gray-200 rounded-lg"
          }`}>
          <QRCode value={bodyNum} size={100} />
        </div>
        <div className="flex flex-col gap-2 justify-between text-sm ">
          <h1 className="font-bold text-xl">{bodyNum}</h1>
          <h3>
            <span className="text-sky-700 font-semibold">Operator:</span>{" "}
            {operator}
          </h3>
          <h3>
            {" "}
            <span className="text-sky-700 font-semibold">Driver:</span> {driver}
          </h3>
          <button
            className="rounded-lg bg-sky-700 text-white w-full py-1"
            onClick={() => handleViewMoreDetailsPage(bodyNum)}>
            View
          </button>
        </div>
      </div>
    </>
  );
};
