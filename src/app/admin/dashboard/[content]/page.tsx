"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import Overview from "@/components/admin/Overview";
import OperatorsProfile from "@/components/admin/OperatorsProfile";
import DriversProfile from "@/components/admin/DriversProfile";
import Application from "@/components/admin/Application";
import ViolationsRecord from "@/components/admin/ViolationsRecord";
import TricycleDriverViolation from "@/components/admin/TricycleDriverViolation";
import TricycleQrCode from "@/components/admin/TricycleQrCode";
import Approval from "@/components/admin/Approval";
import Users from "@/components/admin/Users";
import SettingsComponent from "@/components/Settings";

const Content = () => {
  const router = useRouter();
  const path = usePathname();

  let activeComponent, activePath;

  switch (path) {
    case "/admin/dashboard/dashboard":
      activePath = "Dashboardboardsdsadsa";
      activeComponent = <Overview />;
      break;
    case "/admin/dashboard/approval":
      activePath = "Approval";
      activeComponent = <Approval />;
      break;
    case "/admin/dashboard/operators":
      activePath = "Operator's Profile";
      activeComponent = <OperatorsProfile />;
      break;
    case "/admin/dashboard/drivers":
      activePath = "Driver's Profile";
      activeComponent = <DriversProfile />;
      break;
    case "/admin/dashboard/application":
      activePath = "Application";
      activeComponent = <Application />;
      break;
    case "/admin/dashboard/violations":
      activePath = "Violations Record";
      activeComponent = <ViolationsRecord />;
      break;
    case "/admin/dashboard/tricycle-driver":
      activePath = "Tricycle Driver's Violation";
      activeComponent = <TricycleDriverViolation />;
      break;
    case "/admin/dashboard/tricycle-qr":
      activePath = "Tricycle Generated QR Code";
      activeComponent = <TricycleQrCode />;
      break;
    case "/admin/dashboard/users":
      activePath = "Users List";
      activeComponent = <Users />;
      break;
    case "/admin/dashboard/settings":
      activePath = "Settings";
      activeComponent = <SettingsComponent />;
      break;
    default:
      activeComponent = null;
  }

  return (
    <div
      className={`${
        path === "/admin/dashboard/dashboard"
          ? ""
          : "rounded-3xl bg-white shadow-lg py-6 px-6"
      }  font-RobotoCondensed overflow-x-hidden h-full`}>
      {/* <h1 className="mb-10 font-bold text-3xl">{activePath}</h1> */}
      <div className="  ">{activeComponent}</div>
    </div>
  );
};

export default Content;
