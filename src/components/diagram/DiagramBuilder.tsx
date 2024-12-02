"use client";
import React, { useCallback, useEffect, useState } from "react";

// import { Label } from "@/components/ui/label";
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
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  useNodesState,
  useEdgesState,
  Controls,
  Connection,
  addEdge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomBox from "./CustomBox";
import { Menu, Plus } from "lucide-react";
import AddTable from "./AddTable";
import { useDiagramContext } from "@/providers/DiagramProvider";
import Toolbar from "./Toolbar";

const nodeTypes = {
  custom: CustomBox,
};

export default function DiagramBuilder() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    nodes: allNodes,
    edges: allEdges,
    setNodes,
    setEdges,
    updateHistory,
  } = useDiagramContext();
  console.log("Context ko Nodes:", allNodes);
  //   const [nodes, setNodes, onNodeChange] = useNodesState(allNodes);
  //   const [edges, setEdges, onEdgeChange] = useEdgesState(initialEdges);

  //   const onNodeChange = useCallback(
  //     (changes: any) => {
  //       setNodes((nds) => {
  //         const newNodes = applyNodeChanges(changes, nds);
  //         updateHistory(newNodes, allEdges); // Update history with current state
  //         return newNodes;
  //       });
  //       //   setNodes((nds) => applyNodeChanges(changes, nds));
  //     },
  //     [setNodes, allEdges, updateHistory]
  //   );
  const onNodeChange = useCallback(
    (changes: any) => {
      setNodes((nds) => applyNodeChanges(changes, nds)); // Update nodes without history tracking
    },
    [setNodes]
  );

  const onEdgeChange = useCallback(
    (changes: any) => {
      setEdges((eds) => {
        const newEdges = applyEdgeChanges(changes, eds);
        updateHistory(allNodes, newEdges); // Update history with current state
        return newEdges;
      });
    },
    [setEdges, allNodes, updateHistory]
  );

  //   useEffect(() => {
  //     setNodes(allNodes);
  //   }, [nodes]);

  const onConnect = useCallback(
    (connections: Connection) => {
      setEdges((prevEdges) => {
        const newEdges = addEdge({ ...connections, animated: true }, prevEdges);
        updateHistory(allNodes, newEdges); // Update the history with the new edges
        return newEdges;
      });
    },
    [setEdges, allNodes, updateHistory]
  );

  return (
    <div>
      <section className="relative min-h-screen h-[calc(100vh-100px)] w-full border-4  bg-white  ">
        <div className=" absolute right-0">
          <Toolbar />
        </div>
        <ReactFlow
          nodes={allNodes}
          edges={allEdges}
          onNodesChange={onNodeChange}
          onEdgesChange={onEdgeChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Panel position="top-left">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <button
                  //   onClick={addNewTable}
                  className="bg-primary  rounded-full text-white font-bold p-3"
                >
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent className="  w-[500px]  ">
                <SheetHeader>
                  <SheetTitle>Configure Nodes</SheetTitle>
                  <SheetDescription>Create a new node</SheetDescription>
                </SheetHeader>
                <div className="h-full w-full">
                  <AddTable
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </Panel>
          <Background />
          <Controls
            style={{
              bottom: 1,
              left: 1,
              color: "black",
              border: "none",
            }}
          />
        </ReactFlow>
      </section>
    </div>
  );
}
