"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Connection, useNodesState, useEdgesState } from "@xyflow/react";
import { nanoid } from "nanoid";
import { debounce } from "@/utils/debounce.utils";
import {
  initialEdges,
  initialNodes,
  initialPosition,
  initialRelationships,
  initialTables,
} from "@/statics/staticData";
import {
  IColumn,
  IDiagramContextType,
  IDiagramState,
  IHistoryEntry,
  IRelationship,
} from "@/interfaces/context-interface";
import { ITable } from "@/interfaces/statics-data.interface";

const DiagramContext = createContext<IDiagramContextType | undefined>(
  undefined
);

export const DiagramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tables, setTables] = useState<ITable[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const [relationships, setRelationships] =
    useState<IRelationship[]>(initialRelationships);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialEdges);

  const historyRef = useRef<IHistoryEntry[]>([]);
  const currentIndexRef = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // useEffect(() => {
  //   setNodes(initialNodes);
  //   setEdges(initialEdges);
  // }, []);

  const saveDiagram = useCallback(
    debounce(() => {
      const data = JSON.stringify({
        tables,
        relationships,
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges,
      });
      localStorage.setItem("databaseDiagram", data);
    }, 500),
    [tables, relationships, nodes, edges]
  );

  useEffect(() => {
    saveDiagram();
  }, [tables, relationships, nodes, edges, saveDiagram]);

  const saveToHistory = useCallback(() => {
    const newEntry: IHistoryEntry = { tables, relationships, nodes, edges };
    historyRef.current = historyRef.current.slice(
      0,
      currentIndexRef.current + 1
    );
    historyRef.current.push(newEntry);
    currentIndexRef.current++;
    setCanUndo(true);
    setCanRedo(false);
  }, [tables, relationships, nodes, edges]);

  const addTable = useCallback(
    (table: Omit<ITable, "id" | "columns">) => {
      const newTable: ITable = {
        ...table,
        id: nanoid(),
        columns: [
          {
            id: nanoid(),
            name: "id",
            type: "integer",
            isPrimaryKey: true,
            isNullable: false,
          },
        ],
      };
      setTables((prev) => [...prev, newTable]);

      setNodes((prev) => [
        ...prev,
        {
          id: newTable.id,
          type: "tableNode",
          position: {
            x: 400,
            y: 400,
          },
          data: { table: newTable },
        },
      ]);
      saveToHistory();
    },
    [setNodes, saveToHistory]
  );

  const updateTable = useCallback(
    (id: string, updates: Partial<ITable>) => {
      setTables((prev) =>
        prev.map((table) =>
          table.id === id ? { ...table, ...updates } : table
        )
      );
      setNodes((prev) =>
        prev.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  table: { ...node.data.table, ...updates },
                },
              }
            : node
        )
      );
      saveToHistory();
    },
    [setNodes, saveToHistory]
  );

  const removeTable = useCallback(
    (id: string) => {
      setTables((prev) => prev.filter((table) => table.id !== id));
      setNodes((prev) => prev.filter((node) => node.id !== id));
      setRelationships((prev) =>
        prev.filter(
          (rel) => rel.sourceTableId !== id && rel.targetTableId !== id
        )
      );
      setEdges((prev) =>
        prev.filter((edge) => edge.source !== id && edge.target !== id)
      );
      saveToHistory();
    },
    [setNodes, setEdges, saveToHistory]
  );

  const addColumn = useCallback(
    (tableId: string, column: Omit<IColumn, "id">) => {
      const newColumn = { ...column, id: nanoid() };
      setTables((prev) =>
        prev.map((table) =>
          table.id === tableId
            ? { ...table, columns: [...table.columns, newColumn] }
            : table
        )
      );
      setNodes((prev) =>
        prev.map((node) =>
          node.id === tableId
            ? {
                ...node,
                data: {
                  ...node.data,
                  table: {
                    ...node.data.table,
                    columns: [...node.data.table.columns, newColumn],
                  },
                },
              }
            : node
        )
      );
      saveToHistory();
    },
    [setNodes, saveToHistory]
  );

  const updateColumn = useCallback(
    (tableId: string, columnId: string, updates: Partial<IColumn>) => {
      setTables((prev) =>
        prev.map((table) =>
          table.id === tableId
            ? {
                ...table,
                columns: table.columns.map((col: { id: string }) =>
                  col.id === columnId ? { ...col, ...updates } : col
                ),
              }
            : table
        )
      );
      setNodes((prev) =>
        prev.map((node) =>
          node.id === tableId
            ? {
                ...node,
                data: {
                  ...node.data,
                  table: {
                    ...node.data.table,
                    columns: node.data.table.columns.map((col: IColumn) =>
                      col.id === columnId ? { ...col, ...updates } : col
                    ),
                  },
                },
              }
            : node
        )
      );
      saveToHistory();
    },
    [setNodes, saveToHistory]
  );

  const removeColumn = useCallback(
    (tableId: string, columnId: string) => {
      setTables((prev) =>
        prev.map((table) =>
          table.id === tableId
            ? {
                ...table,
                columns: table.columns.filter(
                  (col: { id: string }) => col.id !== columnId
                ),
              }
            : table
        )
      );
      setNodes((prev) =>
        prev.map((node) =>
          node.id === tableId
            ? {
                ...node,
                data: {
                  ...node.data,
                  table: {
                    ...node.data.table,
                    columns: node.data.table.columns.filter(
                      (col: IColumn) => col.id !== columnId
                    ),
                  },
                },
              }
            : node
        )
      );
      setRelationships((prev) =>
        prev.filter(
          (rel) =>
            !(
              rel.sourceTableId === tableId && rel.sourceColumnId === columnId
            ) &&
            !(rel.targetTableId === tableId && rel.targetColumnId === columnId)
        )
      );
      setEdges((prev) =>
        prev.filter(
          (edge) =>
            !(edge.sourceHandle === `${tableId}-${columnId}`) &&
            !(edge.targetHandle === `${tableId}-${columnId}`)
        )
      );
      saveToHistory();
    },
    [setNodes, setEdges, saveToHistory]
  );

  const addRelationship = useCallback(
    (relationship: Omit<IRelationship, "id">) => {
      const newRelationship = { ...relationship, id: nanoid() };
      setRelationships((prev) => [...prev, newRelationship]);
      setEdges((prev) => [
        ...prev,
        {
          id: newRelationship.id,
          source: newRelationship.sourceTableId,
          target: newRelationship.targetTableId,
          sourceHandle: `${newRelationship.sourceTableId}-${newRelationship.sourceColumnId}`,
          targetHandle: `${newRelationship.targetTableId}-${newRelationship.targetColumnId}`,
          type: "smoothstep",
          animated: true,
          label: newRelationship.name,
        },
      ]);
      saveToHistory();
    },
    [setEdges, saveToHistory]
  );

  const updateRelationship = useCallback(
    (id: string, updates: Partial<IRelationship>) => {
      setRelationships((prev) =>
        prev.map((rel) => (rel.id === id ? { ...rel, ...updates } : rel))
      );
      setEdges((prev) =>
        prev.map((edge) =>
          edge.id === id
            ? {
                ...edge,
                source: updates.sourceTableId || edge.source,
                target: updates.targetTableId || edge.target,
                sourceHandle: updates.sourceColumnId
                  ? `${updates.sourceTableId || edge.source}-${
                      updates.sourceColumnId
                    }`
                  : edge.sourceHandle,
                targetHandle: updates.targetColumnId
                  ? `${updates.targetTableId || edge.target}-${
                      updates.targetColumnId
                    }`
                  : edge.targetHandle,
                label: updates.name || edge.label,
              }
            : edge
        )
      );
      saveToHistory();
    },
    [setEdges, saveToHistory]
  );

  const removeRelationship = useCallback(
    (id: string) => {
      setRelationships((prev) => prev.filter((rel) => rel.id !== id));
      setEdges((prev) => prev.filter((edge) => edge.id !== id));
      saveToHistory();
    },
    [setEdges, saveToHistory]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceTable = tables.find(
        (table) => table.id === connection.source
      );
      const targetTable = tables.find(
        (table) => table.id === connection.target
      );
      if (sourceTable && targetTable) {
        const sourceColumn = sourceTable.columns.find(
          (col: { id: any }) =>
            `${sourceTable.id}-${col.id}` === connection.sourceHandle
        );
        const targetColumn = targetTable.columns.find(
          (col: { id: any }) =>
            `${targetTable.id}-${col.id}` === connection.targetHandle
        );
        if (sourceColumn && targetColumn) {
          addRelationship({
            name: `${sourceTable.name} to ${targetTable.name}`,
            sourceTableId: sourceTable.id,
            targetTableId: targetTable.id,
            sourceColumnId: sourceColumn.id,
            targetColumnId: targetColumn.id,
            type: "one-to-many",
          });
        }
      }
    },
    [tables, addRelationship]
  );

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current--;
      const prevState = historyRef.current[currentIndexRef.current];
      setTables(prevState.tables);
      setRelationships(prevState.relationships);
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setCanRedo(true);
      setCanUndo(currentIndexRef.current > 0);
    }
  }, [setNodes, setEdges]);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current++;
      const nextState = historyRef.current[currentIndexRef.current];
      setTables(nextState.tables);
      setRelationships(nextState.relationships);
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setCanUndo(true);
      setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const loadDiagram = useCallback(
    (data: IDiagramState) => {
      setTables(data.tables);
      setRelationships(data.relationships);
      setNodes(
        data.nodes.map((node: any) => ({
          id: node.id,
          type: node.type,
          position: node.position, // Use the saved position
          data: node.data,
        }))
      );
      setEdges(
        data.edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type,
          animated: edge.animated,
          label: edge.label,
        }))
      );
      saveToHistory();
    },
    [setNodes, setEdges, saveToHistory]
  );

  useEffect(() => {
    const savedData = localStorage.getItem("databaseDiagram");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        loadDiagram(parsedData);
      } catch (error) {
        console.error("Failed to parse saved diagram data:", error);
      }
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [setNodes, setEdges]);

  return (
    <DiagramContext.Provider
      value={{
        selectedTable,
        setSelectedTable,
        tables,
        relationships,
        nodes,
        edges,
        addTable,
        updateTable,
        removeTable,
        addColumn,
        updateColumn,
        removeColumn,
        addRelationship,
        updateRelationship,
        removeRelationship,
        onNodesChange,
        onEdgesChange,
        onConnect,
        undo,
        redo,
        canUndo,
        canRedo,
        saveDiagram,
        loadDiagram,
      }}
    >
      {children}
    </DiagramContext.Provider>
  );
};

export const useDiagram = () => {
  const context = useContext(DiagramContext);
  if (context === undefined) {
    throw new Error("useDiagram must be used within a DiagramProvider");
  }
  return context;
};
