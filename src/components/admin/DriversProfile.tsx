"use client";

import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlinePublishedWithChanges,
  MdOutlineSearch,
} from "react-icons/md";
import ImageUploader from "./ImageUploader";
import { supabase, supabaseAdmin } from "@/utils/supabase";
import {
  editDriverProfileData,
  fetchDriverProfileData,
  insertDriverProfileData,
} from "@/api/driverProfilesData";
import { bloodTypeOptions } from "@/api/dataValues";
import { register } from "module";

const DriversProfile = () => {
  const [registerDriver, setRegisterDriver] = useState(false);
  const [toggleMoreDetails, setToggleMoreDetails] = useState(false);
  
  const [numOfEntries, setNumOfEntries] = useState(1);
  const entriesPerPage = 10;

  const headerNames = [
    // "ID",
    "Date",
    "License No.",
    "License Expiry",
    "Driver's Name",
    "Address",
    "More Details",
    "Status",
  ];

  // register
  const [registerPermitView, setRegisterPermitView] = useState(false);
  const [registerPermitViewPage, setRegisterPermitViewPage] = useState(1);
  const [currentPageRegister, setCurrentPageRegister] = useState(1);
 
  // details
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [currentPageDetailsSection, setCurrentPageDetailsSection] = useState(1);

  // more details
  const [currentPageMoreDetailsSection, setCurrentPageMoreDetailsSection] =
    useState(1);

  // details data
  
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [address, setAddress] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiration, setLicenseExpiration] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [contactRelationship, setContactRelationship] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactAddress, setContactAddress] = useState("");

  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [signatureImage, setSignatureImage] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  // new details
  const [newLastName, setNewLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newMiddleName, setNewMiddleName] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [newBirthPlace, setNewBirthPlace] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCivilStatus, setNewCivilStatus] = useState("");
  const [newBloodType, setNewBloodType] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newLicenseNumber, setNewLicenseNumber] = useState("");
  const [newLicenseExpiration, setNewLicenseExpiration] = useState("");
  const [newIsActive, setNewIsActive] = useState(false);

  const [newContactRelationship, setNewContactRelationship] = useState("");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [newContactAddress, setNewContactAddress] = useState("");

  const [newFaceImage, setNewFaceImage] = useState<File | null>(null);
  const [newFacePreview, setNewFacePreview] = useState<string | null>(null);
  const [newSignatureImage, setNewSignatureImage] = useState<File | null>(null);
  const [newSignaturePreview, setNewSignaturePreview] = useState<string | null>(
    null
  );

  type Record = any;
  const [records, setRecords] = useState<Record[]>([]);

  const memoizedFetchDriverProfileData = useCallback(async () => {
    try {
      const response = await fetchDriverProfileData(
        searchValue,
        entriesPerPage,
        currentPageDetailsSection,
        startDate,
        endDate
      );
      if (response?.error) {
        console.error(response.error);
      } else {
        setRecords(response?.data || []);
        setNumOfEntries(response?.count || 1);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [searchValue, entriesPerPage, currentPageDetailsSection,startDate,endDate]);

  useEffect(() => {
    memoizedFetchDriverProfileData();

    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "DriverProfiles",
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
          table: "DriverProfiles",
        },
        (payload) => {
          if (payload.new) {
            setRecords((prevRecord: any) =>
              prevRecord.map((record: any) =>
                record.id === payload.new.id ? payload.new : record
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
          table: "DriverProfiles",
        },
        (payload) => {
          if (payload.old) {
            setRecords((prevRecord: any) =>
              prevRecord.filter((record: any) => record.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchValue, entriesPerPage, currentPageDetailsSection,startDate,endDate]);

  const handleSubmissionWithoutEvent = () => {
    handleInsertDriversProfile({ preventDefault: () => {} });
  };

  const handleInsertDriversProfile = async (event: any) => {
    event.preventDefault();

    const newRecord = {
      last_name: newLastName,
      first_name: newFirstName,
      middle_name: newMiddleName,
      birth_date: newBirthDate,
      birth_place: newBirthPlace,
      address: newAddress,
      civil_status: newCivilStatus,
      blood_type: newBloodType,
      contact_num: newPhoneNumber,
      license_num: newLicenseNumber,
      license_expiration: newLicenseExpiration,
      is_active: newIsActive,
      contact_relationship_driver: newContactRelationship,
      contact_person: newContactPerson,
      contact_person_num: newContactNumber,
      contact_address: newContactAddress,
    };

    const response = await insertDriverProfileData(newRecord);

    if (response?.error) {
      console.error("Error inserting new row data:", response.error);
    } else {
      if (response && response.data) {
        const insertedId = response.data[0].id;
        // console.log("Inserted ID:", insertedId);

        const STORAGE_BUCKET_OPERATOR_FACE_PHOTO = "assets/drivers/face_photo";
        const STORAGE_BUCKET_OPERATOR_SIGNATURE =
          "assets/drivers/signature_photo";

        const UPLOAD_FACE_PHOTO = `face_${insertedId}.jpeg`;
        const UPLOAD_SIGNATURE_PHOTO = `signature_${insertedId}.jpeg`;

        if (newFaceImage && newSignatureImage) {
          const { data: faceData, error: faceError } = await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_FACE_PHOTO)
            .upload(UPLOAD_FACE_PHOTO, newFaceImage);

          const { data: signatureData, error: signatureError } =
            await supabase.storage
              .from(STORAGE_BUCKET_OPERATOR_SIGNATURE)
              .upload(UPLOAD_SIGNATURE_PHOTO, newSignatureImage);
        }

        const updateRecord = {
          face_photo: UPLOAD_FACE_PHOTO,
          signature_photo: UPLOAD_SIGNATURE_PHOTO,
        };

        await editDriverProfileData(insertedId, updateRecord);
      }
    }
  };

  const handleViewClick = (driverId: string) => {
    const record = records.find((record) => record.id === driverId);

    if (record) {
      setCurrentDriverId(driverId);

      setLastName(record.last_name);
      setFirstName(record.first_name);
      setMiddleName(record.middle_name);
      setBirthDate(record.birth_date);
      setBirthPlace(record.birth_place);
      setAddress(record.address);
      setCivilStatus(record.civil_status);
      setBloodType(record.blood_type);
      setPhoneNumber(record.contact_num);
      setLicenseNumber(record.license_num);
      setLicenseExpiration(record.license_expiration);
      setIsActive(record.is_active);
      setContactRelationship(record.contact_relationship_driver);
      setContactPerson(record.contact_person);
      setContactNumber(record.contact_person_num);
      setContactAddress(record.contact_address);

      const STORAGE_BUCKET_DRIVER_FACE_PHOTO_VIEW = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/drivers/face_photo/`;
      const STORAGE_BUCKET_DRIVER_SIGNATURE_VIEW = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/drivers/signature_photo/`;

      setFacePreview(
        `${STORAGE_BUCKET_DRIVER_FACE_PHOTO_VIEW}${record.face_photo}`
      );
      setSignaturePreview(
        `${STORAGE_BUCKET_DRIVER_SIGNATURE_VIEW}${record.signature_photo}`
      );

      setToggleMoreDetails(true);
    }
  };

  // DATA MANIPUATION
  const [toggleEditDriverInfo, setToggleEditDriverInfo] = useState(false);
  const [toggleDeleteDriverInfo, setToggleDeleteDriverInfo] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState("");

  const handleDeleteDriverRecord = async (driverId: string) => {
    if (toggleDeleteDriverInfo) {
      const response = await supabase
        .from("DriverProfiles")
        .delete()
        .eq("id", driverId);

      if (response.error) {
        console.error("Error deleting data:", response.error);
      } else {
        setToggleDeleteDriverInfo(false);
        setCurrentDriverId("");

        setCurrentPageMoreDetailsSection(1);
        setToggleMoreDetails(false);

        await supabaseAdmin.storage
          .from("assets")
          .remove([`drivers/face_photo/face_${driverId}.jpeg`]);

        await supabaseAdmin.storage
          .from("assets")
          .remove([`drivers/signature_photo/signature_${driverId}.jpeg`]);
      }
    }
  };

  useEffect(() => {
    if (toggleDeleteDriverInfo) {
      const confirmDelete = confirm(
        "Are you sure you want to delete this record?"
      );

      if (confirmDelete && currentDriverId) {
        handleDeleteDriverRecord(currentDriverId);
      }
    }
  }, [toggleDeleteDriverInfo]);

  const handleEditDriversProfile = async (driverId: string) => {
    const record = records.find((record) => record.id === driverId);

    if (record) {
      const updateRecordDriver = {
        last_name: lastName,
        first_name: firstName,
        middle_name: middleName,
        birth_date: birthDate,
        birth_place: birthPlace,
        address: address,
        civil_status: civilStatus,
        blood_type: bloodType,
        contact_num: phoneNumber,
        license_num: licenseNumber,
        license_expiration: licenseExpiration,
        is_active: isActive,
        contact_relationship_driver: contactRelationship,
        contact_person: contactPerson,
        contact_person_num: contactNumber,
        contact_address: contactAddress,
      };

      try {
        await editDriverProfileData(driverId, updateRecordDriver);

        // images
        const STORAGE_BUCKET_OPERATOR_FACE_PHOTO = "assets/drivers/face_photo";
        const STORAGE_BUCKET_OPERATOR_SIGNATURE =
          "assets/drivers/signature_photo";

        const UPLOAD_FACE_PHOTO = `face_${driverId}.jpeg`;
        const UPLOAD_SIGNATURE_PHOTO = `signature_${driverId}.jpeg`;

        if (faceImage) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([`drivers/face_photo/face_${driverId}.jpeg`]);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_FACE_PHOTO)
            .upload(UPLOAD_FACE_PHOTO, faceImage);
        }

        if (signatureImage) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([`drivers/signature_photo/signature_${driverId}.jpeg`]);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_SIGNATURE)
            .upload(UPLOAD_SIGNATURE_PHOTO, signatureImage);
        }

        setToggleEditDriverInfo(false);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  useEffect(() => {
    setToggleEditDriverInfo(false);
  }, [currentPageMoreDetailsSection]);
  const handleStartDateChange = (event: { target: { value: any; }; }) => {
    setstartDate(event.target.value);
  };

  const handleEndDateChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setendDate(event.target.value);
  };
  return (
    <div className="z-0 flex flex-col gap-10 h-full">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div className="flex gap-5 items-center">
          <h1 className="flex font-bold text-3xl text-sky-700 ">
            {!registerPermitView
              ? "List of Drivers"
              : "Register Tricycle Driver"}
          </h1>
          {!registerPermitView && !toggleMoreDetails && (
            <button
              type="button"
              className="bg-sky-700 flex text-lg rounded-lg px-5 py-2 text-white"
              onClick={() => setRegisterPermitView(!registerPermitView)}>
              + New
            </button>
          )}
        </div>
        {!registerPermitView && !toggleMoreDetails && (
          <div className="relative">
            <MdOutlineSearch className="z-0 absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2 text-2xl" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPageDetailsSection(1);
              }}
              placeholder="Search"
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
      <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-[70dvh] border border-sky-700">
        <div className="w-full flex justify-between items-center border-b border-sky-700">
          <h1 className="px-3 py-2 sm:px-4">
            {registerPermitView
              ? currentPageRegister === 1
                ? "Drivers's Profile"
                : "Driver's Contact Person / In Case of Emergency"
              : toggleMoreDetails
              ? "Personal Information"
              : "Details"}
          </h1>
          <div className="px-3 flex items-center gap-3">
            {!registerPermitView && toggleMoreDetails && (
              <>
                {toggleEditDriverInfo && (
                  <button
                    className="bg-purple-700 text-white
              border py-1 px-2 text-sm rounded-lg flex items-center gap-2"
                    onClick={() => handleEditDriversProfile(currentDriverId)}>
                    <MdOutlinePublishedWithChanges />
                    <span>Apply Changes</span>
                  </button>
                )}
                <button
                  className={`${
                    toggleEditDriverInfo
                      ? "bg-sky-700 text-white"
                      : "border-sky-700 text-sky-700"
                  } border py-1 px-2 text-sm rounded-lg flex items-center gap-2`}
                  onClick={() =>
                    setToggleEditDriverInfo(!toggleEditDriverInfo)
                  }>
                  <MdOutlineEdit />
                  <span>{toggleEditDriverInfo ? "Cancel" : "Edit"}</span>
                </button>
                <button
                  className={`border-red-700 text-red-700 
                   border py-1 px-2 text-sm rounded-lg flex items-center gap-2`}
                  onClick={() => setToggleDeleteDriverInfo(true)}>
                  <MdOutlineDelete />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>

        {registerPermitView ? (
          registerPermitViewPage === 1 ? (
            // driver's profile
            <div
              className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
              style={{ gridTemplateColumns: "auto 1fr" }}>
              {currentPageRegister === 1 ? (
                <>
                  <label htmlFor="newLastName">Last Name</label>
                  <input
                    type="text"
                    name="newLastName"
                    id="newLastName"
                    value={newLastName}
                    placeholder="Last Name"
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newFirstName">First Name</label>
                  <input
                    type="text"
                    name="newFirstName"
                    id="newFirstName"
                    value={newFirstName}
                    placeholder="First Name"
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newMiddleName">Middle Name</label>
                  <div>
                    <input
                      type="text"
                      name="newMiddleName"
                      id="newMiddleName"
                      required
                      value={newMiddleName}
                      placeholder="Middle Name"
                      onChange={(e) => setNewMiddleName(e.target.value)}
                      className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                    />
                    <input
                      type="checkbox"
                      id="newMiddleNameNone"
                      name="newMiddleNameNone"
                      value="none"
                      checked={newMiddleName === ""}
                      onChange={(e) =>
                        setNewMiddleName(
                          e.target.checked ? "" : "defaultMiddleName"
                        )
                      }
                      className="mt-3"
                    />
                    <label htmlFor="newMiddleNameNone">
                      {" "}
                      I have no middle name
                    </label>
                  </div>
                  <label htmlFor="newBirthDate">Date of Birth</label>
                  <input
                    type="date"
                    name="newBirthDate"
                    id="newBirthDate"
                    value={newBirthDate}
                    placeholder="Birthdate"
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newBirthPlace">Place of Birth</label>
                  <input
                    type="text"
                    name="newBirthPlace"
                    id="newBirthPlace"
                    value={newBirthPlace}
                    placeholder="Address"
                    onChange={(e) => setNewBirthPlace(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newAddress">Permanent Address</label>
                  <input
                    type="text"
                    name="newAddress"
                    id="newAddress"
                    value={newAddress}
                    placeholder="Address"
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newCivilStatus">Civil Status</label>
                  <select
                    name="newCivilStatus"
                    id="newCivilStatus"
                    value={newCivilStatus}
                    onChange={(e) => setNewCivilStatus(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                    <option value=""> Select...</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                  <label htmlFor="newBloodType">Blood Type</label>
                  <select
                    name="newBloodType"
                    id="newBloodType"
                    value={newBloodType}
                    onChange={(e) => setNewBloodType(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                    <option value=""> Select...</option>
                    {bloodTypeOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="newPhoneNumber">Contact Number</label>
                  <input
                    type="text"
                    name="newPhoneNumber"
                    id="newPhoneNumber"
                    value={newPhoneNumber}
                    placeholder="Contact Number"
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newLicenseNumber">License Number</label>
                  <input
                    type="text"
                    name="newLicenseNumber"
                    id="newLicenseNumber"
                    value={newLicenseNumber}
                    placeholder="License Number"
                    onChange={(e) => setNewLicenseNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newLicenseExpiration">
                    License Expiration
                  </label>
                  <input
                    type="date"
                    name="newLicenseExpiration"
                    id="newLicenseExpiration"
                    value={newLicenseExpiration}
                    placeholder="License Expiration"
                    onChange={(e) => setNewLicenseExpiration(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newIsActive">Active</label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="newIsActive"
                      id="newIsActiveYes"
                      value="true"
                      checked={newIsActive === true}
                      onChange={(e) =>
                        setNewIsActive(e.target.value === "true")
                      }
                      className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                    />
                    <label htmlFor="newIsActiveYes" className="mr-4">
                      Yes
                    </label>
                    <input
                      type="radio"
                      name="newIsActive"
                      id="newIsActiveNo"
                      value="false"
                      checked={newIsActive === false}
                      onChange={(e) =>
                        setNewIsActive(e.target.value !== "true")
                      }
                      className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                    />
                    <label htmlFor="newIsActiveNo">No</label>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor="newContactRelationship">
                    Relationship to Driver
                  </label>
                  <input
                    type="text"
                    name="newContactRelationship"
                    id="newContactRelationship"
                    value={newContactRelationship}
                    placeholder="Relationship to Driver"
                    onChange={(e) => setNewContactRelationship(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newContactPerson">Contact Person</label>
                  <input
                    type="text"
                    name="newContactPerson"
                    id="newContactPerson"
                    value={newContactPerson}
                    placeholder="Contact Person"
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newContactNumber">Contact Number</label>
                  <input
                    type="text"
                    name="newContactNumber"
                    id="newContactNumber"
                    value={newContactNumber}
                    placeholder="Contact Number"
                    onChange={(e) => setNewContactNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newContactAddress">Permanent Address</label>
                  <input
                    type="text"
                    name="newContactAddress"
                    id="newContactAddress"
                    value={newContactAddress}
                    placeholder="Permanent Address"
                    onChange={(e) => setNewContactAddress(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <div className="col-span-2 w-full flex justify-around">
                    <ImageUploader
                      title="Driver's Photo"
                      setImage={setNewFaceImage}
                      setPreview={setNewFacePreview}
                      preview={newFacePreview}
                    />
                    <ImageUploader
                      title="Driver's Signature"
                      setImage={setNewSignatureImage}
                      setPreview={setNewSignaturePreview}
                      preview={newSignaturePreview}
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            " Driver's Contact Person / In Case of Emergency "
          )
        ) : toggleMoreDetails ? (
          // Personal Information
          <div
            className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
            style={{ gridTemplateColumns: "auto 1fr" }}>
            {currentPageMoreDetailsSection === 1 ? (
              <>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={lastName}
                  placeholder="Last Name"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={firstName}
                  placeholder="First Name"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="middleName">Middle Name</label>
                <div>
                  <input
                    type="text"
                    name="middleName"
                    id="middleName"
                    required
                    value={middleName}
                    placeholder="Middle Name"
                    disabled={!toggleEditDriverInfo}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <input
                    type="checkbox"
                    id="middleNameNone"
                    name="middleNameNone"
                    value="none"
                    disabled={!toggleEditDriverInfo}
                    checked={middleName === ""}
                    onChange={(e) =>
                      setMiddleName(e.target.checked ? "" : "defaultMiddleName")
                    }
                    className="mt-3"
                  />
                  <label htmlFor="middleNameNone"> I have no middle name</label>
                </div>
                <label htmlFor="birthDate">Date of Birth</label>
                <input
                  type="date"
                  name="birthDate"
                  id="birthDate"
                  value={birthDate}
                  placeholder="Birthdate"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="birthPlace">Place of Birth</label>
                <input
                  type="text"
                  name="birthPlace"
                  id="birthPlace"
                  value={birthPlace}
                  placeholder="Address"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="address">Permanent Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={address}
                  placeholder="Address"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="civilStatus">Civil Status</label>
                <select
                  name="civilStatus"
                  id="civilStatus"
                  value={civilStatus}
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setCivilStatus(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                  <option value=""> Select...</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
                <label htmlFor="phoneNumber">Contact Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={phoneNumber}
                  placeholder="Contact Number"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="licenseNumber">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  id="licenseNumber"
                  value={licenseNumber}
                  placeholder="Contact Number"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="licenseExpiration">Date of Birth</label>
                <input
                  type="date"
                  name="licenseExpiration"
                  id="licenseExpiration"
                  value={licenseExpiration}
                  placeholder="Birthdate"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setLicenseExpiration(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="isActive">Active</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    id="isActiveYes"
                    value="true"
                    disabled={!toggleEditDriverInfo}
                    checked={isActive === true}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                  />
                  <label htmlFor="isActiveYes" className="mr-4">
                    Yes
                  </label>
                  <input
                    type="radio"
                    name="issActive"
                    id="isActiveNo"
                    value="false"
                    disabled={!toggleEditDriverInfo}
                    checked={isActive === false}
                    onChange={(e) => setIsActive(e.target.value !== "true")}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                  />
                  <label htmlFor="isActiveNo">No</label>
                </div>
              </>
            ) : (
              <>
                <label htmlFor="contactRelationship">
                  Relationship to Driver
                </label>
                <input
                  type="text"
                  name="contactRelationship"
                  id="contactRelationship"
                  value={contactRelationship}
                  placeholder="Relationship to Drive"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setContactRelationship(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="contactPerson">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  id="contactPerson"
                  value={contactPerson}
                  placeholder="Contact Person"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  id="contactNumber"
                  value={contactNumber}
                  placeholder="Contact Number"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="contactAddress">Permanent Address</label>
                <input
                  type="text"
                  name="contactAddress"
                  id="contactAddress"
                  value={contactAddress}
                  placeholder="Permanent Address"
                  disabled={!toggleEditDriverInfo}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <div className="col-span-2 w-full flex justify-around">
                  <ImageUploader
                    isDisabled={!toggleEditDriverInfo}
                    title="Driver's Photo"
                    setImage={setFaceImage}
                    setPreview={setFacePreview}
                    preview={facePreview}
                  />
                  <ImageUploader
                    isDisabled={!toggleEditDriverInfo}
                    title="Driver's Signature"
                    setImage={setSignatureImage}
                    setPreview={setSignaturePreview}
                    preview={signaturePreview}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          // details
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
                  className="bg-white border-b border-sky-700 hover:bg-sky-100">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {new Date(record.created_at).toLocaleDateString('en-GB')}
                  
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.license_num}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.license_expiration}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.last_name +
                      ", " +
                      record.first_name +
                      (record.middle_name
                        ? " " + record.middle_name.charAt(0) + "."
                        : "") +
                      (record.extension_name
                        ? " " + record.extension_name
                        : "")}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.address}
                  </td>
                  <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                    <button
                      className="bg-sky-200 text-sky-700 py-2 px-5 text-sm rounded-lg"
                      onClick={() => handleViewClick(record.id)}>
                      View
                    </button>
                  </td>
                  <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                    <button
                      className={`${
                        record.is_active ? "bg-green-500" : "bg-red-500"
                      } py-2 px-5 text-white text-sm rounded-lg`}>
                      {record.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!registerPermitView ? (
        <div className="flex justify-end items-center w-full">
          {toggleMoreDetails ? (
            <>
              <div className="flex justify-end items-center w-full">
                <div className="flex select-none gap-4">
                  <button
                    className={`${
                      currentPageMoreDetailsSection === 1
                        ? "border-red-700 bg-red-700 text-white"
                        : "border-sky-700 text-black"
                    } border py-2 px-4 text-sm rounded-lg`}
                    onClick={() => {
                      if (currentPageMoreDetailsSection === 1) {
                        setToggleMoreDetails(false);
                      } else {
                        setCurrentPageMoreDetailsSection(
                          currentPageMoreDetailsSection - 1
                        );
                      }
                    }}>
                    {currentPageMoreDetailsSection === 1 ? "Cancel" : "Back"}
                  </button>
                  <button
                    disabled={currentPageMoreDetailsSection !== 1}
                    className={`${
                      currentPageMoreDetailsSection === 1
                        ? "bg-sky-700 text-white"
                        : "bg-gray-600 text-gray-300"
                    } border py-2 px-4 text-sm rounded-lg`}
                    onClick={() => {
                      if (currentPageMoreDetailsSection === 1) {
                        setCurrentPageMoreDetailsSection(
                          currentPageMoreDetailsSection + 1
                        );
                      } else {
                        // console.log("saved");
                        // handleSubmissionWithoutEvent();
                        // setRegisterPermitView(false);
                      }
                    }}>
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="flex select-none gap-0">
                <button
                  className={`${
                    currentPageDetailsSection === 1
                      ? "text-gray-400"
                      : "text-black"
                  } border border-sky-700 py-2 px-2 text-sm`}
                  onClick={() =>
                    setCurrentPageDetailsSection(currentPageDetailsSection - 1)
                  }
                  disabled={currentPageDetailsSection === 1}>
                  Prev
                </button>
                <input
                  type="number"
                  min="1"
                  max={Math.ceil(numOfEntries / 10)}
                  value={currentPageDetailsSection}
                  onChange={(e) => {
                    const pageNumber = Number(e.target.value);
                    if (
                      pageNumber >= 1 &&
                      pageNumber <= Math.ceil(numOfEntries / 10)
                    ) {
                      setCurrentPageDetailsSection(pageNumber);
                    }
                  }}
                  className="bg-sky-700 text-white border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 text-center text-sm"
                />
                <button
                  className={`${
                    records.length < entriesPerPage
                      ? "text-gray-400"
                      : "text-black"
                  } border border-sky-700 py-1 px-2 text-sm`}
                  onClick={() =>
                    setCurrentPageDetailsSection(currentPageDetailsSection + 1)
                  }
                  disabled={records.length < entriesPerPage}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex justify-end items-center w-full">
          <div className="flex select-none gap-4">
            <button
              className={`${
                currentPageRegister === 1
                  ? "border-red-700 bg-red-700 text-white"
                  : "border-sky-700 text-black"
              } border py-2 px-4 text-sm rounded-lg`}
              onClick={() => {
                if (currentPageRegister === 1) {
                  setRegisterPermitView(false);
                } else {
                  setCurrentPageRegister(currentPageRegister - 1);
                }
              }}>
              {currentPageRegister === 1 ? "Cancel" : "Back"}
            </button>
            <button
              disabled={
                currentPageRegister === 1
                  ? !newLastName ||
                    !newFirstName ||
                    !newBirthDate ||
                    !newBirthPlace ||
                    !newAddress ||
                    !newCivilStatus ||
                    !newBloodType ||
                    !newPhoneNumber ||
                    !newLicenseNumber ||
                    !newLicenseExpiration
                  : !newContactRelationship ||
                    !newContactPerson ||
                    !newContactNumber ||
                    !newContactAddress ||
                    !newFaceImage ||
                    !newSignatureImage
              }
              className={`${
                currentPageRegister === 1
                  ? "border-sky-700 text-black"
                  : "bg-gray-600 border-gray-600 text-white"
              } ${
                currentPageRegister === 1
                  ? !newLastName ||
                    !newFirstName ||
                    !newBirthDate ||
                    !newBirthPlace ||
                    !newAddress ||
                    !newCivilStatus ||
                    !newBloodType ||
                    !newPhoneNumber ||
                    !newLicenseNumber ||
                    !newLicenseExpiration
                    ? "bg-gray-600"
                    : "bg-sky-700"
                  : !newContactRelationship ||
                    !newContactPerson ||
                    !newContactNumber ||
                    !newContactAddress ||
                    !newFaceImage ||
                    !newSignatureImage
                  ? "bg-gray-600"
                  : "bg-sky-700"
              }
            text-white border py-2 px-4 text-sm rounded-lg`}
              onClick={() => {
                if (currentPageRegister === 1) {
                  setCurrentPageRegister(currentPageRegister + 1);
                } else {
                  // console.log("saved");
                  handleSubmissionWithoutEvent();
                  setRegisterPermitView(false);
                }
              }}>
              {currentPageRegister === 1 ? "Next" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversProfile;
