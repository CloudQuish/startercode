"use client";
import { Handle, Position } from "@xyflow/react";
import React, { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PenBox, X } from "lucide-react";
import { useDiagramContext } from "@/providers/DiagramProvider";
import EditTable from "./EditTable";

type TColumn = {
  name: string;
  dataType: string;
  constraint: string;
};

export default function CustomBox({ data, id }: { data: any; id: string }) {
  const { deleteNode, handleEditId } = useDiagramContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="  border rounded-xl text-start text-black bg-gray-50">
      {/* Table Header */}
      <div className="mb-2 group flex justify-between items-center text-lg p-2 rounded-t-xl font-bold bg-gray-300">
        {data.tableName}
        <div className=" flex gap-2 items-center">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditId(id);
                }}
                className=" text-white bg-green-700 p-1 rounded-full group-hover:block hidden"
              >
                {" "}
                <PenBox size={10} />
              </div>
            </SheetTrigger>
            <SheetContent className="  w-[500px] ">
              <SheetHeader>
                <SheetTitle>Configure Nodes</SheetTitle>
                <SheetDescription>Edit the node</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4 ">
                <EditTable
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              </div>
            </SheetContent>
          </Sheet>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className=" text-white bg-destructive p-1 rounded-full group-hover:block hidden"
              >
                {" "}
                <X size={10} />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteNode(id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=" capitalize">Column Name </TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Constraint</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.columns.map((c: TColumn, idx: number) => (
            <TableRow key={idx} className=" text-xs">
              <TableCell className="capitalize">{c.name}</TableCell>
              <TableCell>{c.dataType}</TableCell>
              <TableCell>{c.constraint}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Handles for connections */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
