"use client";

import { Edge, Node } from "@xyflow/react";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type TColumn = {
  name: string;
  dataType: string;
  constraint: string;
};

type TTableData = {
  tableName: string;
  columns: TColumn[];
};
type TDiagramContextProps = {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  addNewTable: ({
    tableName,
    columnsData,
  }: {
    tableName: string;
    columnsData: TColumn[];
  }) => void;
  updateTable: (nodeId: string, newData: Partial<TTableData>) => void;
  deleteNode: (nodeId: string) => void;
  editId: string;
  handleEditId: (nodeId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  updateHistory: (newNodes: Node[], newEdges: Edge[]) => void;
};

const DiagramContext = createContext<TDiagramContextProps | undefined>(
  undefined
);

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      tableName: "Customer",
      columns: [
        { name: "id", dataType: "INT", constraint: "PRIMARY KEY" },
        { name: "fullname", dataType: "VARCHAR", constraint: "NOT NULL" },
        { name: "age", dataType: "INT", constraint: "NOT NULL" },
        { name: "address", dataType: "VARCHAR", constraint: "NOT NULL" },
      ],
    },
    type: "custom",
  },
  {
    id: "2",
    position: { x: 200, y: 200 },
    data: {
      tableName: "Sales",
      columns: [
        { name: "id", dataType: "INT", constraint: "PRIMARY KEY" },
        { name: "profit", dataType: "INT", constraint: "NOT NULL" },
        { name: "loss", dataType: "INT", constraint: "NOT NULL" },
        { name: "closing date", dataType: "DATE", constraint: "NOT NULL" },
      ],
    },
    type: "custom",
  },
];

type TLocalStorage = {
  nodes: Node[];
  edges: Edge[];
};
export const DiagramProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [editId, setEditId] = useState("");
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>(
    []
  );
  const [historyIndex, setHistoryIndex] = useState(-1);

  function handleEditId(nodeId: string) {
    setEditId(nodeId);
  }

  //  ADD NEW TABLE
  const addNewTable = useCallback(
    ({
      tableName,
      columnsData,
    }: {
      tableName: string;
      columnsData: TColumn[];
    }) => {
      setNodes((prevNodes) => {
        const newNode = {
          id: `${nodes.length + 1}`,
          position: {
            x: Math.random() * 500,
            y: Math.random() * 500,
          },
          data: {
            tableName: `${tableName}`,
            columns: columnsData,
          },
          type: "custom",
        };
        const newNodes = [...prevNodes, newNode];
        updateHistory(newNodes, edges);
        return newNodes;
      });
    },
    [edges]
  );

  //   UPDATE HISTORY WHEN ADDED OR UPDATED TABLE
  const updateHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      console.log("HELLO FROM HISTORU UPDATE");
      console.log("EDGESSSS:", newEdges);
      console.log("NODESSSSS:", newNodes);

      //   setHistory((prev) => [
      //     ...prev.slice(0, historyIndex + 1),
      //     { nodes: newNodes, edges: newEdges },
      //   ]);
      setHistory((prev) => {
        const updatedHistory = [
          ...prev.slice(0, historyIndex + 1),
          { nodes: newNodes, edges: newEdges },
        ];
        // Save the updated history to localStorage
        //    localStorage.setItem("diagramHistory", JSON.stringify(updatedHistory));
        // Save the updated history to localStorage
        localStorage.setItem("diagram", JSON.stringify(updatedHistory));
        // saveDiagram(updateHistory);
        return updatedHistory;
      });
      console.log("UPDATED HISTIRYY:", history);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex, history]
  );

  useEffect(() => {
    const savedHistory = localStorage.getItem("diagram");

    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setHistory(parsedHistory);
          setNodes(parsedHistory[parsedHistory.length - 1].nodes);
          setEdges(parsedHistory[parsedHistory.length - 1].edges);
          setHistoryIndex(parsedHistory.length - 1);
          console.log("Loaded history from localStorage:", parsedHistory);
          return;
        }
      } catch (error) {
        console.error("Error parsing history from localStorage:", error);
      }
    }

    // If no saved history, initialize with default
    setHistory([{ nodes, edges }]);
    setHistoryIndex(0);
  }, []);

  //INITIAL RENDER MA HISTORY SET WITH TWO DEFAULT TABLES
  useEffect(() => {
    setHistory([{ nodes, edges }]);
    setHistoryIndex(0);
    console.log("HISTORY INITIALLLLL:", history);
  }, []);

  // Log the updated history after it has been changed
  useEffect(() => {
    console.log("UPDATED HISTORY:", history);
  }, [history]);
  //   TABLE UPDATE
  const updateTable = useCallback(
    (nodeId: string, newData: Partial<TTableData>) => {
      setNodes((prevNodes) => {
        const newNodes = prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        );
        updateHistory(newNodes, edges);
        return newNodes;
      });
    },
    [edges]
  );

  //   UNDO TASK
  const undo = useCallback(() => {
    console.log("UNDO INDEX HISTORY", historyIndex);
    console.log("UNDO  HISTORYSSSSSSsss:", history);
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevState = history[newIndex];

      console.log("UNDO HISTORY:", prevState);

      if (prevState) {
        setNodes(prevState.nodes);
        setEdges(prevState.edges);
        setHistoryIndex(newIndex); // Update the index first
      }
    }
  }, [history, historyIndex]);
  //   }, [history, historyIndex]);

  //   REDO TASK
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
    }
  }, [history, historyIndex]);

  // Delete a node by its ID and remove related edges
  function deleteNode(nodeId: string) {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
  }

  return (
    <DiagramContext.Provider
      value={{
        nodes,
        setNodes,
        edges,
        setEdges,
        addNewTable,
        deleteNode,
        updateTable,
        handleEditId,
        editId,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        updateHistory,
      }}
    >
      {children}
    </DiagramContext.Provider>
  );
};

export const useDiagramContext = () => {
  const context = useContext(DiagramContext);

  if (!context) {
    throw new Error("useDiagramContext must be used within the Provider");
  }
  return context;
};
