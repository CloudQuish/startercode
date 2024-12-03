"use client";
import React from "react";
import { Button } from "../ui/button";
import { Redo2, Undo2 } from "lucide-react";
import { useDiagramContext } from "@/providers/DiagramProvider";

export default function Toolbar() {
  const { undo, redo, canUndo, canRedo } = useDiagramContext();
  return (
    <div>
      <div className="relative z-50 flex space-x-2 text-black p-2 bg-gray-100 rounded-md">
        <Button
          onClick={() => undo()}
          disabled={!canUndo}
          variant="outline"
          size="icon"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => redo()}
          disabled={!canRedo}
          variant="outline"
          size="icon"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
