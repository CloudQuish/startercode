"use client";

import { useEffect, useState } from "react";

import { cn } from "@/utils/utils";
import Sidebar from "@/components/core-components/Sidebar";
import Toolbar from "@/components/core-components/Toolbar";
import DiagramCanvas from "@/components/core-components/DiagramCanvas";

const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 1000) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen  bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-grow">
        <Toolbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div
          className={cn(
            "flex-grow transition-all duration-300 ease-in-out",
            isSidebarOpen ? "ml-0" : "ml-0"
          )}
        >
          <DiagramCanvas />
        </div>
      </div>
    </div>
  );
};
export default MainPage;
