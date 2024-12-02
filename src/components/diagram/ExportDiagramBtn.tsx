"use client";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDiagramContext } from "@/providers/DiagramProvider";
import toast from "react-hot-toast";

export default function ExportDiagramBtn({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { nodes, edges } = useDiagramContext();
  const handleExportDiagram = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagram.json";
    link.click();
    setSidebarOpen(false);
    toast.success("File downloaded Successfully!");
    URL.revokeObjectURL(url);
  };
  return (
    <div>
      <div className="flex w-full gap-2 ">
        <Button className="w-full" onClick={handleExportDiagram}>
          Export Diagram
        </Button>
      </div>
    </div>
  );
}
