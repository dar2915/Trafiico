"use client";

import { insuranceOptions, routes } from "@/api/dataValues";
import { fetchDriverProfileByName } from "@/api/driverProfilesData";
import {
  fetchOperatorUniqueBodyNum,
  fetchTotalOperatorInCurrentYear,
} from "@/api/operatorProfilesData";
import { fetchVehicleOwnershipReportById } from "@/api/vehicleOwnership";
import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import ImageUploader from "./ImageUploader";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  checkFranchiseNumber,
  insertApplicationData,
} from "@/api/applicationsData";
import { insertPaymentData } from "@/api/paymentsData";
import { supabase } from "@/utils/supabase";
import { insertRequirementDocumentData } from "@/api/requirementsData";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { RotatingLines } from "react-loader-spinner";
import { LoadingScreenSection } from "../LoadingScreen";

const Application = () => {
  const [applicationCurrentPage, setApplicationCurrentPage] = useState(1);
  const pageTitles: { [key: number]: string } = {
    1: "Application Information",
    2: "Payment (Official Receipt)",
    3: "Document Requirements",
  };

  const [newApplicationDate, setNewApplicationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newFranchiseNumber, setNewFranchiseNumber] = useState("");
  const [newFranchiseStatus, setNewFranchiseStatus] = useState("new");
  const [newSelectedOperator, setNewSelectedOperator] = useState<{
    value: any;
    label: string;
  } | null>(null);
  const [newBodyNumber, setNewBodyNumber] = useState("");
  const [newSelectedDriver, setNewSelectedDriver] = useState<{
    value: any;
    label: string;
  } | null>(null);
  type OptionType = {
    value: number;
    label: string;
  };

  const [newZone, setNewZone] = useState<OptionType | null>(null);
  const [newSelectedRoute, setNewSelectedRoute] = useState("");
  const [newSelectedRouteObj, setNewSelectedRouteObj] = useState<{
    zone: number;
    route: string;
    adult: number;
    student: number;
    sp: number;
  } | null>(null);

  const zoneOptions = routes.map((route) => ({
    value: route.zone,
    label: `Zone ${route.zone}`,
  }));

  const [newInsuranceCompany, setNewInsuranceCompany] = useState("");
  const [newInsuranceCocNumber, setNewInsuranceCocNumber] = useState("");
  const [newInsuranceExpiryDate, setNewInsuranceExpiryDate] = useState("");
  const [newProvicionalAuthExpiryDate, setNewProvicionalAuthExpiryDate] =
    useState("");
  const [newOperatorFaceImage, setNewOperatorFaceImage] = useState<File | null>(
    null
  );
  const [newOperatorFacePreview, setNewOperatorFacePreview] = useState<
    string | null
  >(null);
  const [newOperatorSignatureImage, setNewOperatorSignatureImage] =
    useState<File | null>(null);
  const [newOperatorSignaturePreview, setNewOperatorSignaturePreview] =
    useState<string | null>(null);

  const [newDriverFaceImage, setNewDriverFaceImage] = useState<File | null>(
    null
  );
  const [newDriverFacePreview, setNewDriverFacePreview] = useState<
    string | null
  >(null);
  const [newDriveSignatureImage, setNewDriverSignatureImage] =
    useState<File | null>(null);
  const [newDriverSignaturePreview, setNewDriverSignaturePreview] = useState<
    string | null
  >(null);

  const [operators, setOperators] = useState<{ value: any; label: string }[]>(
    []
  );
  const [drivers, setDrivers] = useState<{ value: any; label: string }[]>([]);

  const [recordVehicles, setRecordVehicles] = useState<any[]>([]);

  const [totalOperators, setTotalOperators] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotal = async () => {
      const total = await fetchTotalOperatorInCurrentYear();
      setTotalOperators(total);
    };

    fetchTotal();

    const channel = supabase
      .channel("realtime:public")
      .on(
        "postgres_changes",
        {
          schema: "public",
          event: "*",
        },
        async (payload) => {
          if (payload.new) {
            const total = await fetchTotalOperatorInCurrentYear();
            setTotalOperators(total);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const memoizedFetchVehicleOwnershipReportByIDData = useCallback(async () => {
    try {
      const vehicleResponse = await fetchVehicleOwnershipReportById(
        newSelectedOperator?.value
      );
      const operatorResponse = await fetchOperatorUniqueBodyNum(
        newFranchiseStatus
      );

      if (vehicleResponse?.data && operatorResponse?.data) {
        const uniqueBodyNums = operatorResponse.data.map(
          (item) => item.body_num
        );
        const filteredVehicles = vehicleResponse.data.filter((vehicle) =>
          uniqueBodyNums.includes(vehicle.body_num)
        );

        setRecordVehicles(filteredVehicles);
      } else {
        setRecordVehicles([]);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [newSelectedOperator, newFranchiseStatus]);

  useEffect(() => {
    memoizedFetchVehicleOwnershipReportByIDData();
  }, [newSelectedOperator, newFranchiseStatus]);

  const STORAGE_BUCKET_OPERATOR_FACE_PHOTO_VIEW = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/operators/face_photo/`;
  const STORAGE_BUCKET_OPERATOR_SIGNATURE_VIEW = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/operators/signature_photo/`;

  const STORAGE_BUCKET_DRIVER_FACE_PHOTO_VIEW = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/drivers/face_photo/`;
  const STORAGE_BUCKET_DRIVER_SIGNATURE_VIEW = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/drivers/signature_photo/`;

  useEffect(() => {
    // console.log("selected operator", newSelectedOperator);
    if (newSelectedOperator) {
      setNewOperatorFacePreview(
        `${STORAGE_BUCKET_OPERATOR_FACE_PHOTO_VIEW}face_${newSelectedOperator?.value}.jpeg`
      );
      setNewOperatorSignaturePreview(
        `${STORAGE_BUCKET_OPERATOR_SIGNATURE_VIEW}signature_${newSelectedOperator?.value}.jpeg`
      );
    }
  }, [newSelectedOperator]);

  useEffect(() => {
    // console.log("selected driver", newSelectedDriver);
    if (newSelectedDriver) {
      setNewDriverFacePreview(
        `${STORAGE_BUCKET_DRIVER_FACE_PHOTO_VIEW}face_${newSelectedDriver?.value}.jpeg`
      );
      setNewDriverSignaturePreview(
        `${STORAGE_BUCKET_DRIVER_SIGNATURE_VIEW}signature_${newSelectedDriver?.value}.jpeg`
      );
    }
  }, [newSelectedDriver]);

  useEffect(() => {
    const fetchOperators = async () => {
      const response = await fetchOperatorUniqueBodyNum(newFranchiseStatus);
      if (response && response.data) {
        const uniqueOperators = response.data.reduce((unique, operator) => {
          if (!unique.find((op: any) => op.id === operator.id)) {
            unique.push(operator);
          }
          return unique;
        }, []);

        setOperators(
          uniqueOperators.map((operator: any) => ({
            value: operator.id,
            label:
              `${operator.last_name}, ${operator.first_name}` +
              (operator.middle_name
                ? " " + operator.middle_name.charAt(0) + "."
                : ""),
          }))
        );
      }
    };

    fetchOperators();
  }, [newFranchiseStatus]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const response = await fetchDriverProfileByName("");
      if (response && response.data) {
        setDrivers(
          response.data.map((driver) => ({
            value: driver.id,
            label:
              `${driver.last_name}, ${driver.first_name}` +
              (driver.middle_name
                ? " " + driver.middle_name.charAt(0) + "."
                : ""),
          }))
        );
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    // const random4Digits = Math.floor(1000 + Math.random() * 9000);
    // setNewFranchiseNumber(`MTOP-${year}-${random4Digits}`);
  }, []);

  useEffect(() => {
    const generateFranchiseNumber = async () => {
      const year = new Date().getFullYear();
      let exists = true;
      let random4Digits = "";

      while (exists) {
        random4Digits = Math.floor(1000 + Math.random() * 9000).toString();

        const response = await checkFranchiseNumber(random4Digits);
        exists = Boolean(response && response.data && response.data.length > 0);
      }

      setNewFranchiseNumber(`MTOP-${year}-${random4Digits}`);
    };

    generateFranchiseNumber();
  }, []);

  const [modalNewPaymentView, setModalNewPaymentView] = useState(false);
  const [newORNumber, setNewORNumber] = useState("");
  const [newORDate, setNewORDate] = useState("");
  const [newAmount, setNewAmount] = useState<number | null>(null);
  const [newScannedReceipt, setNewScannedReceipt] = useState<File | null>(null);

  const [payments, setPayments] = useState<
    Array<{
      orNumber: string;
      orDate: string;
      amount: number;
      scannedReceipt: File;
    }>
  >([]);

  const [newPayments, setNewPayments] = useState<
    Array<{
      orNumber: string;
      orDate: string;
      amount: number;
      scannedReceipt: File;
    }>
  >([]);

  const [newDocReq1, setNewDocReq1] = useState<File | null>(null);
  const [newDocReq2, setNewDocReq2] = useState<File | null>(null);
  const [newDocReq3, setNewDocReq3] = useState<File | null>(null);
  const [newDocReq4, setNewDocReq4] = useState<File | null>(null);
  const [newDocReq5, setNewDocReq5] = useState<File | null>(null);
  const [newDocReq6, setNewDocReq6] = useState<File | null>(null);
  const [newDocReq7, setNewDocReq7] = useState<File | null>(null);
  const [newDocReq8, setNewDocReq8] = useState<File | null>(null);
  const [newDocReq9, setNewDocReq9] = useState<File | null>(null);
  const [newDocReq10, setNewDocReq10] = useState<File | null>(null);
  const [newDocReq11, setNewDocReq11] = useState<File | null>(null);
  const [newDocReq12, setNewDocReq12] = useState<File | null>(null);
  const [newDocReq13, setNewDocReq13] = useState<File | null>(null);

  const documentDesc = [
    {
      number: 1,
      description: "Barangay Clearance",
      file: newDocReq1,
      setFile: setNewDocReq1,
    },
    {
      number: 2,
      description: "Barangay Certification",
      file: newDocReq2,
      setFile: setNewDocReq2,
    },
    {
      number: 3,
      description: "Picture of Side Car",
      file: newDocReq3,
      setFile: setNewDocReq3,
    },
    {
      number: 4,
      description: "Insurance TPL/PL",
      file: newDocReq4,
      setFile: setNewDocReq4,
    },
    {
      number: 5,
      description: "Xerox Copy Driver’s License",
      file: newDocReq5,
      setFile: setNewDocReq5,
    },
    {
      number: 6,
      description: "Stencil",
      file: newDocReq6,
      setFile: setNewDocReq6,
    },
    {
      number: 7,
      description: "MTOP Official Receipt",
      file: newDocReq7,
      setFile: setNewDocReq7,
    },
    {
      number: 8,
      description: "OR /CR Xerox Copy",
      file: newDocReq8,
      setFile: setNewDocReq8,
    },
    {
      number: 9,
      description: "Police Clearance",
      file: newDocReq9,
      setFile: setNewDocReq9,
    },
    {
      number: 10,
      description: "Medical Certificate (RHU)",
      file: newDocReq10,
      setFile: setNewDocReq10,
    },
    {
      number: 11,
      description: "Voter’s ID/ Voter’s Certificate",
      file: newDocReq11,
      setFile: setNewDocReq11,
    },
    {
      number: 12,
      description: "Certification of Road Worthiness  Inspection Form",
      file: newDocReq12,
      setFile: setNewDocReq12,
    },
    {
      number: 13,
      description: "Proof of Purchase of Side Card",
      file: newDocReq13,
      setFile: setNewDocReq13,
    },
  ];

  const [modalNewUploadDocument, setModalNewUploadDocument] = useState(false);

  const [modalViewUploadedDocument, setModalViewUploadedDocument] =
    useState(false);

  type DocReqType = {
    number: number;
    description: string;
    setFile: (file: any) => void;
  };

  type DocReqViewType = {
    number: number;
    description: string;
    setFile: (file: any) => void;
    file: File;
  };

  const [currentDocReq, setCurrentDocReq] = useState<DocReqType | null>(null);
  const [currentViewDocReq, setCurrentViewDocReq] =
    useState<DocReqViewType | null>(null);

  const [currentDateUploaded, setCurrentDateUploaded] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [currentFileUpload, setCurrentFileUpload] = useState<File | null>(null);

  const [changeFileUpload, setChangeFileUpload] = useState<File | null>(null);
  const [toChangeFile, setToChangeFile] = useState(false);

  const handleFileUpload = (
    number: number,
    description: string,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setCurrentDocReq({ number, description, setFile });
    setModalNewUploadDocument(true);
  };

  const handleViewFileUploaded = (
    number: number,
    description: string,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    file: File
  ) => {
    setCurrentViewDocReq({ number, description, setFile, file });
    setModalViewUploadedDocument(true);
  };

  const [modalExit, setModalExit] = useState(false);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmissionTricyclePermit = async () => {
    setLoading(true);

    const newApprovalRecord = {
      application_date: newApplicationDate,
      franchise_num: newFranchiseNumber,
      franchise_status: newFranchiseStatus,
      operator_id: Number(newSelectedOperator?.value) || null,
      body_num: newBodyNumber,
      driver_id: Number(newSelectedDriver?.value) || null,
      zone: Number(newZone?.value) || null,
      insurance_company: Number(newInsuranceCompany) || null,
      insurance_coc_num: newInsuranceCocNumber,
      insurance_expiry_date: newInsuranceExpiryDate,
      provisional_expiry_date: newProvicionalAuthExpiryDate,
    };

    const response = await insertApplicationData(newApprovalRecord);

    if (response?.error) {
      console.error("Error inserting new row data:", response.error);
    } else {
      // console.log("newPayments", newPayments);

      if (response && response.data) {
        for (const payment of newPayments) {
          const newPaymentRecord = {
            application_id: Number(response.data[0].id) || null,
            or_num: payment.orNumber,
            or_date: payment.orDate,
            amount: payment.amount,
            receipt:
              "receipt" + response.data[0].id + "_" + payment.orNumber + ".pdf",
          };
          const paymentResponse = await insertPaymentData(newPaymentRecord);

          const STORAGE_BUCKET_APPLICATION_RECEIPT =
            "assets/application/receipt";
          const UPLOAD_RECEIPT = `${response.data[0].id}_${payment.orNumber}.pdf`;

          await supabase.storage
            .from(STORAGE_BUCKET_APPLICATION_RECEIPT)
            .upload(UPLOAD_RECEIPT, payment.scannedReceipt);
        }

        if (
          newDocReq1 &&
          newDocReq2 &&
          newDocReq3 &&
          newDocReq4 &&
          newDocReq5 &&
          newDocReq6 &&
          newDocReq7 &&
          newDocReq8 &&
          newDocReq9 &&
          newDocReq10 &&
          newDocReq11 &&
          newDocReq11 &&
          newDocReq12 &&
          newDocReq13
        ) {
          const newDocsData = {
            application_id: Number(response.data[0].id) || null,
            doc_1_loc: response.data[0].id + "_doc1.pdf",
            doc_2_loc: response.data[0].id + "_doc2.pdf",
            doc_3_loc: response.data[0].id + "_doc3.pdf",
            doc_4_loc: response.data[0].id + "_doc4.pdf",
            doc_5_loc: response.data[0].id + "_doc5.pdf",
            doc_6_loc: response.data[0].id + "_doc6.pdf",
            doc_7_loc: response.data[0].id + "_doc7.pdf",
            doc_8_loc: response.data[0].id + "_doc8.pdf",
            doc_9_loc: response.data[0].id + "_doc9.pdf",
            doc_10_loc: response.data[0].id + "_doc10.pdf",
            doc_11_loc: response.data[0].id + "_doc11.pdf",
            doc_12_loc: response.data[0].id + "_doc12.pdf",
            doc_13_loc: response.data[0].id + "_doc13.pdf",
          };

          await insertRequirementDocumentData(newDocsData);

          const STORAGE_BUCKET_APPLICATION_REQUIREMENTS =
            "assets/application/requirements_documents";

          const DOC_1 = `${response.data[0].id}_doc1.pdf`;
          const DOC_2 = `${response.data[0].id}_doc2.pdf`;
          const DOC_3 = `${response.data[0].id}_doc3.pdf`;
          const DOC_4 = `${response.data[0].id}_doc4.pdf`;
          const DOC_5 = `${response.data[0].id}_doc5.pdf`;
          const DOC_6 = `${response.data[0].id}_doc6.pdf`;
          const DOC_7 = `${response.data[0].id}_doc7.pdf`;
          const DOC_8 = `${response.data[0].id}_doc8.pdf`;
          const DOC_9 = `${response.data[0].id}_doc9.pdf`;
          const DOC_10 = `${response.data[0].id}_doc10.pdf`;
          const DOC_11 = `${response.data[0].id}_doc11.pdf`;
          const DOC_12 = `${response.data[0].id}_doc12.pdf`;
          const DOC_13 = `${response.data[0].id}_doc13.pdf`;

          const documents = [
            { name: DOC_1, file: newDocReq1 },
            { name: DOC_2, file: newDocReq2 },
            { name: DOC_3, file: newDocReq3 },
            { name: DOC_4, file: newDocReq4 },
            { name: DOC_5, file: newDocReq5 },
            { name: DOC_6, file: newDocReq6 },
            { name: DOC_7, file: newDocReq7 },
            { name: DOC_8, file: newDocReq8 },
            { name: DOC_9, file: newDocReq9 },
            { name: DOC_10, file: newDocReq10 },
            { name: DOC_11, file: newDocReq11 },
            { name: DOC_12, file: newDocReq12 },
            { name: DOC_13, file: newDocReq13 },
          ];

          for (const doc of documents) {
            await supabase.storage
              .from(STORAGE_BUCKET_APPLICATION_REQUIREMENTS)
              .upload(doc.name, doc.file);
          }
        }
      }

      setModalExit(true);
      setLoading(false);

      setApplicationCurrentPage(1);
      setNewApplicationDate(new Date().toISOString().split("T")[0]);
      setNewFranchiseNumber("");
      setNewFranchiseStatus("new");
      setNewSelectedOperator(null);
      setNewSelectedDriver(null);
      setNewBodyNumber("");
      setNewZone(null);
      setNewSelectedRoute("");
      setNewSelectedRouteObj(null);
      setNewInsuranceCompany("");
      setNewInsuranceCocNumber("");
      setNewInsuranceExpiryDate("");
      setNewProvicionalAuthExpiryDate("");
      setNewOperatorFaceImage(null);
      setNewOperatorFacePreview(null);
      setNewOperatorSignatureImage(null);
      setNewOperatorSignaturePreview;
      setNewDriverFaceImage(null);
      setNewDriverFacePreview(null);
      setNewDriverSignatureImage(null);
      setNewDriverSignaturePreview(null);
      setNewORNumber("");
      setNewORDate("");
      setNewAmount(null);
      setNewScannedReceipt(null);
      setPayments([]);
      setNewPayments([]);
      setNewDocReq1(null);
      setNewDocReq2(null);
      setNewDocReq3(null);
      setNewDocReq4(null);
      setNewDocReq5(null);
      setNewDocReq6(null);
      setNewDocReq7(null);
      setNewDocReq8(null);
      setNewDocReq9(null);
      setNewDocReq10(null);
      setNewDocReq11(null);
      setNewDocReq12(null);
      setNewDocReq13(null);
      setCurrentFileUpload(null);
    }
  };

  useEffect(() => {
    if (recordVehicles.length > 0) {
      setNewBodyNumber(recordVehicles[0].body_num);
    }
  }, [recordVehicles]);

  // useEffect(() => {
  //   console.log("body number", newBodyNumber);
  // }, [newBodyNumber]);

  const pathname = usePathname();
  const userType = pathname.includes("/admin/")
    ? "admin"
    : pathname.includes("/personnel/")
    ? "personnel"
    : null;

  // const isDisabled = totalFranchiseNumber >= 1500;

  return (
    <div className="z-0 flex flex-col gap-10 h-full w-full">
      {loading && <LoadingScreenSection />}
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div className="flex gap-5 items-center">
          <h1 className="flex font-bold text-3xl text-sky-700 ">
            Application for Tricycle Operator&apos;s Permit
          </h1>
        </div>
      </div>
      <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-[70dvh] border border-sky-700">
        <div className="flex justify-between items-center border-b border-sky-700 px-3 py-2 sm:px-4">
          <h1>
            {applicationCurrentPage in pageTitles
              ? pageTitles[applicationCurrentPage]
              : ""}
          </h1>
          <div className="text-sm flex flex-col items-center">
            <div>
              <span className="font-semibold text-sky-700">
                {totalOperators}
              </span>
              <span> / 1500</span>
            </div>
            <span className="text-xs">
              Total FN ({new Date().getFullYear()})
            </span>
          </div>
        </div>
        {applicationCurrentPage === 1 && (
          <>
            <div
              className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
              style={{ gridTemplateColumns: "auto 1fr" }}>
              <label htmlFor="newApplicationDate">Application Date</label>
              <input
                type="date"
                name="newApplicationDate"
                id="newApplicationDate"
                value={newApplicationDate}
                placeholder="Application Date"
                onChange={(e) => setNewApplicationDate(e.target.value)}
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
              <label htmlFor="newFranchiseNumber">Franchise Number</label>
              <input
                type="text"
                name="newFranchiseNumber"
                id="newFranchiseNumber"
                value={newFranchiseNumber}
                disabled
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
              <label htmlFor="newFranchiseStatus">Franchise Status</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="newFranchiseStatus"
                  id="newFranchiseStatusNew"
                  value="new"
                  checked={newFranchiseStatus === "new"}
                  onChange={(e) => setNewFranchiseStatus(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                />
                <label htmlFor="newFranchiseStatusNew" className="mr-4">
                  New
                </label>
                <input
                  type="radio"
                  name="newFranchiseStatus"
                  id="newFranchiseStatusRenewal"
                  value="renewal"
                  checked={newFranchiseStatus === "renewal"}
                  onChange={(e) => setNewFranchiseStatus(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                />
                <label htmlFor="newFranchiseStatusRenewal">Renewal</label>
              </div>
              <label htmlFor="operatorID" className="mr-4">
                Operator&apos;s Name
              </label>
              <Select
                name="operatorID"
                id="operatorID"
                value={newSelectedOperator}
                onChange={(selectedOption) => {
                  setNewSelectedOperator(selectedOption);
                  // console.log("selectedOption", selectedOption);
                }}
                options={operators}
                className="basic-multi-select"
                classNamePrefix="select"
              />
              {newSelectedOperator && (
                <>
                  <label htmlFor="newBodyNumber">Body Number</label>
                  <select
                    name="newBodyNumber"
                    id="newBodyNumber"
                    value={newBodyNumber}
                    onChange={(e) => setNewBodyNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2">
                    {recordVehicles.map((vehicle, index) => (
                      <option key={index} value={vehicle.id}>
                        {vehicle.body_num}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <label htmlFor="driverID" className="mr-4">
                Driver&apos;s Name
              </label>
              <Select
                name="driverID"
                id="driverID"
                value={newSelectedDriver}
                onChange={(selectedOption) => {
                  setNewSelectedDriver(selectedOption);
                  // console.log("selectedOption", selectedOption);
                }}
                options={drivers}
                className="basic-multi-select"
                classNamePrefix="select"
              />
              <label htmlFor="newZoneID">Zone</label>
              <Select
                name="newZoneID"
                id="newZoneID"
                value={newZone}
                onChange={(selectedOption: OptionType | null) => {
                  if (selectedOption !== null) {
                    setNewZone(selectedOption);
                    const route = routes.find(
                      (route) => route.zone === selectedOption.value
                    );
                    setNewSelectedRoute(route ? route.route : "");
                    if (route) {
                      setNewSelectedRouteObj(route);
                    }
                  }
                }}
                options={zoneOptions}
                className="basic-multi-select"
                classNamePrefix="select"
              />
              {newZone && (
                <>
                  <label htmlFor="newSelectedRoute">Route</label>
                  <input
                    type="text"
                    id="route"
                    value={newSelectedRoute}
                    disabled
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  {newSelectedRouteObj && (
                    <>
                      <h1>Minimum Fare Rate</h1>
                      <div className="">
                        <table className="w-full text-sm">
                          <tbody>
                            <tr className="bg-white border border-sky-700">
                              <td className="w-1/2 pl-6 py-4 text-gray-900 border-r border-sky-700">
                                Student / Senior Citizen / PWD / Solo Parent
                              </td>
                              <td className="w-1/2 px-6 py-4 text-gray-900 whitespace-nowrap font-bold">
                                {newSelectedRouteObj.student}
                              </td>
                            </tr>
                            <tr className="bg-white border border-sky-700">
                              <td className="w-1/2 pl-6 py-4 text-gray-900 border-r border-sky-700">
                                Adult
                              </td>
                              <td className="w-1/2 px-6 py-4 text-gray-900 whitespace-nowrap font-bold">
                                {newSelectedRouteObj.adult}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
              )}
              <label htmlFor="insuranceID" className="mr-4">
                Insurance Company
              </label>
              <Select
                name="insuranceID"
                id="insuranceID"
                value={insuranceOptions.find(
                  (option) => option.value.toString() === newInsuranceCompany
                )}
                onChange={(selectedOption: OptionType | null) => {
                  if (selectedOption !== null) {
                    setNewInsuranceCompany(selectedOption.value.toString());
                  }
                }}
                options={insuranceOptions}
                className="basic-multi-select"
                classNamePrefix="select"
              />
              <label htmlFor="newInsuranceCocNumber" className="mr-4">
                Insurance COC Number
              </label>
              <input
                type="text"
                name="newInsuranceCocNumber"
                id="newInsuranceCocNumber"
                value={newInsuranceCocNumber}
                placeholder="Insurance COC Number"
                onChange={(e) => setNewInsuranceCocNumber(e.target.value)}
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
              <label htmlFor="newInsuranceExpiryDate">
                Insurance Expiry Date
              </label>
              <input
                type="date"
                name="newInsuranceExpiryDate"
                id="newInsuranceExpiryDate"
                value={newInsuranceExpiryDate}
                placeholder="Insurance Expiry Date"
                onChange={(e) => setNewInsuranceExpiryDate(e.target.value)}
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full mt-1 mb-3"
              />
              <label htmlFor="newProvicionalAuthExpiryDate">
                Provisional Authority Expires on
              </label>
              <input
                type="date"
                name="newProvicionalAuthExpiryDate"
                id="newProvicionalAuthExpiryDate"
                value={newProvicionalAuthExpiryDate}
                placeholder="Provisional Authority Expiration"
                onChange={(e) =>
                  setNewProvicionalAuthExpiryDate(e.target.value)
                }
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
              {newSelectedOperator && newSelectedDriver && (
                <div className="col-span-2 w-full flex justify-around read-only mt-3">
                  <ImageUploader
                    isDisabled={true}
                    title="Operator&lsquo;s Photo"
                    setImage={setNewOperatorFaceImage}
                    setPreview={setNewOperatorFacePreview}
                    preview={newOperatorFacePreview}
                  />
                  <ImageUploader
                    isDisabled={true}
                    title="Operator&lsquo;s Signature"
                    setImage={setNewOperatorSignatureImage}
                    setPreview={setNewOperatorSignaturePreview}
                    preview={newOperatorSignaturePreview}
                  />
                  <ImageUploader
                    isDisabled={true}
                    title="Driver&lsquo;s Photo"
                    setImage={setNewDriverFaceImage}
                    setPreview={setNewDriverFacePreview}
                    preview={newDriverFacePreview}
                  />
                  <ImageUploader
                    isDisabled={true}
                    title="Driver&lsquo;s Signature"
                    setImage={setNewDriverSignatureImage}
                    setPreview={setNewDriverSignaturePreview}
                    preview={newDriverSignaturePreview}
                  />
                </div>
              )}
            </div>
          </>
        )}
        {modalNewPaymentView && (
          <div
            className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black`}>
            <div className={`rounded-2xl bg-white text-black mx-3 py-3 px-5`}>
              <div className="flex justify-between items-center py-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  New Payment Entry
                </h3>
                <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-right">
                  <button
                    className="text-2xl flex items-center justify-center"
                    onClick={() => setModalNewPaymentView(false)}>
                    <IoMdCloseCircleOutline />
                  </button>
                </div>
              </div>
              <div
                className="rounded-lg border border-sky-700 py-3 px-5 grid grid-cols-2 gap-6 items-center w-full h-full"
                style={{ gridTemplateColumns: "auto 1fr" }}>
                <label htmlFor="newORNumber">OR Number</label>
                <input
                  type="text"
                  name="newORNumber"
                  id="newORNumber"
                  value={newORNumber}
                  placeholder="OR Number"
                  onChange={(e) => setNewORNumber(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="newORDate">OR Date</label>
                <input
                  type="date"
                  name="newORDate"
                  id="newORDate"
                  value={newORDate}
                  placeholder="OR Date"
                  onChange={(e) => setNewORDate(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="newAmount">Amount</label>
                <input
                  type="number"
                  name="newAmount"
                  id="newAmount"
                  value={newAmount || ""}
                  placeholder="Amount"
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <div className="w-full col-span-2 flex flex-col gap-2">
                  <label htmlFor="newScannedReceipt" className="w-full">
                    UPLOAD SCANNED OFFICIAL RECEIPT
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="newScannedReceipt"
                      onChange={(e) =>
                        e.target.files &&
                        setNewScannedReceipt(e.target.files[0])
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div
                      id="fileLabel"
                      className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                      <button className="bg-blue-500 text-white rounded px-2 mr-2">
                        Browse
                      </button>
                      {newScannedReceipt
                        ? `Selected file: ${newScannedReceipt.name}`
                        : "No File Chosen"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                <button
                  disabled={
                    !newORNumber ||
                    !newORDate ||
                    !newAmount ||
                    !newScannedReceipt
                  }
                  className={`${
                    !newORNumber ||
                    !newORDate ||
                    !newAmount ||
                    !newScannedReceipt
                      ? "border-gray-600 bg-gray-600"
                      : "border-sky-700 bg-sky-700"
                  } text-white border py-2 px-4 text-sm rounded-lg`}
                  onClick={() => {
                    if (typeof newAmount === "number" && newScannedReceipt) {
                      setPayments((prevPayments) => [
                        ...prevPayments,
                        {
                          orNumber: newORNumber,
                          orDate: newORDate,
                          amount: newAmount,
                          scannedReceipt: newScannedReceipt,
                        },
                      ]);
                      setNewPayments((prevPayments) => [
                        ...prevPayments,
                        {
                          orNumber: newORNumber,
                          orDate: newORDate,
                          amount: newAmount,
                          scannedReceipt: newScannedReceipt,
                        },
                      ]);
                      setModalNewPaymentView(false);
                      setNewORNumber("");
                      setNewORDate("");
                      setNewAmount(null);
                      setNewScannedReceipt(null);
                    }
                  }}>
                  Upload
                </button>
                <button
                  className="border-red-700 bg-red-700 text-white border py-2 px-4 text-sm rounded-lg"
                  onClick={() => setModalNewPaymentView(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {applicationCurrentPage === 2 && (
          <div className="pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full">
            <div className="flex gap-5 items-center mb-5">
              <h5>Add New Payment</h5>
              <button
                type="button"
                className="bg-sky-700 flex rounded-lg px-2 py-1 text-white"
                onClick={() => setModalNewPaymentView(true)}>
                + Add New
              </button>
            </div>
            <div className="w-full overflow-y-auto">
              <table className="w-full">
                <thead className="text-xs uppercase bg-sky-700 text-white py-2">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-1 sm:px-4 sm:py-3 whitespace-nowrap">
                      OR NO.
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-1 sm:px-4 sm:py-3 whitespace-nowrap">
                      OR DATE
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-1 sm:px-4 sm:py-3 whitespace-nowrap">
                      AMOUNT
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-1 sm:px-4 sm:py-3 whitespace-nowrap">
                      Files
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr
                      key={index}
                      className="bg-white border border-sky-700 text-center">
                      <td className="px-3 py-2 sm:px-4 whitespace-nowrap">
                        {payment.orNumber}
                      </td>
                      <td className="px-3 py-2 sm:px-4 whitespace-nowrap">
                        {payment.orDate}
                      </td>
                      <td className="px-3 py-2 sm:px-4 whitespace-nowrap">
                        {payment.amount}
                      </td>
                      <td className="px-3 py-2 sm:px-4 whitespace-nowrap">
                        {/* Display the file name of the scanned receipt */}
                        {payment.scannedReceipt.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {modalNewUploadDocument && currentDocReq && (
          <div
            className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black`}>
            <div className={`rounded-2xl bg-white text-black mx-3 py-3 px-5`}>
              <div className="flex justify-between items-center py-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Upload Requirement Document
                </h3>
                <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-right">
                  <button
                    className="text-2xl flex items-center justify-center"
                    onClick={() => {
                      if (currentFileUpload) {
                        currentDocReq.setFile(currentFileUpload);
                        setModalNewUploadDocument(false);
                        setCurrentFileUpload(null);
                      } else {
                        setModalNewUploadDocument(false);
                      }
                    }}>
                    <IoMdCloseCircleOutline />
                  </button>
                </div>
              </div>
              <div
                className="rounded-lg border border-sky-700 py-3 px-5 grid grid-cols-2 gap-6 items-center w-full h-full"
                style={{ gridTemplateColumns: "auto 1fr" }}>
                <label htmlFor="currentDocReq">Document Name</label>
                <input
                  type="text"
                  name="currentDocReq"
                  id="currentDocReq"
                  value={currentDocReq.description}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="currentDateUploaded">Date Uploaded</label>
                <input
                  type="date"
                  name="currentDateUploaded"
                  id="currentDateUploaded"
                  value={currentDateUploaded}
                  placeholder="Date Uploaded"
                  onChange={(e) => setCurrentDateUploaded(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="currentFileUpload" className="w-full">
                  Select PDF File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="currentFileUpload"
                    accept=".pdf"
                    onChange={(e) =>
                      e.target.files && setCurrentFileUpload(e.target.files[0])
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div
                    id="fileLabel"
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                    <button className="bg-blue-500 text-white rounded px-2 mr-2">
                      Browse
                    </button>
                    {currentFileUpload
                      ? `Selected file: ${currentFileUpload.name}`
                      : "No File Chosen"}
                  </div>
                </div>
                <div className="preview-here w-full col-span-2">
                  {currentFileUpload && (
                    <object
                      data={URL.createObjectURL(currentFileUpload)}
                      type="application/pdf"
                      width="100%"
                      height="300px">
                      <p>
                        It appears you don&apos;t have a PDF plugin for this
                        browser. No biggie... you can{" "}
                        <a href={URL.createObjectURL(currentFileUpload)}>
                          click here to download the PDF file.
                        </a>
                      </p>
                    </object>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                <button
                  disabled={!currentFileUpload}
                  className={`${
                    !currentFileUpload
                      ? "bg-gray-700 text-gray-300"
                      : "border-sky-700 bg-sky-700 text-white"
                  } border py-2 px-4 text-sm rounded-lg`}
                  onClick={() => {
                    if (currentFileUpload) {
                      currentDocReq.setFile(currentFileUpload);
                      setModalNewUploadDocument(false);
                      setCurrentFileUpload(null);
                    }
                  }}>
                  Upload
                </button>
                <button
                  className="border-red-700 bg-red-700 text-white border py-2 px-4 text-sm rounded-lg"
                  onClick={() => {
                    setModalNewUploadDocument(false);
                    setCurrentFileUpload(null);
                    setCurrentDocReq(null);
                  }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {modalViewUploadedDocument && currentViewDocReq && (
          <div
            className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black`}>
            <div className={`rounded-2xl bg-white text-black mx-3 py-3 px-5`}>
              <div className="flex justify-between items-center py-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Review Attached Document
                </h3>
                <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-right">
                  <button
                    className="text-2xl flex items-center justify-center"
                    // setModalViewUploadedDocument(false) ??
                    onClick={() => setModalNewUploadDocument(false)}>
                    <IoMdCloseCircleOutline />
                  </button>
                </div>
              </div>
              <div
                className="rounded-lg border border-sky-700 py-3 px-5 grid grid-cols-2 gap-6 items-center w-full h-full"
                style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <label htmlFor="currentViewDocReq">Document Name</label>
                  <input
                    type="text"
                    name="currentViewDocReq"
                    id="currentViewDocReq"
                    value={currentViewDocReq.description}
                    disabled
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="currentViewFileName">File Name</label>
                  <input
                    type="text"
                    name="currentViewFileName"
                    id="currentViewFileName"
                    value={`${currentYear}-DOCREQ-${currentViewDocReq.number}`}
                    disabled
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                </div>
                <div className="w-full col-span-2 ">
                  {toChangeFile ? (
                    <div className="w-full text-end">
                      <label htmlFor="changeFileUpload" className="w-full">
                        New PDF File
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="changeFileUpload"
                          onChange={(e) =>
                            e.target.files &&
                            setChangeFileUpload(e.target.files[0])
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div
                          id="fileLabel"
                          className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                          <button className="bg-blue-500 text-white rounded px-2 mr-2">
                            Browse
                          </button>
                          {changeFileUpload
                            ? `Selected file: ${changeFileUpload.name}`
                            : "No File Chosen"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      className=" w-full text-end text-sm italic text-blue-500"
                      onClick={() => setToChangeFile(!toChangeFile)}>
                      Change File?
                    </button>
                  )}
                </div>
                <div className="preview-here w-full col-span-2">
                  {changeFileUpload ? (
                    <object
                      data={URL.createObjectURL(changeFileUpload)}
                      type="application/pdf"
                      width="100%"
                      height="300px">
                      <p>
                        <a href={URL.createObjectURL(changeFileUpload)}>
                          click here to download the PDF file.
                        </a>
                      </p>
                    </object>
                  ) : (
                    <object
                      data={URL.createObjectURL(currentViewDocReq.file)}
                      type="application/pdf"
                      width="100%"
                      height="300px">
                      <p>
                        <a href={URL.createObjectURL(currentViewDocReq.file)}>
                          click here to download the PDF file.
                        </a>
                      </p>
                    </object>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                <button
                  className="border-sky-700 bg-sky-700 text-white border py-2 px-4 text-sm rounded-lg"
                  onClick={() => {
                    if (changeFileUpload) {
                      currentViewDocReq.setFile(changeFileUpload);
                      setModalViewUploadedDocument(false);
                      setChangeFileUpload(null);
                      setCurrentViewDocReq(null);
                    }
                  }}>
                  Upload
                </button>
                <button
                  className="border-red-700 bg-red-700 text-white border py-2 px-4 text-sm rounded-lg"
                  onClick={() => {
                    setModalViewUploadedDocument(false);
                    setCurrentViewDocReq(null);
                    setChangeFileUpload(null);
                    setToChangeFile(false);
                  }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {applicationCurrentPage === 3 && (
          <div className="w-full h-full overflow-y-auto pb-11">
            <table className="h-full w-full text-sm text-center">
              <thead className="text-xs uppercase bg-sky-700 text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    No.
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-start">
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    File Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    Remarks
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {documentDesc.map((docReq) => (
                  <tr
                    key={docReq.number}
                    className="bg-white border border-sky-700 text-center text-sky-700 font-semibold">
                    <td className="px-3 py-5 sm:px-4 whitespace-nowrap">
                      {docReq.number}
                    </td>
                    <td className="px-3 py-2 sm:px-4 text-start">
                      {docReq.description}
                    </td>
                    <td className="px-3 py-2 sm:px-4 whitespace-nowrap">
                      {new Date().getFullYear()}-DOCREQ-{docReq.number}
                    </td>
                    {/* <td className="px-3 py-2 sm:px-4 whitespace-nowrap">
                    {docReq.file
                      ? `${new Date().getFullYear()}-DOCREQ-${docReq.number}`
                      : ""}
                  </td> */}
                    <td className="px-3 py-2 sm:px-4 whitespace-nowrap">
                      {docReq.file ? "COMPLIED" : "No File Attached"}
                    </td>
                    <td className="px-3 py-2 sm:px-4 whitespace-nowrap">
                      <button
                        className={`${
                          !docReq.file
                            ? "bg-green-700 text-white"
                            : "border border-green-700 text-green-700"
                        }  py-2 px-4 text-sm rounded-lg`}
                        onClick={() => {
                          if (docReq.file) {
                            handleViewFileUploaded(
                              docReq.number,
                              docReq.description,
                              docReq.setFile,
                              docReq.file
                            );
                          } else {
                            handleFileUpload(
                              docReq.number,
                              docReq.description,
                              docReq.setFile
                            );
                          }
                        }}>
                        {docReq.file ? "View Attached File" : "Upload File"}
                      </button>
                      {/* <button
                        className="border-green-700 text-green-700 border py-2 px-4 text-sm rounded-lg"
                        onClick={() => {
                          handleFileUpload(docReq.setFile);
                        }}>
                        {docReq.file ? "View Attached File" : "Upload File"}
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {modalExit && !loading && (
          <div
            className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black`}>
            <div
              className={`rounded-2xl bg-white text-black mx-3 py-3 px-3 w-[40rem]`}>
              <div
                className="rounded-lg border border-sky-700 py-3 px-5 grid grid-cols-2 gap-3 items-center"
                style={{ gridTemplateColumns: "1fr 1.5fr" }}>
                <div className="flex justify-center">
                  <Image
                    src="/rafiki.svg"
                    alt="Icon"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="h-full flex flex-col justify-around">
                  <h5 className="font-semibold">
                    Application has been uploaded or save.
                  </h5>
                  <p>Click OK to view the generated QR CODE</p>
                  <div className="sm:px-6 sm:flex sm:flex-row-reverse gap-4 mt-8">
                    <button
                      className={`border-sky-700 bg-sky-700
             text-white border py-2 px-4 text-sm rounded-lg`}
                      onClick={() => {
                        if (userType === "admin") {
                          router.push("/admin/dashboard/tricycle-qr");
                        } else {
                          router.push("/personnel/dashboard/tricycle-qr");
                        }

                        setModalExit(false);
                      }}>
                      OK
                    </button>
                    <button
                      className="border-sky-700 text-sky-700 border py-2 px-4 text-sm rounded-lg"
                      onClick={() => setModalExit(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end items-center w-full">
        <div className="flex select-none gap-4">
          <button
            disabled={applicationCurrentPage === 1}
            className={`${
              applicationCurrentPage === 1
                ? "border-gray-600 bg-gray-600 text-gray-300"
                : "border-sky-700 text-black"
            } border py-2 px-4 text-sm rounded-lg`}
            onClick={() => {
              if (applicationCurrentPage === 1) {
              } else {
                setApplicationCurrentPage(applicationCurrentPage - 1);
              }
            }}>
            Back
          </button>
          <button
            disabled={
              (applicationCurrentPage === 1 &&
                (!newApplicationDate ||
                  !newFranchiseNumber ||
                  !newFranchiseStatus ||
                  !newSelectedOperator ||
                  !newSelectedDriver ||
                  !newInsuranceCompany ||
                  !newInsuranceCocNumber ||
                  !newInsuranceExpiryDate ||
                  !newProvicionalAuthExpiryDate)) ||
              (applicationCurrentPage === 2 && newPayments.length === 0) ||
              (applicationCurrentPage === 3 &&
                (newDocReq1 === null ||
                  newDocReq2 === null ||
                  newDocReq3 === null ||
                  newDocReq4 === null ||
                  newDocReq5 === null ||
                  newDocReq6 === null ||
                  newDocReq7 === null ||
                  newDocReq8 === null ||
                  newDocReq9 === null ||
                  newDocReq10 === null ||
                  newDocReq11 === null ||
                  newDocReq12 === null ||
                  newDocReq13 === null))
            }
            className={`${
              (applicationCurrentPage === 1 &&
                (!newApplicationDate ||
                  !newFranchiseNumber ||
                  !newFranchiseStatus ||
                  !newSelectedOperator ||
                  !newSelectedDriver ||
                  !newInsuranceCompany ||
                  !newInsuranceCocNumber ||
                  !newInsuranceExpiryDate ||
                  !newProvicionalAuthExpiryDate)) ||
              (applicationCurrentPage === 2 && newPayments.length === 0) ||
              (applicationCurrentPage === 3 &&
                (newDocReq1 === null ||
                  newDocReq2 === null ||
                  newDocReq3 === null ||
                  newDocReq4 === null ||
                  newDocReq5 === null ||
                  newDocReq6 === null ||
                  newDocReq7 === null ||
                  newDocReq8 === null ||
                  newDocReq9 === null ||
                  newDocReq10 === null ||
                  newDocReq11 === null ||
                  newDocReq12 === null ||
                  newDocReq13 === null))
                ? "bg-gray-600 text-gray-300"
                : "bg-sky-700 text-white"
            } border py-2 px-4 text-sm rounded-lg`}
            onClick={() => {
              if (applicationCurrentPage !== 3) {
                setApplicationCurrentPage(applicationCurrentPage + 1);
              } else {
                handleSubmissionTricyclePermit();
              }
            }}>
            {applicationCurrentPage === 3 ? "Save" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Application;
