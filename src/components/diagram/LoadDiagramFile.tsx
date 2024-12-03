"use client";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDiagramContext } from "@/providers/DiagramProvider";
import toast from "react-hot-toast";

export default function LoadDiagramFile({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { nodes, setNodes, setEdges, updateHistory } = useDiagramContext();

  const handleImportDiagram = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileContent = await file.text();
    try {
      const parsedData = JSON.parse(fileContent);

      setNodes(parsedData.nodes);
      setEdges(parsedData.edges);
      // Update history and localStorage
      updateHistory(parsedData.nodes, parsedData.edges);
      setSidebarOpen(false);
      toast.success("File Imported Successfully!");
    } catch (error) {
      console.error("Invalid JSON file:", error);
    }
  };

  return (
    <div>
      <div className="flex gap-2 ">
        <Input
          type="file"
          accept="application/json"
          onChange={handleImportDiagram}
          className="file-input"
        />
      </div>
    </div>
  );
}
