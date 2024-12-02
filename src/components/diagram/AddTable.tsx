import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDiagramContext } from "@/providers/DiagramProvider";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, X } from "lucide-react";
import ExportDiagramBtn from "./ExportDiagramBtn";
import LoadDiagramFile from "./LoadDiagramFile";
import toast from "react-hot-toast";
export default function AddTable({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { addNewTable } = useDiagramContext();
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([
    { id: 1, name: "", dataType: "", constraint: "" },
    { id: 2, name: "", dataType: "", constraint: "" },
    { id: 3, name: "", dataType: "", constraint: "" },
  ]);

  const handleAddTable = () => {
    if (tableName) {
      addNewTable({ tableName, columnsData: columns });
      setTableName("");
      setColumns([
        { id: 1, name: "", dataType: "", constraint: "" },
        { id: 2, name: "", dataType: "", constraint: "" },
        { id: 3, name: "", dataType: "", constraint: "" },
      ]);

      toast.success("Table added successfully!");
      setSidebarOpen(false);
    }
  };
  const handleColumnChange = (id: number, field: string, value: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === id ? { ...col, [field]: value } : col
      )
    );
  };

  const handleDeleteColumn = (id: number) => {
    setColumns((prevColumns) => prevColumns.filter((col) => col.id !== id));
  };
  const handleAddColumn = () => {
    setColumns((prevColumns) => [
      ...prevColumns,
      { id: prevColumns.length + 1, name: "", dataType: "", constraint: "" },
    ]);
  };

  return (
    <div className=" flex flex-col justify-between w-full  h-[80vh]   overflow-auto  px-2">
      <section className=" flex flex-col gap-10">
        <div>
          <Label htmlFor="newTableName">New Table Name</Label>
          <Input
            className="outline-none"
            id="newTableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Enter table name"
          />
        </div>
        <div>
          <div className=" ">
            <div className=" flex justify-between items-center">
              <h3 className="text-lg font-semibold mb-2">Columns</h3>
              <button
                onClick={handleAddColumn}
                className=" p-2 rounded-full bg-primary text-white"
              >
                <Plus size={16} />
              </button>
            </div>
            <Table className=" overflow-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="">Column Name</TableHead>
                  <TableHead>Data type</TableHead>
                  <TableHead>Constraint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns.map((column, idx) => (
                  <TableRow key={column.id}>
                    <TableCell className="font-medium">
                      <input
                        type="text"
                        className=" w-24 outline-none bg-gray-100"
                        value={column.name}
                        onChange={(e) =>
                          handleColumnChange(column.id, "name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className=" w-24 outline-none bg-gray-100"
                        value={column.dataType}
                        onChange={(e) =>
                          handleColumnChange(
                            column.id,
                            "dataType",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className=" w-24 outline-none bg-gray-100"
                        value={column.constraint}
                        onChange={(e) =>
                          handleColumnChange(
                            column.id,
                            "constraint",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        onClick={() => handleDeleteColumn(column.id)}
                        className=" cursor-pointer  h-6 w-6 flex-shrink-0 flex items-center justify-center bg-destructive rounded-full text-white"
                      >
                        <X size={16} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button onClick={handleAddTable} className="w-full mt-4">
            Add
          </Button>
        </div>
      </section>

      <div className=" flex flex-col gap-4">
        <div>
          <small className=" text-muted-foreground">
            Load your previous file.
          </small>

          <LoadDiagramFile
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        <div>
          <small className=" text-muted-foreground">
            Export your diagram for future use.
          </small>

          <ExportDiagramBtn
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>
    </div>
  );
}
