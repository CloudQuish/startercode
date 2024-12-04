export interface IColumn {
  id: string;
  name: string;
  type: "varchar" | "integer" | "boolean" | "date" | "timestamp" | "float";
  isPrimaryKey: boolean;
  isNullable: boolean;
}

export interface ITable {
  id: string;
  name: string;
  columns: IColumn[] | any;
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
