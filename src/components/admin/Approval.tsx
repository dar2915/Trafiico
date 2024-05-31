"use client";

import {
  deleteApplicationData,
  editApplicationData,
  fetchApplicationData,
} from "@/api/applicationsData";
import { documentDesc } from "@/api/dataValues";
import { deletePaymentData } from "@/api/paymentsData";
import { fetchRequirementDocumentDataByID } from "@/api/requirementsData";
import { LoadingScreenSection } from "@/components/LoadingScreen";
import { supabase, supabaseAdmin } from "@/utils/supabase";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";
import { MdOutlineDelete, MdOutlineSearch } from "react-icons/md";

const Approval = () => {
  const [searchValue, setSearchValue] = useState("");
  // const [selectedOption, setSelectedOption] = useState("trackCode");
  const [currentDetailsPage, setCurrentDetailsPage] = useState(1);
  type Record = any;
  type Documents = any;
  const [records, setRecords] = useState<Record[]>([]);
  const [docsRecords, setDocsRecords] = useState<Documents[]>([]);
  const [numOfEntries, setNumOfEntries] = useState(0);
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [currentFranchiseNum, setCurrentFranchiseNum] = useState("");
  const [currentOperator, setCurrentOperator] = useState("");
  const [currentOperatorAddress, setCurrentOperatorAddress] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentBodyNumber, setCurrentBodyNumber] = useState("");

  const headerNames = [
    "Franchise No.",
    "Applicant Name",
    "Submission Date",
    "Status",
  ];

  const headerDocumentNames = [
    "No.",
    "Description",
    "File Name",
    "Remarks",
    "Action",
  ];

  const memoizedFetchApplicationData = useCallback(async () => {
    try {
      const response = await fetchApplicationData(searchValue,startDate,endDate);
      if (response?.error) {
        console.error(response.error);
      } else {
        setRecords(response?.data || []);
        setNumOfEntries(response?.count || 1);
        // console.log("response?.data", response?.data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [searchValue, currentDetailsPage,startDate,endDate]);

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
  }, [searchValue, currentDetailsPage,startDate,endDate]);

  // useEffect(() => {
  //   console.log("currentId", currentId);
  // }, [currentId]);

  // const fetchRequirementsDataByIDFunction = async (currentId: any) => {
  //   try {
  //     const response = await fetchRequirementDocumentDataByID(
  //       parseInt(currentId)
  //     );
  //     if (response?.error) {
  //       console.error(response.error);
  //     } else {
  //       setDocsRecords(response?.data || []);
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  const memoizedFetchRequirementsDataByID = useCallback(async () => {
    if (!currentId) return;
    try {
      const response = await fetchRequirementDocumentDataByID(
        parseInt(currentId)
      );
      if (response?.error) {
        console.error(response.error);
      } else {
        setDocsRecords(response?.data || []);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [currentId]);

  useEffect(() => {
    memoizedFetchRequirementsDataByID();

    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "RequirementDocuments",
          filter: `application_id=eq.${currentId}`,
        },
        (payload) => {
          if (payload.new) {
            setDocsRecords((prevRecord: any) => [
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
          table: "RequirementDocuments",
          filter: `application_id=eq.${currentId}`,
        },
        (payload) => {
          if (payload.new) {
            setDocsRecords((prevRecord: any) =>
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
          table: "RequirementDocuments",
        },
        (payload) => {
          if (payload.old) {
            setDocsRecords((prevRecord: any) =>
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
  }, [currentId]);

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  interface Document {
    number: number;
    description: string | undefined;
    fileName: string;
    fileLocation: any;
  }

  const [docsArray, setDocsArray] = useState<Document[]>([]);

  const handleProcessApproval = (id: string, franchise_num: string) => {
    // newly added
    // fetchRequirementsDataByIDFunction(currentId);

    const record = records.find(
      (record) => record.app_id === id && record.franchise_num === franchise_num
    );

    if (record) {
      setCurrentId(record.app_id);
      setCurrentFranchiseNum(record.franchise_num);
      setCurrentOperator(record.operator_name);
      setCurrentOperatorAddress(record.operator_address);
      setCurrentStatus(record.status);
      setCurrentBodyNumber(record.body_num);

      const newDocsArray = Object.keys(record)
        .filter((key) => key.startsWith("doc_") && key.endsWith("_loc"))
        .map((key, index) => {
          const number = index + 1;
          const description = documentDesc.find(
            (doc) => doc.number === number
          )?.description;
          const fileName = `${new Date().getFullYear()}-DOCREQ-${number}`;
          const fileLocation = record[key];
          return { number, description, fileName, fileLocation };
        });

      // console.log(newDocsArray);
      setDocsArray(newDocsArray);
    }

    setCurrentDetailsPage(2);
  };

  type DocReqViewType = {
    year: string;
    number: number;
    description: string;
    file: File;
  };

  const [currentViewDocReq, setCurrentViewDocReq] =
    useState<DocReqViewType | null>(null);
  const [modalViewUploadedDocument, setModalViewUploadedDocument] =
    useState(false);

  const handleViewFileUploaded = (
    year: string,
    number: number,
    description: string,
    file: File
  ) => {
    setCurrentViewDocReq({ year, number, description, file });
    setModalViewUploadedDocument(true);
  };

  const STORAGE_BUCKET_APPLICATION_REQUIREMENTS_VIEW = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/application/requirements_documents/`;

  // const STORAGE_BUCKET_APPLICATION_REQUIREMENTS =
  //   "assets/application/requirements_documents";

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentViewDocReq]);

  const handleUpdateApplicationStatus = async (newStatus: string) => {
    const applicationId: string = currentId;
    const record = records.find((record) => record.app_id === applicationId);

    if (record) {
      try {
        await editApplicationData(applicationId, newStatus);
        setCurrentDetailsPage(1);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  const [loading, setLoading] = useState(false);

  const handleDeleteApplicationRecord = async (applicationId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this record?"
    );

    setLoading(true);
    if (applicationId && confirmDelete) {
      try {
        await deleteApplicationData(applicationId);
        await deletePaymentData(applicationId);

        for (let i = 1; i <= 13; i++) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([
              `application/requirements_documents/${applicationId}_doc${i}.pdf`,
            ]);
        }

        setCurrentDetailsPage(1);
        setLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }

    return;
  };
  const handleStartDateChange = (event: { target: { value: any; }; }) => {
    setstartDate(event.target.value);
  };

  const handleEndDateChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setendDate(event.target.value);
  };
  return (
    <div className="z-0 flex flex-col gap-10 h-full w-full">
      {loading && <LoadingScreenSection />}
      <div className="flex justify-between items-center flex-col md:flex-row">
        <button
          className="flex gap-2 items-center"
          onClick={() => {
            if (currentDetailsPage === 2) {
              setCurrentDetailsPage(1);
            }
          }}>
          {currentDetailsPage === 2 && <IoChevronBack />}
          <h1 className="flex font-bold text-3xl text-sky-700 ">
            Approval Process
          </h1>
        </button>
        {currentDetailsPage === 1 ? (
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
       {/* <select
              name="searchOption"
              id="searchOption"
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg py-2 text-sm"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}>
              <option value="trackCode">Tracking Code</option>
              <option value="operator">Name</option>
            </select> */}
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <label htmlFor="currentFranchiseNum" className=" whitespace-nowrap">
              Tracking Code
            </label>
            <input
              type="text"
              name="currentFranchiseNum"
              id="currentFranchiseNum"
              value={currentFranchiseNum}
              disabled
              className="w-full border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg pl-3 pr-10 py-2"
            />
          </div>
        )}
      </div>
      <div className="relative flex">
  <label>From: </label> &nbsp;&nbsp;
  <input
    type="date"
    value={startDate}
    onChange={handleStartDateChange}
    className="w-400px border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg pl-3 pr-10 py-2"
  />
  <label>&nbsp;To: </label>&nbsp;&nbsp;&nbsp;
  <input
    type="date"
    value={endDate}
    onChange={handleEndDateChange}
    className="w-400px border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg pl-3 pr-10 py-2"
  />
</div>
       
      {currentDetailsPage === 1 ? (
        <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-full sm:h-[78dvh] border border-sky-700 ">
          <h1 className="px-3 py-2 sm:px-4 border-b border-sky-700">Details</h1>
          <div className="flex items-start content-start overflow-y-auto w-full h-full">
            <table className="w-full text-sm text-center ">
              <thead className="text-xs uppercase bg-sky-700 text-white">
                <tr>
                  {headerNames.map((header, index) => (
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
                    className="bg-white border-b border-sky-700 hover:bg-sky-100 cursor-pointer"
                    onClick={() =>
                      handleProcessApproval(record.app_id, record.franchise_num)
                    }>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {record.franchise_num}
                    </td>
                    <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                      {record.operator_name}
                    </td>
                    <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                      {new Date(record.application_date)
                        .toISOString()
                        .slice(0, 10)}
                    </td>
                    <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                      <button
                        className={`${
                          record.status === "pending" &&
                          "bg-sky-200 text-sky-700"
                        } ${
                          record.status === "approved" &&
                          "bg-green-200 text-green-700"
                        } ${
                          record.status === "disapproved" &&
                          "bg-red-200 text-red-700"
                        } py-2 px-5 text-sm rounded-lg`}>
                        {capitalizeFirstLetter(record.status)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
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
                      onClick={() => setModalViewUploadedDocument(false)}>
                      <IoMdCloseCircleOutline />
                    </button>
                  </div>
                </div>
                <div
                  className="rounded-lg border border-sky-700 py-3 px-5 grid grid-cols-2 gap-6 items-center w-full h-full"
                  style={{ gridTemplateColumns: "0.50fr 1fr" }}>
                  <div>
                    <label htmlFor="currentViewDocReq">Document Name</label>
                    <input
                      type="text"
                      name="currentViewDocReq"
                      id="currentViewDocReq"
                      value={currentViewDocReq.description}
                      disabled
                      className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 1frw-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="currentViewFileName">File Name</label>
                    <input
                      type="text"
                      name="currentViewFileName"
                      id="currentViewFileName"
                      value={`${currentViewDocReq.year}-DOCREQ-${currentViewDocReq.number}`}
                      disabled
                      className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                    />
                  </div>
                  {/* <div className="preview-here w-full col-span-2">
                    {STORAGE_BUCKET_APPLICATION_REQUIREMENTS_VIEW +
                      currentViewDocReq.file}
                  </div> */}

                  <div className="preview-here w-full col-span-2">
                    {isLoading ? (
                      <LoadingScreenSection />
                    ) : (
                      <object
                        data={
                          STORAGE_BUCKET_APPLICATION_REQUIREMENTS_VIEW +
                          currentViewDocReq.file
                        }
                        type="application/pdf"
                        width="100%"
                        height="300px">
                        <p>
                          <a
                            href={
                              STORAGE_BUCKET_APPLICATION_REQUIREMENTS_VIEW +
                              currentViewDocReq.file
                            }>
                            click here to download the PDF file.
                          </a>
                        </p>
                      </object>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="border-red-700 bg-red-700 text-white border py-2 px-4 text-sm rounded-lg"
                    onClick={() => {
                      setModalViewUploadedDocument(false);
                      setCurrentViewDocReq(null);
                    }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-5">
            <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg border border-sky-700">
              <div className="w-full flex justify-between items-center border-b border-sky-700 px-3">
                <h1 className="py-2">OPERATOR{`’`}S INFORMATION</h1>
                <button
                  className={`border-red-700 text-red-700 
                   border py-1 px-2 text-sm rounded-lg flex items-center gap-2`}
                  onClick={() => handleDeleteApplicationRecord(currentId)}>
                  <MdOutlineDelete />
                  <span>Delete</span>
                </button>
              </div>
              <div className="flex flex-col items-start content-start overflow-y-auto w-full h-full py-2 sm:px-4">
                <h1 className="text-xl text-sky-700 font-semibold">
                  {currentOperator}
                </h1>
                <h1>{currentOperatorAddress}</h1>
                <h1 className="text-sky-500 font-semibold">
                  {currentBodyNumber}
                </h1>
              </div>
            </div>
            <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg border border-sky-700">
              <h1 className="px-3 py-2 sm:px-4 border-b border-sky-700">
                REQUIREMENTS - DOCUMENTS
              </h1>
              <div className="flex flex-col items-start content-start overflow-y-auto w-full h-full py-2 sm:px-4">
                <table className="w-full text-sm text-center ">
                  <thead className="text-md uppercase border-b border-sky-700 ">
                    <tr style={{ gridTemplateColumns: "auto 1fr 1fr 1fr 1fr" }}>
                      {headerDocumentNames.map((header, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* THIS IS SO IMPORTANT:
                    CHANGE THIS :
                      {docsRecords.length > 0 &&
                          docsRecords[0][`doc_${index + 1}_loc`]}
                    TO:
                      {docsRecords.length > 0 &&
                          docsRecords[0][`${index + 1}_loc`]} idk
                  */}
                    {documentDesc.map((desc, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b border-sky-700 hover:bg-sky-100 cursor-pointer">
                        <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                          {desc.description}
                        </td>
                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap">{`${new Date().getFullYear()}-DOCREQ-${
                          index + 1
                        }`}</td>
                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                          {docsRecords.length > 0 &&
                            docsRecords[0][`doc_${index + 1}_loc`]}
                        </td>
                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                          <button
                            className={`border border-green-700 text-green-700 py-2 px-4 text-xs rounded-lg`}
                            onClick={() => {
                              handleViewFileUploaded(
                                new Date(docsRecords[0].application_date)
                                  .getFullYear()
                                  .toString(),
                                index + 1,
                                desc.description,
                                docsRecords[0][`doc_${index + 1}_loc`]
                              );
                            }}>
                            View Attached File
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg border border-sky-700">
              <h1 className="px-3 py-2 sm:px-4 border-b border-sky-700">
                APPLICATION STATUS -{" "}
                <span
                  className={`${
                    currentStatus === "pending"
                      ? "text-yellow-700"
                      : currentStatus === "approved"
                      ? "text-green-700"
                      : "text-red-700"
                  } italic font-semibold `}>
                  {capitalizeFirstLetter(currentStatus)}
                </span>
              </h1>
              <div className="flex items-center justify-start overflow-y-auto w-full h-full py-2 sm:px-4 gap-5">
                {currentStatus === "pending" ? (
                  <>
                    <button
                      className="bg-green-200 text-green-700 py-2 px-5 text-sm rounded-lg"
                      onClick={() => handleUpdateApplicationStatus("approved")}>
                      Approve
                    </button>
                    <button
                      className="bg-gray-200 text-gray-700 py-2 px-5 text-sm rounded-lg"
                      onClick={() =>
                        handleUpdateApplicationStatus("disapproved")
                      }>
                      Disapprove
                    </button>
                  </>
                ) : currentStatus === "disapproved" ? (
                  <button
                    className="bg-green-200 text-green-700 py-2 px-5 text-sm rounded-lg"
                    onClick={() => handleUpdateApplicationStatus("approved")}>
                    Approve
                  </button>
                ) : (
                  <button
                    className="bg-red-200 text-red-700 py-2 px-5 text-sm rounded-lg"
                    onClick={() =>
                      handleUpdateApplicationStatus("disapproved")
                    }>
                    Revoke Approval
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Approval;
