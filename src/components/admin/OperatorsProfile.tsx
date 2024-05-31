"use client";

import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import {
  MdOutlineChangeHistory,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlinePublishedWithChanges,
  MdOutlineSearch,
  MdOutlineWarning,
} from "react-icons/md";

import { IoMdCloseCircleOutline } from "react-icons/io";
import "react-image-picker-editor/dist/index.css";

import Select from "react-select";

import {
  colorOptions,
  brandMotorCycleOptions,
  associationOptions,
  routes,
} from "../../api/dataValues";

import {
  editOperatorProfileData,
  fetchOperatorProfileByName,
  fetchOperatorProfileData,
  insertOperatorProfileData,
} from "@/api/operatorProfilesData";
import { supabase, supabaseAdmin } from "@/utils/supabase";
import {
  checkVehicleBodyNumber,
  editVehicleOwnershipReportData,
  fetchVehicleOwnershipReportById,
  insertVehicleOwnershipReportData,
} from "@/api/vehicleOwnership";
import ImageUploader from "./ImageUploader";

const OperatorsProfile = () => {
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [currentPageDetailsSection, setCurrentPageDetailsSection] = useState(1);
  const [currentPageMoreDetailsSection, setCurrentPageMoreDetailsSection] =
    useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const entriesPerPage = 10;
  type Record = any;
  type RecordVehicle = any;
  const [records, setRecords] = useState<Record[]>([]);
  const [recordVehicles, setRecordVehicles] = useState<RecordVehicle[]>([]);

  // adding new data record
  const [toggleNewRecordButton, setToggleNewRecordButton] = useState(false);
  const [newOperator, setNewOperator] = useState(false);
  const [registerPermitView, setRegisterPermitView] = useState(false);
  const [registerPermitViewPage, setRegisterPermitViewPage] = useState(1);
  const [currentPageRegister, setCurrentPageRegister] = useState(1);

  // registering new operator
  const [newOperatorId, setNewOperatorId] = useState<number | null>(null);
  const [newDateRegistered, setNewDateRegistered] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [newLastName, setNewLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newMiddleName, setNewMiddleName] = useState("");
  const [newExtensionName, setNewExtensionName] = useState("");
  const [newBirthdate, setNewBirthdate] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCivilStatus, setNewCivilStatus] = useState("");
  const [newIsActive, setNewIsActive] = useState(false);
  const [newContactNum, setNewContactNum] = useState("");

  const [newFaceImage, setNewFaceImage] = useState<File | null>(null);
  const [newFacePreview, setNewFacePreview] = useState<string | null>(null);
  const [newSignatureImage, setNewSignatureImage] = useState<File | null>(null);
  const [newSignaturePreview, setNewSignaturePreview] = useState<string | null>(
    null
  );

  // registering new vehicle
  const [newBodyNumber, setNewBodyNumber] = useState("");
  const [newDateRegisteredVehicle, setNewDateRegisteredVehicle] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [newChassisNumber, setNewChassisNumber] = useState("");
  const [newLTOPlateNumber, setNewLTOPlateNumber] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [newMotorNumber, setNewMotorNumber] = useState("");
  const [newType, setNewType] = useState("");
  const [newVehicleType, setNewVehicleType] = useState("Tricycle");
  const [newAssociation, setNewAssociation] = useState("");

  const options = routes.map((route) => ({
    value: route.zone,
    label: `Zone ${route.zone}`,
  }));

  const [modalUploadImagesOpen, setModalUploadImagesOpen] = useState(false);

  // new images

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [newFrontViewImage, setNewFrontViewImage] = useState<File | null>(null);
  const [newFrontViewPreview, setNewFrontViewPreview] = useState<string | null>(
    null
  );

  const [newLeftSideViewImage, setNewLeftSideViewImage] = useState<File | null>(
    null
  );
  const [newLeftSideViewPreview, setNewLeftSideViewPreview] = useState<
    string | null
  >(null);

  const [newRightSideViewImage, setNewRightSideViewImage] =
    useState<File | null>(null);
  const [newRightSideViewPreview, setNewRightSideViewPreview] = useState<
    string | null
  >(null);

  const [newInsideFrontViewImage, setNewInsideFrontViewImage] =
    useState<File | null>(null);
  const [newInsideFrontViewPreview, setNewInsideFrontViewPreview] = useState<
    string | null
  >(null);

  const [newBackViewImage, setNewBackViewImage] = useState<File | null>(null);
  const [newBackViewPreview, setNewBackViewPreview] = useState<string | null>(
    null
  );

  // useEffect(() => {
  //   const generateBodyNumber = async () => {
  //     let exists = true;
  //     let random4Digits = "";

  //     while (exists) {
  //       const random3Digits = Math.floor(Math.random() * 900) + 100;
  //       random4Digits = "0" + random3Digits;

  //       const response = await checkVehicleBodyNumber(random4Digits);
  //       exists = Boolean(response && response.data && response.data.length > 0);
  //     }

  //     setNewBodyNumber(random4Digits);
  //   };

  //   generateBodyNumber();
  // }, []);

  // displaying data
  const [operatorId, setOperatorId] = useState("");
  const [dateRegistered, setDateRegistered] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [extensionName, setExtensionName] = useState("");
  const [birthDate, setBirthdate] = useState("");
  const [address, setAddress] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [contactNum, setContactNum] = useState("");

  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [signatureImage, setSignatureImage] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const [bodyNumber, setBodyNumber] = useState("");
  const [dateRegisteredVehicle, setDateRegisteredVehicle] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [ltoPlateNumber, setLtoPlateNumber] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [motorNumber, setMotorNumber] = useState("");
  const [type, setType] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [association, setAssociation] = useState("");

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

  // viewing existing data record
  const [toggleMoreDetails, setToggleMoreDetails] = useState(false);

  const headerNames = [
    // "ID",
    "Date Registered",
    "Operator's Name",
    "Contact No.",
    "Address",
    "More Details",
    "Status",
  ];

  const [operators, setOperators] = useState<{ value: any; label: string }[]>(
    []
  );
  const [selectedOperator, setSelectedOperator] = useState<{
    value: any;
    label: string;
  } | null>(null);

  useEffect(() => {
    const fetchOperators = async () => {
      const response = await fetchOperatorProfileByName("");
      if (response && response.data) {
        setOperators(
          response.data.map((operator) => ({
            value: operator.id,
            label:
              `${operator.last_name}, ${operator.first_name}` +
              (operator.middle_name
                ? " " + operator.middle_name.charAt(0) + "."
                : "") +
              (operator.extension_name ? " " + operator.extension_name : ""),
          }))
        );
      }
    };

    fetchOperators();
  }, []);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setToggleNewRecordButton(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const memoizedFetchOperatorProfileData = useCallback(async () => {
    try {
      const response = await fetchOperatorProfileData(
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
  }, [searchValue, entriesPerPage, currentPageDetailsSection, startDate,
    endDate]);

  useEffect(() => {
    memoizedFetchOperatorProfileData();

    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "OperatorProfiles",
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
          table: "OperatorProfiles",
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
          table: "OperatorProfiles",
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
  }, [searchValue, entriesPerPage, currentPageDetailsSection, startDate,
    endDate]);

  const memoizedFetchVehicleOwnershipReportByIDData = useCallback(async () => {
    try {
      const response = await fetchVehicleOwnershipReportById(operatorId);
      setRecordVehicles(response?.data || []);
      // console.log("response?.data", response?.data);
      // setNumOfEntries(response?.count || 1); // This line is not needed unless you have a count property in your data
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [operatorId]);

  useEffect(() => {
    memoizedFetchVehicleOwnershipReportByIDData();

    const channel = supabase
      .channel(`realtime sessions vehicle ownership`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "VehicleOwnershipRecords",
        },
        (payload) => {
          if (payload.new) {
            setRecordVehicles((prevRecord: any) => [
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
          table: "VehicleOwnershipRecords",
        },
        (payload) => {
          if (payload.new) {
            setRecordVehicles((prevRecord: any) =>
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
          table: "VehicleOwnershipRecords",
        },
        (payload) => {
          if (payload.old) {
            setRecordVehicles((prevRecord: any) =>
              prevRecord.filter((record: any) => record.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [operatorId]);

  const handleSubmissionWithoutEvent = () => {
    if (!newOperator) {
      handleInsertExistingOperatorProfile({ preventDefault: () => {} });
    } else {
      handleInsertOperatorsProfile({ preventDefault: () => {} });
    }
  };

  const handleInsertExistingOperatorProfile = async (event: any) => {
    event.preventDefault();

    handleInsertVehicleOwnershipRecord(selectedOperator?.value);
  };

  const handleInsertOperatorsProfile = async (event: any) => {
    event.preventDefault();

    const newRecord = {
      date_registered: newDateRegistered,
      last_name: newLastName,
      first_name: newFirstName,
      middle_name: newMiddleName,
      extension_name: newExtensionName,
      birth_date: newBirthdate,
      address: newAddress,
      civil_status: newCivilStatus,
      contact_num: newContactNum,
      is_active: newIsActive,
    };

    const response = await insertOperatorProfileData(newRecord);

    if (response?.error) {
      console.error("Error inserting new row data:", response.error);
    } else {
      if (response && response.data) {
        const insertedId = response.data[0].id;
        // console.log("Inserted ID:", insertedId);

        const STORAGE_BUCKET_OPERATOR_FACE_PHOTO =
          "assets/operators/face_photo";
        const STORAGE_BUCKET_OPERATOR_SIGNATURE =
          "assets/operators/signature_photo";

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

        await editOperatorProfileData(insertedId, updateRecord);

        handleInsertVehicleOwnershipRecord(insertedId);
      }
    }
  };

  const handleInsertVehicleOwnershipRecord = async (ownerId: any) => {
    const newRecord = {
      operator_id: ownerId,
      body_num: newBodyNumber,
      date_registered: newDateRegisteredVehicle,
      chassis_num: newChassisNumber,
      lto_plate_num: newLTOPlateNumber,
      color_code: newColorCode,
      motor_num: newMotorNumber,
      type: newType,
      vehicle_type: newVehicleType,
      association: newAssociation,
      // zone: newZone?.value,
    };

    const response = await insertVehicleOwnershipReportData(newRecord);

    if (response?.error) {
      console.error("Error inserting new row data:", response.error);
    } else {
      if (response && response.data) {
        const vehicleId = response.data[0].id;

        const STORAGE_BUCKET_OPERATOR_VEHICLE = "assets/operators/vehicles";

        const UPLOAD_FRONT = `vehicle_${ownerId}-${vehicleId}-front.jpeg`;
        const UPLOAD_LEFT = `vehicle_${ownerId}-${vehicleId}-left.jpeg`;
        const UPLOAD_RIGHT = `vehicle_${ownerId}-${vehicleId}-right.jpeg`;
        const UPLOAD_INSIDE = `vehicle_${ownerId}-${vehicleId}-inside.jpeg`;
        const UPLOAD_BACK = `vehicle_${ownerId}-${vehicleId}-back.jpeg`;

        if (
          newFrontViewImage &&
          newLeftSideViewImage &&
          newRightSideViewImage &&
          newInsideFrontViewImage &&
          newBackViewImage
        ) {
          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_FRONT, newFrontViewImage);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_LEFT, newLeftSideViewImage);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_RIGHT, newRightSideViewImage);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_INSIDE, newInsideFrontViewImage);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_BACK, newBackViewImage);
        }

        const updateRecord = {
          front_view_image: UPLOAD_FRONT,
          left_side_view_image: UPLOAD_LEFT,
          right_side_view_image: UPLOAD_RIGHT,
          inside_front_image: UPLOAD_INSIDE,
          back_view_image: UPLOAD_BACK,
        };

        await editVehicleOwnershipReportData(vehicleId, updateRecord);
      }

      setNewDateRegistered(new Date().toISOString().substring(0, 10));
      setNewLastName("");
      setNewFirstName("");
      setNewMiddleName("");
      setNewExtensionName("");
      setNewBirthdate("");
      setNewAddress("");
      setNewCivilStatus("");
      setNewContactNum("");
      setNewIsActive(false);
      setNewFaceImage(null);
      setNewSignatureImage(null);

      setNewOperator(false);
      setNewOperatorId(null);
      setNewBodyNumber("");
      setNewDateRegisteredVehicle(new Date().toISOString().substring(0, 10));
      setNewChassisNumber("");
      setNewLTOPlateNumber("");
      setNewColorCode("");
      setNewMotorNumber("");
      setNewType("");
      setNewVehicleType("");
      setNewAssociation("");
      // setNewZone(null);
      setNewFrontViewImage(null);
      setNewLeftSideViewImage(null);
      setNewRightSideViewImage(null);
      setNewInsideFrontViewImage(null);
      setNewBackViewImage(null);
    }
  };

  // useEffect(() => {
  //   console.log("selectedOperator123", selectedOperator);
  // }, [selectedOperator]);

  // useEffect(() => {
  //   console.log("newOperator", newOperator);
  // }, [newOperator]);

  const handleViewClick = (id: string) => {
    const record = records.find((record) => record.id === id);

    if (record) {
      setOperatorId(id);
      setDateRegistered(record.date_registered);
      setLastName(record.last_name);
      setFirstName(record.first_name);
      setMiddleName(record.middle_name);
      setExtensionName(record.extension_name);
      setBirthdate(record.birth_date);
      setAddress(record.address);
      setCivilStatus(record.civil_status);
      setIsActive(record.is_active);
      setContactNum(record.contact_num);

      const STORAGE_BUCKET_OPERATOR_FACE_PHOTO_VIEW = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/operators/face_photo/`;
      const STORAGE_BUCKET_OPERATOR_SIGNATURE_VIEW = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/operators/signature_photo/`;

      setFacePreview(
        `${STORAGE_BUCKET_OPERATOR_FACE_PHOTO_VIEW}${record.face_photo}`
      );
      setSignaturePreview(
        `${STORAGE_BUCKET_OPERATOR_SIGNATURE_VIEW}${record.signature_photo}`
      );

      setToggleMoreDetails(true);
    }
  };

  const handleSelectedVehicle = (id: string) => {
    const record = recordVehicles.find((record) => record.id === Number(id));

    setSelectedCurrentVehicle(id);

    if (record) {
      // setCurrentVehicleId(id);

      setBodyNumber(record.body_num);
      setDateRegisteredVehicle(record.date_registered);
      setChassisNumber(record.chassis_num);
      setLtoPlateNumber(record.lto_plate_num);
      setColorCode(record.color_code);
      setMotorNumber(record.motor_num);
      setType(record.type);
      setVehicleType(record.vehicle_type);
      setAssociation(record.association);

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

      // setToggleMoreDetails(true);
    }
  };

  // default value for selected vehicle
  useEffect(() => {
    if (recordVehicles.length > 0) {
      handleSelectedVehicle(recordVehicles[0].id.toString());
    }
  }, [operatorId, recordVehicles]);

  // useEffect(() => {
  //   const updatedRecordVehicles = recordVehicles.filter(
  //     (vehicle) => vehicle.operator_id === operatorId
  //   );
  //   console.log("record len vehicle111:", updatedRecordVehicles.length);
  // }, [operatorId]);

  // DATA MANIPUATION (deletion and edit in vehicle ownership)
  const [toggleEditVehicle, setToggleEditVehicle] = useState(false);
  const [toggleDeleteVehicle, setToggleDeleteVehicle] = useState(false);
  // const [currentVehicleId, setCurrentVehicleId] = useState("");
  const [selectedCurrentVehicle, setSelectedCurrentVehicle] = useState("");

  const handleDeleteVehicleOwnershipRecord = async (
    ownerId: string,
    vehicleId: string
  ) => {
    // console.log("ownerId", ownerId);
    // console.log("vehicleId", vehicleId);

    // return;

    if (toggleDeleteVehicle) {
      const response = await supabase
        .from("VehicleOwnershipRecords")
        .delete()
        .eq("id", vehicleId)
        .eq("operator_id", ownerId);

      if (response.error) {
        console.error("Error deleting data:", response.error);
      } else {
        // alert("Record deleted successfully!");
        setToggleDeleteVehicle(false);

        setCurrentPageMoreDetailsSection(1);
        setToggleMoreDetails(false);

        await supabaseAdmin.storage
          .from("assets")
          .remove([
            `operators/vehicles/vehicle_${ownerId}-${vehicleId}-front.jpeg`,
          ]);

        await supabaseAdmin.storage
          .from("assets")
          .remove([
            `operators/vehicles/vehicle_${ownerId}-${vehicleId}-left.jpeg`,
          ]);

        await supabaseAdmin.storage
          .from("assets")
          .remove([
            `operators/vehicles/vehicle_${ownerId}-${vehicleId}-right.jpeg`,
          ]);

        await supabaseAdmin.storage
          .from("assets")
          .remove([
            `operators/vehicles/vehicle_${ownerId}-${vehicleId}-inside.jpeg`,
          ]);

        await supabaseAdmin.storage
          .from("assets")
          .remove([
            `operators/vehicles/vehicle_${ownerId}-${vehicleId}-back.jpeg`,
          ]);
      }
    }
  };
  const deleteOwner = async () => {
    if (operatorId) {
      const updatedRecordVehicles = recordVehicles.filter(
        (vehicle) => vehicle.operator_id === operatorId
      );
      // console.log("record len vehicle111:", updatedRecordVehicles.length);

      if (updatedRecordVehicles.length === 0) {
        const ownerResponse = await supabase
          .from("OperatorProfiles")
          .delete()
          .eq("id", operatorId);

        if (ownerResponse.error) {
          console.error("Error deleting owner:", ownerResponse.error);
        } else {
          alert("Vehicle and Owner deleted successfully!");

          await supabaseAdmin.storage
            .from("assets")
            .remove([`operators/face_photo/face_${operatorId}.jpeg`]);

          await supabaseAdmin.storage
            .from("assets")
            .remove([`operators/signature_photo/signature_${operatorId}.jpeg`]);

          // Update records state as needed
          return; // might face probs
        }
      }
      // alert("Vehicle deleted successfully!");
    }
  };

  useEffect(() => {
    if (toggleDeleteVehicle) {
      const confirmDelete = confirm(
        "Are you sure you want to delete this record?"
      );
      if (confirmDelete) {
        handleDeleteVehicleOwnershipRecord(operatorId, selectedCurrentVehicle);
        deleteOwner();
      }
    }
  }, [toggleDeleteVehicle]);

  const handleEditOperatorsProfile = async (id: string) => {
    // console.log("id", id);
    const record = records.find((record) => record.id === Number(id));
    // console.log("record", record);

    if (record) {
      const updatedRecordOperator = {
        date_registered: dateRegistered,
        last_name: lastName,
        first_name: firstName,
        middle_name: middleName,
        extension_name: extensionName,
        birth_date: birthDate,
        address: address,
        civil_status: civilStatus,
        contact_num: contactNum,
        is_active: isActive,
      };

      try {
        await editOperatorProfileData(id, updatedRecordOperator);

        // images
        const STORAGE_BUCKET_OPERATOR_FACE_PHOTO =
          "assets/operators/face_photo";
        const STORAGE_BUCKET_OPERATOR_SIGNATURE =
          "assets/operators/signature_photo";

        const UPLOAD_FACE_PHOTO = `face_${id}.jpeg`;
        const UPLOAD_SIGNATURE_PHOTO = `signature_${id}.jpeg`;

        if (faceImage) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([`operators/face_photo/face_${id}.jpeg`]);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_FACE_PHOTO)
            .upload(UPLOAD_FACE_PHOTO, faceImage);
        }

        if (signatureImage) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([`operators/signature_photo/signature_${id}.jpeg`]);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_SIGNATURE)
            .upload(UPLOAD_SIGNATURE_PHOTO, signatureImage);
        }

        setToggleEditVehicle(false);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  const handleEditVehicleOwnershipRecord = async (
    ownerId: string,
    vehicleId: string
  ) => {
    const record = recordVehicles.find(
      (record) =>
        record.operator_id === Number(ownerId) &&
        record.id === Number(vehicleId)
    );

    // console.log("record exists?, ", record ? "true" : "false");
    // console.log("vehicleId", vehicleId);
    if (record) {
      const updatedRecordVehicle = {
        date_registered: dateRegisteredVehicle,
        chassis_num: chassisNumber,
        lto_plate_num: ltoPlateNumber,
        color_code: colorCode,
        motor_num: motorNumber,
        type: type,
        vehicle_type: vehicleType,
        association: association,
      };
      // console.log("record: ", record);

      try {
        await editVehicleOwnershipReportData(vehicleId, updatedRecordVehicle);

        // images
        const STORAGE_BUCKET_OPERATOR_VEHICLE = "assets/operators/vehicles";

        const UPLOAD_FRONT = `vehicle_${ownerId}-${vehicleId}-front.jpeg`;
        const UPLOAD_LEFT = `vehicle_${ownerId}-${vehicleId}-left.jpeg`;
        const UPLOAD_RIGHT = `vehicle_${ownerId}-${vehicleId}-right.jpeg`;
        const UPLOAD_INSIDE = `vehicle_${ownerId}-${vehicleId}-inside.jpeg`;
        const UPLOAD_BACK = `vehicle_${ownerId}-${vehicleId}-back.jpeg`;

        if (frontView) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([
              `operators/vehicles/vehicle_${ownerId}-${vehicleId}-front.jpeg`,
            ]);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_FRONT, frontView);
        }

        if (leftSideView) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([
              `operators/vehicles/vehicle_${ownerId}-${vehicleId}-left.jpeg`,
            ]);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_LEFT, leftSideView);
        }

        if (rightSideView) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([
              `operators/vehicles/vehicle_${ownerId}-${vehicleId}-right.jpeg`,
            ]);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_RIGHT, rightSideView);
        }

        if (insideFrontView) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([
              `operators/vehicles/vehicle_${ownerId}-${vehicleId}-inside.jpeg`,
            ]);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_INSIDE, insideFrontView);
        }

        if (backView) {
          await supabaseAdmin.storage
            .from("assets")
            .remove([
              `operators/vehicles/vehicle_${ownerId}-${vehicleId}-back.jpeg`,
            ]);

          await supabase.storage
            .from(STORAGE_BUCKET_OPERATOR_VEHICLE)
            .upload(UPLOAD_BACK, backView);
        }

        setToggleEditVehicle(false);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  useEffect(() => {
    setToggleEditVehicle(false);
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
              ? "List of Operators/Owner"
              : "Register Tricycle Operator's Owner"}
          </h1>
          {!registerPermitView && !toggleMoreDetails && (
            <div className="relative" ref={dropdownRef}>
              <button
                // type="submit"
                type="button"
                className="bg-sky-700 flex text-lg rounded-lg px-5 py-2 text-white"
                onClick={() =>
                  setToggleNewRecordButton(!toggleNewRecordButton)
                }>
                + New
              </button>
              {toggleNewRecordButton && (
                <div className="w-72 absolute mt-1 bg-sky-600 text-white py-2 rounded-lg flex flex-col items-start pl-3">
                  <button
                    className="hover:text-gray-900"
                    onClick={() => {
                      setNewOperator(false);
                      setToggleNewRecordButton(false);
                      setRegisterPermitView(true);
                    }}>
                    Add New for Existing Operator{" "}
                  </button>
                  <button
                    className="hover:text-gray-900"
                    onClick={() => {
                      setNewOperator(true);
                      setToggleNewRecordButton(false);
                      setRegisterPermitView(true);
                    }}>
                    Add New Operator
                  </button>
                </div>
              )}
            </div>
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
                ? "Operator's Profile"
                : "Ownership Vehicle Information"
              : toggleMoreDetails
              ? "More Details of Operator's Profile"
              : "Details"}
          </h1>
          <div className="px-3 flex items-center gap-3">
            {!registerPermitView &&
              toggleMoreDetails &&
              (currentPageMoreDetailsSection === 1 ||
                currentPageMoreDetailsSection === 2) && (
                <>
                  {toggleEditVehicle && (
                    <button
                      className="bg-purple-700 text-white
                    border py-1 px-2 text-sm rounded-lg flex items-center gap-2"
                      onClick={() =>
                        // console.log("current id: ", operatorId)
                        currentPageMoreDetailsSection === 1
                          ? handleEditOperatorsProfile(operatorId)
                          : handleEditVehicleOwnershipRecord(
                              operatorId,
                              selectedCurrentVehicle
                            )
                      }>
                      <MdOutlinePublishedWithChanges />
                      <span>Apply Changes</span>
                    </button>
                  )}
                  <button
                    className={`${
                      toggleEditVehicle
                        ? "bg-sky-700 text-white"
                        : "border-sky-700 text-sky-700"
                    } border py-1 px-2 text-sm rounded-lg flex items-center gap-2`}
                    onClick={() => setToggleEditVehicle(!toggleEditVehicle)}>
                    <MdOutlineEdit />
                    <span>{toggleEditVehicle ? "Cancel" : "Edit"}</span>
                  </button>
                </>
              )}
            {!registerPermitView &&
              toggleMoreDetails &&
              currentPageMoreDetailsSection === 2 && (
                <button
                  className={`border-red-700 text-red-700 
                   border py-1 px-2 text-sm rounded-lg flex items-center gap-2`}
                  onClick={() => setToggleDeleteVehicle(true)}>
                  <MdOutlineDelete />
                  <span>Delete</span>
                </button>
              )}
          </div>
        </div>
        {registerPermitView ? (
          registerPermitViewPage === 1 ? (
            // operator's profile
            <div
              className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
              style={{ gridTemplateColumns: "auto 1fr" }}>
              {currentPageRegister === 1 ? (
                <>
                  {!newOperator ? (
                    <>
                      <label htmlFor="operator" className="mt-[-30rem]">
                        Select Existing Operator
                      </label>
                      <div className="mt-[-30rem]">
                        <Select
                          name="operator"
                          id="operator"
                          value={selectedOperator}
                          onChange={(selectedOption) => {
                            setSelectedOperator(selectedOption);
                            // console.log("selectedOption", selectedOption);
                          }}
                          options={operators}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor="newDateRegistered">Date Registered</label>
                      <input
                        type="date"
                        name="newDateRegistered"
                        id="newDateRegistered"
                        value={newDateRegistered}
                        placeholder="Date Registered"
                        onChange={(e) => setNewDateRegistered(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
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
                      <label htmlFor="newExtensionName">Extension Name</label>
                      <input
                        type="text"
                        name="newExtensionName"
                        id="newExtensionName"
                        value={newExtensionName}
                        placeholder="Extension Name"
                        onChange={(e) => setNewExtensionName(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                      <label htmlFor="newBirthdate">Date of Birth</label>
                      <input
                        type="date"
                        name="newBirthdate"
                        id="newBirthdate"
                        value={newBirthdate}
                        placeholder="Birthdate"
                        onChange={(e) => setNewBirthdate(e.target.value)}
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
                      <label htmlFor="newContactNum">Contact Number</label>
                      <input
                        type="text"
                        name="newContactNum"
                        id="newContactNum"
                        value={newContactNum}
                        placeholder="Contact Number"
                        onChange={(e) => setNewContactNum(e.target.value)}
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
                      {/* <label htmlFor="newFaceImage">Face Image</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="newFaceImage"
                          onChange={(e) =>
                            e.target.files && setNewFaceImage(e.target.files[0])
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div
                          id="fileFaceLabel"
                          className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                          <button className="bg-blue-500 text-white rounded px-2 mr-2">
                            Browse
                          </button>
                          {newFaceImage
                            ? `Selected file: ${newFaceImage.name}`
                            : "No File Chosen"}
                        </div>
                      </div>

                      <label htmlFor="newSignatureImage">Signature Image</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="newSignatureImage"
                          onChange={(e) =>
                            e.target.files &&
                            setNewSignatureImage(e.target.files[0])
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                          id="fileSignatureLabel"
                          className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                          <button className="bg-blue-500 text-white rounded px-2 mr-2">
                            Browse
                          </button>
                          {newSignatureImage
                            ? `Selected file: ${newSignatureImage.name}`
                            : "No File Chosen"}
                        </div>
                      </div> */}
                      <div className="col-span-2 w-full flex justify-around">
                        <ImageUploader
                          title="Face Image"
                          setImage={setNewFaceImage}
                          setPreview={setNewFacePreview}
                          preview={newFacePreview}
                        />
                        <ImageUploader
                          title="Signature Image"
                          setImage={setNewSignatureImage}
                          setPreview={setNewSignaturePreview}
                          preview={newSignaturePreview}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <label htmlFor="newBodyNumber">Body Number</label>
                  <input
                    type="number"
                    name="newBodyNumber"
                    id="newBodyNumber"
                    value={newBodyNumber}
                    placeholder="Body Number"
                    onChange={(e) => setNewBodyNumber(e.target.value)}
                    // disabled
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newDateRegisteredVehicle">
                    Date Registered
                  </label>
                  <input
                    type="date"
                    name="newDateRegisteredVehicle"
                    id="newDateRegisteredVehicle"
                    value={newDateRegisteredVehicle}
                    placeholder="Date Registered"
                    onChange={(e) =>
                      setNewDateRegisteredVehicle(e.target.value)
                    }
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newChassisNumber">Chassis Number</label>
                  <input
                    type="text"
                    name="newChassisNumber"
                    id="newChassisNumber"
                    value={newChassisNumber}
                    placeholder="Chassis Number"
                    onChange={(e) => setNewChassisNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newLTOPlateNumber">LTO Plate Number</label>
                  <input
                    type="text"
                    name="newLTOPlateNumber"
                    id="newLTOPlateNumber"
                    value={newLTOPlateNumber}
                    placeholder="LTO Plate Number"
                    onChange={(e) => setNewLTOPlateNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newColorCode">Color</label>
                  <Select
                    name="newColorCode"
                    id="newColorCode"
                    value={colorOptions.find(
                      (option) => option.value === newColorCode
                    )}
                    onChange={(selectedOption) => {
                      if (selectedOption !== null) {
                        setNewColorCode(selectedOption.value);
                      }
                    }}
                    options={colorOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  <label htmlFor="newMotorNumber">Motor Number</label>
                  <input
                    type="text"
                    name="newMotorNumber"
                    id="newMotorNumber"
                    value={newMotorNumber}
                    placeholder="Motor Number"
                    onChange={(e) => setNewMotorNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newType">Make/Type</label>
                  <Select
                    name="newType"
                    id="newType"
                    value={brandMotorCycleOptions.find(
                      (option) => option.value === newType
                    )}
                    onChange={(selectedOption) => {
                      if (selectedOption !== null) {
                        setNewType(selectedOption.value);
                      }
                    }}
                    options={brandMotorCycleOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  <label htmlFor="newVehicleType">Vehicle Type</label>
                  <input
                    type="text"
                    name="newVehicleType"
                    id="newVehicleType"
                    value={newVehicleType}
                    disabled
                    placeholder="Vehicle Type"
                    onChange={(e) => setNewVehicleType(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newAssociation">Name of Association</label>
                  <Select
                    name="newAssociation"
                    id="newAssociation"
                    value={associationOptions.find(
                      (option) => option.value === newAssociation
                    )}
                    onChange={(selectedOption) => {
                      if (selectedOption !== null) {
                        setNewAssociation(selectedOption.value);
                      }
                    }}
                    options={associationOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  <div className="justify-self-center col-span-2">
                    <button
                      className="border border-sky-700 bg-sky-700 text-white py-2 px-4 text-sm rounded-lg"
                      onClick={() => setModalUploadImagesOpen(true)}>
                      Upload images
                    </button>

                    {modalUploadImagesOpen && (
                      <div
                        className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black`}>
                        <div
                          className={`rounded-2xl bg-white text-black mx-3 py-3 px-5`}>
                          <div className="flex justify-between items-center py-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                              Upload Tricycle Information
                            </h3>
                            <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-right">
                              <button
                                className="text-2xl flex items-center justify-center"
                                onClick={() => setModalUploadImagesOpen(false)}>
                                <IoMdCloseCircleOutline />
                              </button>
                            </div>
                          </div>
                          <div className="rounded-lg border border-sky-700 py-3 px-5 grid grid-cols-3 gap-6">
                            <ImageUploader
                              title="Front View"
                              setImage={setNewFrontViewImage}
                              setPreview={setNewFrontViewPreview}
                              preview={newFrontViewPreview}
                            />
                            <ImageUploader
                              title="Left Side View"
                              setImage={setNewLeftSideViewImage}
                              setPreview={setNewLeftSideViewPreview}
                              preview={newLeftSideViewPreview}
                            />
                            <ImageUploader
                              title="Right Side View"
                              setImage={setNewRightSideViewImage}
                              setPreview={setNewRightSideViewPreview}
                              preview={newRightSideViewPreview}
                            />
                            <ImageUploader
                              title="Inside Front View"
                              setImage={setNewInsideFrontViewImage}
                              setPreview={setNewInsideFrontViewPreview}
                              preview={newInsideFrontViewPreview}
                            />
                            <ImageUploader
                              title="Back View"
                              setImage={setNewBackViewImage}
                              setPreview={setNewBackViewPreview}
                              preview={newBackViewPreview}
                            />
                          </div>
                          <div className="bg-gray-50 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                            <button
                              disabled={
                                !newFrontViewImage ||
                                !newBackViewImage ||
                                !newLeftSideViewImage ||
                                !newRightSideViewImage ||
                                !newInsideFrontViewImage
                              }
                              className={`${
                                !newFrontViewImage ||
                                !newBackViewImage ||
                                !newLeftSideViewImage ||
                                !newRightSideViewImage ||
                                !newInsideFrontViewImage
                                  ? "border-gray-600 bg-gray-600"
                                  : "border-sky-700 bg-sky-700"
                              } text-white border py-2 px-4 text-sm rounded-lg`}
                              onClick={() => {
                                setModalUploadImagesOpen(false);
                                alert("Images uploaded successfully!");
                              }}>
                              Upload
                            </button>
                            <button
                              className="border-red-700 bg-red-700 text-white border py-2 px-4 text-sm rounded-lg"
                              onClick={() => setModalUploadImagesOpen(false)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            "Ownership Vehicle Information"
          )
        ) : toggleMoreDetails ? (
          // More Details of Operator's Profile
          <div
            className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
            style={{ gridTemplateColumns: "auto 1fr" }}>
            {currentPageMoreDetailsSection === 1 ? (
              <>
                <label htmlFor="dateRegistered">Date Registered</label>
                <input
                  type="date"
                  name="dateRegistered"
                  id="dateRegistered"
                  value={new Date(dateRegistered).toISOString().slice(0, 10)}
                  placeholder="Date Registered"
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setDateRegistered(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={lastName}
                  placeholder="Last Name"
                  disabled={!toggleEditVehicle}
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
                  disabled={!toggleEditVehicle}
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
                    disabled={!toggleEditVehicle}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <input
                    type="checkbox"
                    id="middleNameNone"
                    name="middleNameNone"
                    value="none"
                    disabled={!toggleEditVehicle}
                    checked={middleName === ""}
                    onChange={(e) =>
                      setMiddleName(e.target.checked ? "" : "defaultMiddleName")
                    }
                    className="mt-3"
                  />
                  <label htmlFor="middleNameNone"> I have no middle name</label>
                </div>
                <label htmlFor="extensionName">Extension Name</label>
                <input
                  type="text"
                  name="extensionName"
                  id="extensionName"
                  value={extensionName}
                  placeholder="Extension Name"
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setExtensionName(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="birthDate">Date of Birth</label>
                <input
                  type="date"
                  name="birthDate"
                  id="birthDate"
                  value={birthDate}
                  placeholder="Birthdate"
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="address">Permanent Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={address}
                  placeholder="Address"
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="civilStatus">Civil Status</label>
                <select
                  name="civilStatus"
                  id="civilStatus"
                  value={civilStatus}
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setCivilStatus(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                  <option value=""> Select...</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
                <label htmlFor="contactNum">Contact Number</label>
                <input
                  type="text"
                  name="contactNum"
                  id="contactNum"
                  value={contactNum}
                  placeholder="Contact Number"
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setContactNum(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="isActive">Active</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    id="isActiveYes"
                    value="true"
                    disabled={!toggleEditVehicle}
                    checked={isActive === true}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                  />
                  <label htmlFor="isActiveYes" className="mr-4">
                    Yes
                  </label>
                  <input
                    type="radio"
                    name="isActive"
                    id="isActiveNo"
                    value="false"
                    disabled={!toggleEditVehicle}
                    checked={isActive === false}
                    onChange={(e) => setIsActive(e.target.value !== "true")}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                  />
                  <label htmlFor="isActiveYes">No</label>
                </div>
                <div className="col-span-2 w-full flex justify-around">
                  <ImageUploader
                    isDisabled={!toggleEditVehicle}
                    title="Face Image"
                    setImage={setFaceImage}
                    setPreview={setFacePreview}
                    preview={facePreview}
                  />
                  <ImageUploader
                    isDisabled={!toggleEditVehicle}
                    title="Signature Image"
                    setImage={setSignatureImage}
                    setPreview={setSignaturePreview}
                    preview={signaturePreview}
                  />
                </div>
                {toggleEditVehicle && (
                  <h5 className="col-span-2 text-sm text-red-500 italic text-center">
                    Due to processing, changes to the image may not appear
                    instantly
                  </h5>
                )}
              </>
            ) : (
              <>
                <div className="w-full flex justify-end col-span-2">
                  <select
                    name="vehicleSelect"
                    id="vehicleSelect"
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg py-2 px-10"
                    onChange={(event) =>
                      handleSelectedVehicle(event.target.value)
                    }>
                    {recordVehicles.map((vehicle, index) => (
                      <option key={index} value={vehicle.id}>
                        {vehicle.lto_plate_num}
                        {/* chassis_num */}
                      </option>
                    ))}
                  </select>
                </div>
                <label htmlFor="bodyNumber">Body Number</label>
                <input
                  type="number"
                  name="bodyNumber"
                  id="bodyNumber"
                  value={bodyNumber}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="dateRegisteredVehicle">Date Registered</label>
                <input
                  type="date"
                  name="dateRegisteredVehicle"
                  id="dateRegisteredVehicle"
                  value={
                    dateRegisteredVehicle &&
                    !isNaN(new Date(dateRegisteredVehicle).valueOf())
                      ? new Date(dateRegisteredVehicle)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  placeholder="Date Registered"
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setDateRegisteredVehicle(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="chassisNumber">Chassis Number</label>
                <input
                  type="text"
                  name="chassisNumber"
                  id="chassisNumber"
                  value={chassisNumber}
                  placeholder="Chassis Number"
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setChassisNumber(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="ltoPlateNumber">LTO Plate Number</label>
                <input
                  type="text"
                  name="ltoPlateNumber"
                  id="ltoPlateNumber"
                  value={ltoPlateNumber}
                  placeholder="LTO Plate Number"
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setLtoPlateNumber(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="colorCode">Color</label>
                <Select
                  name="colorCode"
                  id="colorCode"
                  value={colorOptions.find(
                    (option) => option.value === colorCode
                  )}
                  onChange={(selectedOption) => {
                    if (selectedOption !== null) {
                      setColorCode(selectedOption.value);
                    }
                  }}
                  isDisabled={!toggleEditVehicle}
                  options={colorOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                <label htmlFor="motorNumber">Motor Number</label>
                <input
                  type="text"
                  name="motorNumber"
                  id="motorNumber"
                  value={motorNumber}
                  placeholder="Motor Number"
                  disabled={!toggleEditVehicle}
                  onChange={(e) => setMotorNumber(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="type">Make/Type</label>
                <Select
                  name="type"
                  id="type"
                  value={brandMotorCycleOptions.find(
                    (option) => option.value === type
                  )}
                  onChange={(selectedOption) => {
                    if (selectedOption !== null) {
                      setType(selectedOption.value);
                    }
                  }}
                  isDisabled={!toggleEditVehicle}
                  options={brandMotorCycleOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                <label htmlFor="vehicleType">Vehicle Type</label>
                <input
                  type="text"
                  name="vehicleType"
                  id="vehicleType"
                  value={vehicleType}
                  disabled
                  placeholder="Vehicle Type"
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="newAssociation">Name of Association</label>
                <Select
                  name="association"
                  id="association"
                  value={associationOptions.find(
                    (option) => option.value === association
                  )}
                  onChange={(selectedOption) => {
                    if (selectedOption !== null) {
                      setAssociation(selectedOption.value);
                    }
                  }}
                  isDisabled={!toggleEditVehicle}
                  options={associationOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                <div className="justify-self-center col-span-2">
                  <button
                    className="border border-sky-700 bg-sky-700 text-white py-2 px-4 text-sm rounded-lg"
                    onClick={() => setModalUploadImagesOpen(true)}>
                    Vehicle Images
                  </button>

                  {modalUploadImagesOpen && (
                    <div
                      className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black`}>
                      <div
                        className={`rounded-2xl bg-white text-black mx-3 py-3 px-5`}>
                        <div className="flex justify-between items-center py-3">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Upload Tricycle Information
                          </h3>
                          <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-right">
                            <button
                              className="text-2xl flex items-center justify-center"
                              onClick={() => setModalUploadImagesOpen(false)}>
                              <IoMdCloseCircleOutline />
                            </button>
                          </div>
                        </div>
                        <div className="rounded-lg border border-sky-700 py-3 px-5 grid grid-cols-3 gap-6">
                          <ImageUploader
                            isDisabled={!toggleEditVehicle}
                            title="Front View"
                            setImage={setFrontView}
                            setPreview={setFrontViewPreview}
                            preview={frontViewPreview}
                          />
                          <ImageUploader
                            isDisabled={!toggleEditVehicle}
                            title="Left Side View"
                            setImage={setLeftSideView}
                            setPreview={setLeftSideViewPreview}
                            preview={leftSideViewPreview}
                          />
                          <ImageUploader
                            isDisabled={!toggleEditVehicle}
                            title="Right Side View"
                            setImage={setRightSideView}
                            setPreview={setRightSideViewPreview}
                            preview={rightSideViewPreview}
                          />
                          <ImageUploader
                            isDisabled={!toggleEditVehicle}
                            title="Inside Front View"
                            setImage={setInsideFrontView}
                            setPreview={setInsideFrontViewPreview}
                            preview={insideFrontViewPreview}
                          />
                          <ImageUploader
                            isDisabled={!toggleEditVehicle}
                            title="Back View"
                            setImage={setBackView}
                            setPreview={setBackViewPreview}
                            preview={backViewPreview}
                          />
                        </div>
                        <div className="bg-gray-50 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                          <button
                            className="border-sky-700 bg-sky-700 text-white border py-2 px-4 text-sm rounded-lg"
                            onClick={() => setModalUploadImagesOpen(false)}>
                            Okay
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                  {/* <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.id}
                  </td> */}

                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(record.date_registered).toLocaleDateString()}
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
                    {record.contact_num}
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
                  if (window.confirm("Are you sure you want to leave?")) {
                    setRegisterPermitView(false);
                  }
                } else {
                  setCurrentPageRegister(currentPageRegister - 1);
                }
              }}>
              {currentPageRegister === 1 ? "Cancel" : "Back"}
            </button>
            <button
              disabled={
                currentPageRegister === 1
                  ? (!newOperator && !selectedOperator) ||
                    (newOperator &&
                      (!newDateRegistered ||
                        !newLastName ||
                        !newFirstName ||
                        !newBirthdate ||
                        !newAddress ||
                        !newCivilStatus ||
                        !newContactNum ||
                        !newFaceImage ||
                        !newSignatureImage))
                  : currentPageRegister === 2
                  ? (newOperator && !newDateRegisteredVehicle) ||
                    newBodyNumber.length < 4 ||
                    // !newOperatorId ||
                    !newChassisNumber ||
                    !newLTOPlateNumber ||
                    !newColorCode ||
                    !newMotorNumber ||
                    !newType ||
                    !newVehicleType ||
                    !newFrontViewImage ||
                    !newLeftSideViewImage ||
                    !newRightSideViewImage ||
                    !newInsideFrontViewImage ||
                    !newBackViewImage
                  : false
              }
              className={`${
                currentPageRegister === 1
                  ? "border-sky-700 text-black"
                  : "bg-gray-600 border-gray-600 text-white"
              } ${
                currentPageRegister === 1
                  ? (!newOperator && !selectedOperator) ||
                    (newOperator &&
                      (!newDateRegistered ||
                        !newLastName ||
                        !newFirstName ||
                        !newBirthdate ||
                        !newAddress ||
                        !newCivilStatus ||
                        !newContactNum ||
                        !newFaceImage ||
                        !newSignatureImage))
                    ? "bg-gray-600"
                    : "bg-sky-700"
                  : currentPageRegister === 2
                  ? (newOperator && !newDateRegisteredVehicle) ||
                    newBodyNumber.length < 4 ||
                    // !newOperatorId ||
                    !newChassisNumber ||
                    !newLTOPlateNumber ||
                    !newColorCode ||
                    !newMotorNumber ||
                    !newType ||
                    !newVehicleType ||
                    !newFrontViewImage ||
                    !newLeftSideViewImage ||
                    !newRightSideViewImage ||
                    !newInsideFrontViewImage ||
                    !newBackViewImage
                    ? "bg-gray-600"
                    : "bg-sky-700"
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

export default OperatorsProfile;
