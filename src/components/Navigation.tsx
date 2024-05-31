"use client";

import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface NavigationProps {
  children: ReactNode;
}

const Navigation = ({ children }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <section className="flex w-screen overflow-x-hidden h-[100dvh] bg-gray-200">
      <div className="fixed left-0 md:static z-50">
        <Sidebar isMenuOpen={isMenuOpen} handleMenuClick={handleMenuClick} />
      </div>
      <div className="w-full h-[93dvh] px-5 z-0">
        <Topbar isMenuOpen={isMenuOpen} handleMenuClick={handleMenuClick} />
        {children}
      </div>
    </section>
  );
};
export default Navigation;
