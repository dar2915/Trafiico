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

const Content = () => {
  const router = useRouter();
  const path = usePathname();

  let activeComponent, activePath;

  switch (path) {
    case "/personnel/dashboard/dashboard":
      activePath = "Dashboard";
      activeComponent = <Overview />;
      break;
    case "/personnel/dashboard/operators":
      activePath = "Operator's Profile";
      activeComponent = <OperatorsProfile />;
      break;
    case "/personnel/dashboard/drivers":
      activePath = "Driver's Profile";
      activeComponent = <DriversProfile />;
      break;
    case "/personnel/dashboard/application":
      activePath = "Application";
      activeComponent = <Application />;
      break;
    case "/personnel/dashboard/violations":
      activePath = "Violations Record";
      activeComponent = <ViolationsRecord />;
      break;
    case "/personnel/dashboard/tricycle-driver":
      activePath = "Tricycle Driver's Violation";
      activeComponent = <TricycleDriverViolation />;
      break;
    case "/personnel/dashboard/tricycle-qr":
      activePath = "Tricycle Generated QR Code";
      activeComponent = <TricycleQrCode />;
      break;
    default:
      activeComponent = null;
  }

  return (
    <div
      className={`${
        path === "/personnel/dashboard/dashboard"
          ? ""
          : "rounded-3xl bg-white shadow-lg py-6 px-6"
      }  font-RobotoCondensed overflow-x-hidden h-full`}>
      <div className="  ">{activeComponent}</div>
    </div>
  );
};

export default Content;
