"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", icon: "🏠" },
  { label: "How It Works", icon: "🔍" },
  { label: "About Us", icon: "ℹ️" },
  { label: "Contact", icon: "📞" },
];

const Navbar: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState<string>(navItems[0].label);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <nav
      className="flex justify-between items-center h-[110px] px-6 sm:px-12 lg:px-24 bg-white"
      aria-label="Main Navigation"
    >
      <div className="w-[1120px] flex justify-between">
        <Image
          src="/images/logo.png"
          alt="Company logo"
          width={162}
          height={44}
          className="w-[162px] h-[44px]"
        />

        {/* Desktop Screen (Unchanged) */}
        <div
          className="hidden lg:flex bg-[#036775]/10 rounded-[100px] h-[47px] items-center justify-between w-[502px] px-4"
          role="navigation"
        >
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveNavItem(item.label)}
              className={`h-[35px] min-w-[77px] ${
                item.label === activeNavItem
                  ? "bg-[#01414A] text-white"
                  : "text-black"
              } rounded-[100px] flex items-center justify-center px-4 cursor-pointer`}
              role="link"
              aria-current={item.label === activeNavItem ? "page" : undefined}
              tabIndex={0}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu Trigger */}
      <button
        className="block lg:hidden focus:outline-none z-50 relative"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? (
          <X className="text-[#01414A] w-6 h-6" />
        ) : (
          <Menu className="text-[#01414A] w-6 h-6" />
        )}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-40 overflow-hidden"
            id="mobile-menu"
            role="menu"
            aria-hidden={!isMenuOpen}
          >
            <div className="relative h-full flex flex-col">
              {/* Decorative Background */}
              <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#01414A] rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#036775] rounded-full"></div>
              </div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-6">
                  <Image
                    src="/images/logo.png"
                    alt="Company logo"
                    width={120}
                    height={32}
                    className="w-[120px] h-[32px]"
                  />
                </div>

                {/* Navigation Items */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  className="flex-grow flex flex-col justify-center space-y-6 px-6"
                >
                  {navItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.1 },
                      }}
                      onClick={() => {
                        setActiveNavItem(item.label);
                        toggleMenu();
                      }}
                      className={`
                        flex items-center space-x-4 p-4 rounded-xl 
                        transition-all duration-300 group
                        ${
                          item.label === activeNavItem
                            ? "bg-[#01414A] text-white"
                            : "text-[#01414A] hover:bg-[#01414A]/10"
                        }
                        cursor-pointer`}
                      role="menuitem"
                      aria-label={item.label}
                      tabIndex={0}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xl font-medium group-hover:translate-x-2 transition-transform">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Footer */}
                <div className="p-6 text-center">
                  <motion.a
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.4 },
                    }}
                    href="#contact"
                    className="
                      inline-block bg-[#01414A] text-white 
                      px-8 py-4 rounded-full text-lg font-semibold 
                      hover:bg-[#036775] transition-colors 
                      shadow-lg hover:shadow-xl"
                    role="link"
                    aria-label="Connect with us"
                  >
                    Connect With Us
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
