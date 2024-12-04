"use client";
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { IColumn, ITable } from "@/interfaces/context-interface";
import { useDiagram } from "../../../providers/DiagramContext";
import { PencilIcon, KeyIcon } from "lucide-react";

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
      className="bg-card text-card-foreground rounded-lg shadow-lg p-4 min-w-[250px] border border-primary/10 relative"
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-primary/20">
        <h3 className="font-bold text-lg flex-grow">{table.name}</h3>
        <button
          onClick={handleEditClick}
          className="text-primary/70 hover:text-primary transition-colors duration-200 rounded-full p-1 hover:bg-primary/10 focus:outline-none"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {table.columns.map((column: IColumn) => (
          <div
            key={column.id}
            className="flex items-center justify-between text-sm relative"
          >
            <div className="flex items-center space-x-2">
              {column.isPrimaryKey && (
                <KeyIcon className="w-3 h-3 text-primary/50" />
              )}
              <span
                className={`font-medium ${
                  column.isPrimaryKey ? "text-primary" : ""
                }`}
              >
                {column.name}
              </span>
            </div>
            <span className="text-muted-foreground text-xs">{column.type}</span>

            <Handle
              type="target"
              position={Position.Left}
              id={`${table.id}-${column.id}-target`}
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary/50 rounded-full hover:bg-primary"
            />
            <Handle
              type="source"
              position={Position.Right}
              id={`${table.id}-${column.id}-source`}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary/50 rounded-full hover:bg-primary"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default memo(TableNode);
