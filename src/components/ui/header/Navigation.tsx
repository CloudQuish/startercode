"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaHamburger } from "react-icons/fa";

const navLinks = [
  {
    title: "Home",
    to: "/",
  },
  {
    title: "How It Works",
    to: "/",
  },
  {
    title: "About Us",
    to: "/",
  },
  {
    title: "Contact",
    to: "/",
  },
];

export default function Navigation() {
  const [activeTab, setActiveTab] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  if (pathname === "/diagram-builder") {
    return null;
  }
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className=" xl:container px-2 md:px-4">
      <nav className="   relative  py-4  pb-10 flex justify-between">
        <div className="flex gap-4 items-center">
          <Image
            src={"/home/logo.png"}
            height={100}
            width={100}
            alt="logo"
            className=" w-6 h-6 md:w-[42px] md:h-[42px]"
          />
          <div className=" text-black">
            <h2 className=" font-semibold">HonestValue</h2>
            <p className=" text-muted-foreground text-xs">Fair Tax Property</p>
          </div>
        </div>

        <div className=" absolute top-4 left-[50%] -translate-x-[50%]">
          <ul className=" lg:flex hidden  items-center bg-primary/10 rounded-full px-3 py-2 relative">
            <div
              className={`${
                (activeTab === 1 && "translate-x-[0px]") ||
                (activeTab === 2 && "translate-x-[90px] w-[138px] ") ||
                (activeTab === 3 && "translate-x-[232px]   w-[108px]") ||
                (activeTab === 4 && "!w-[100px] translate-x-[344px]")
              } !bg-primary absolute !text-[#fff] h-[70%] w-[90px] transition duration-700 rounded-full border-transparent cursor-pointer`}
            ></div>
            <li
              className={`${
                activeTab === 1 && " !text-[#fff]"
              } px-6  z-20 transition duration-300 font-medium rounded-full border-transparent cursor-pointer`}
              onClick={() => setActiveTab(1)}
            >
              Home
            </li>
            <li
              className={`${
                activeTab === 2 && " !text-[#fff]"
              } px-6 py-2  text-black z-20 transition duration-300 rounded-full border-transparent cursor-pointer`}
              onClick={() => setActiveTab(2)}
            >
              How it works
            </li>
            <li
              className={`${
                activeTab === 3 && " !text-[#fff]"
              } px-6 py-2  text-black z-20 transition duration-300 rounded-full border-transparent cursor-pointer`}
              onClick={() => setActiveTab(3)}
            >
              About Us
            </li>
            <li
              className={`${
                activeTab === 4 && " !text-[#fff]"
              } px-6 py-2  text-black z-20 transition duration-300 rounded-full border-transparent cursor-pointer`}
              onClick={() => setActiveTab(4)}
            >
              Contact
            </li>
          </ul>
        </div>
        <div>
          <div className="lg:hidden block relative z-[99999]">
            {isMobileMenuOpen ? (
              <X
                size={40}
                onClick={toggleMobileMenu}
                className="cursor-pointer relative z-[9999]"
              />
            ) : (
              <Menu
                size={40}
                onClick={toggleMobileMenu}
                className="cursor-pointer  relative z-[9999]"
              />
            )}
            {/* <div
              className={`lg:hidden fixed inset-x-0 top-0 bg-white transition-transform duration-500 ${
                isMobileMenuOpen ? "translate-y-20" : "-translate-y-full"
              } z-50 flex flex-col`}
            >
              <ul className="flex flex-col p-4 space-y-4">
                <li
                  className={`${
                    activeTab === 1 ? "bg-primary text-white" : "bg-gray-100"
                  } p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleMobileTabClick(1)}
                >
                  Home
                </li>
                <li
                  className={`${
                    activeTab === 2 ? "bg-primary text-white" : "bg-gray-100"
                  } p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleMobileTabClick(2)}
                >
                  How it works
                </li>
                <li
                  className={`${
                    activeTab === 3 ? "bg-primary text-white" : "bg-gray-100"
                  } p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleMobileTabClick(3)}
                >
                  About Us
                </li>
                <li
                  className={`${
                    activeTab === 4 ? "bg-primary text-white" : "bg-gray-100"
                  } p-3 rounded-lg cursor-pointer`}
                  onClick={() => handleMobileTabClick(4)}
                >
                  Contact
                </li>
              </ul>
            </div> */}
            <div
              className={`fixed inset-0 z-40 transition-all duration-500 ${
                isMobileMenuOpen
                  ? " clip-path-circle-open "
                  : "clip-path-circle-close"
              }   `}
            >
              <ul className=" flex  flex-col  text-black text-muted bg-white gap-12 justify-center items-center h-full text-5xl font-thin">
                {navLinks.map((l, idx) => {
                  return (
                    <li key={idx}>
                      <Link
                        className="relative before:absolute before:h-[2px] text-black before:w-0 hover:before:w-full before:bg-white before:dark:bg-black before:bottom-0 before:transition-all before:duration-300"
                        onClick={() => toggleMobileMenu()}
                        href={l.to}
                      >
                        {l.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* <Menu size={40} className=" self-end lg:hidden block" /> */}
        </div>

        {/* <div className="md:block hidden"></div> */}
      </nav>
    </div>
  );
}
