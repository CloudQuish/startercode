import { Connection, Edge } from "@xyflow/react";

export type ColumnType =
  | "varchar"
  | "integer"
  | "boolean"
  | "date"
  | "timestamp"
  | "float";

export interface IColumn {
  id: string;
  name: string;
  type: ColumnType;
  isPrimaryKey: boolean;
  isNullable: boolean;
}

export interface ITable {
  id: string;
  name: string;
  columns: IColumn[];
}

export interface IRelationship {
  id: string;
  name: string;
  sourceTableId: string;
  targetTableId: string;
  sourceColumnId: string;
  targetColumnId: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
}

export interface IDiagramState {
  nodes: any;
  edges: any;
  tables: ITable[];
  relationships: IRelationship[];
}

export interface IHistoryEntry {
  tables: ITable[];
  relationships: IRelationship[];
  nodes: Node[];
  edges: Edge[];
}

export interface IDiagramContextType {
  selectedTable: string | null;
  setSelectedTable: (a: string) => void;
  tables: ITable[];
  relationships: IRelationship[];
  nodes: Node[];
  edges: Node[];
  addTable: (table: Omit<ITable, "id">) => void;
  updateTable: (id: string, updates: Partial<ITable>) => void;
  removeTable: (id: string) => void;
  addColumn: (tableId: string, column: Omit<IColumn, "id">) => void;
  updateColumn: (
    tableId: string,
    columnId: string,
    updates: Partial<IColumn>
  ) => void;
  removeColumn: (tableId: string, columnId: string) => void;
  addRelationship: (relationship: Omit<IRelationship, "id">) => void;
  updateRelationship: (id: string, updates: Partial<IRelationship>) => void;
  removeRelationship: (id: string) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveDiagram: () => void;
  loadDiagram: (data: IDiagramState) => void;
}
