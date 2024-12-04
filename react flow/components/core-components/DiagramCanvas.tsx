"use client";

import React from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDiagram } from "../../providers/DiagramContext";
import TableNode from "../../app/(landing)/components/TableNode";
import { motion } from "framer-motion";

const nodeTypes = {
  tableNode: TableNode,
};

const DiagramCanvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useDiagram();

  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ReactFlow
        nodes={nodes as any}
        edges={edges as any}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        attributionPosition="bottom-left"
      >
        <Controls
          className="
                   text-black "
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        <MiniMap
          className="dark:bg-gray-600 bg-gray-600 dark:mask-gray-900 mask-white "
          nodeColor={(node) => {
            switch (node.type) {
              case "input":
                return "var(--tw-color-blue-500)";
              case "default":
                return "var(--tw-color-gray-500)";
              case "output":
                return "var(--tw-color-green-500)";
              default:
                return "var(--tw-color-black)";
            }
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </motion.div>
  );
};

export default DiagramCanvas;
