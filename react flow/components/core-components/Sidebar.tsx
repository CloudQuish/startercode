"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, List, Grid, TableOfContents } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TableList from "../../app/(landing)/components/TableList";
import TableListView from "../../app/(landing)/components/TableListView";
import { toast } from "@/hooks/use-toast";
import { useDiagram } from "../../providers/DiagramContext";
import RelationshipList from "@/app/(landing)/components/RelationshipList";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { addTable } = useDiagram();
  const [newTableName, setNewTableName] = useState("");
  const [view, setView] = useState<"diagram" | "list">("diagram");

  const { tables } = useDiagram();

  const isTableNameDuplicate = (name: string) => {
    const duplicate = tables?.some(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );
    console.log({ name, tables, duplicate });
    return duplicate;
  };

  const handleAddTable = () => {
    if (isTableNameDuplicate(newTableName)) {
      toast({
        title: "Table name already exists",
        description: `A table named "${newTableName}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    if (newTableName) {
      addTable({ name: newTableName, columns: [] });
      setNewTableName("");
      toast({
        title: "Table Added",
        description: `Table "${newTableName}" has been created.`,
      });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.div
        className={`fixed lg:relative bg-background border-r h-full overflow-hidden flex flex-col z-40
          w-[280px] sm:w-[320px] transform transition-transform duration-300 ease-in-out
          ${!isOpen && "-translate-x-full lg:translate-x-0"}`}
        initial={{ width: isOpen ? 320 : 0 }}
        animate={{ width: isOpen ? 320 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-bold">Database Diagram</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              <ChevronLeft size={20} />
            </Button>
          </div>
        </div>

        <div className="p-4 border-b">
          <Label htmlFor="new-table" className="mb-2 block">
            New Table
          </Label>
          <div className="flex space-x-2">
            <Input
              id="new-table"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Enter table name"
              className="flex-1"
            />
            <Button onClick={handleAddTable} size="icon">
              <Plus size={20} />
            </Button>
          </div>
        </div>

        <div className="p-4 border-b">
          <div className="flex space-x-2">
            <Button
              variant={view === "diagram" ? "default" : "outline"}
              onClick={() => setView("diagram")}
              className="flex-1 h-10"
            >
              <Grid size={20} className="mr-2 hidden sm:inline-block" />
              <span>Diagram</span>
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
              className="flex-1 h-10"
            >
              <List size={20} className="mr-2 hidden sm:inline-block" />
              <span>List</span>
            </Button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {view === "diagram" ? (
            <div className="p-4 space-y-4">
              <TableList />
              <RelationshipList />
            </div>
          ) : (
            <TableListView />
          )}
        </div>
      </motion.div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed  left-1 md:left-4    top-1 p-2 rounded-md bg-background border shadow-md  z-20
          ${isOpen ? "hidden" : "flex items-center justify-center"}`}
        aria-label="Open sidebar"
      >
        <TableOfContents size={20} />
      </button>
    </>
  );
};

export default Sidebar;
