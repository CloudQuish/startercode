"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { IColumn, ITable } from "@/interfaces/context-interface";
import { useDiagram } from "../../../providers/DiagramContext"; // Assuming useDiagram context is imported
import { PencilIcon } from "lucide-react";

type TableNodeProps = {
  data: { table: ITable };
};

const TableNode = ({ data }: TableNodeProps) => {
  const { table } = data;
  const { setSelectedTable } = useDiagram();

  const handleEditClick = () => {
    setSelectedTable(table.id);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-card text-card-foreground rounded-lg shadow-lg p-4 min-w-[200px]"
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-primary/20">
        <h3 className="font-semibold text-lg flex-grow text-center">
          {table.name}
        </h3>
        <button
          onClick={handleEditClick}
          className="text-primary/70 hover:text-primary transition-colors duration-200 rounded-full p-1 hover:bg-primary/10 focus:outline-none"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      </div>
      <ul className="space-y-1">
        {table.columns.map((column: IColumn) => (
          <li
            key={column.id}
            className="flex items-center justify-between text-sm"
          >
            <span
              className={`font-medium ${
                column.isPrimaryKey ? "text-primary" : ""
              }`}
            >
              {column.name}
            </span>
            <span className="text-muted-foreground text-xs">{column.type}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={`${table.id}-${column.id}`}
              className="w-3 h-3 bg-primary"
            />
            <Handle
              type="target"
              position={Position.Left}
              id={`${table.id}-${column.id}`}
              className="w-3 h-3 bg-primary"
            />
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default memo(TableNode);
