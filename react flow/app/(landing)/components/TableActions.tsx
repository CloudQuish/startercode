"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash, Plus, Save, X } from "lucide-react";
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
import { useDiagram } from "../../../providers/DiagramContext";
import { ColumnType, ITable } from "@/interfaces/context-interface";
import { IColumn } from "@/interfaces/statics-data.interface";
import { toast } from "@/hooks/use-toast";

type TableActionsProps = {
  table: ITable;
};

const TableActions = ({ table }: TableActionsProps) => {
  const {
    tables,
    updateTable,
    removeTable,
    addColumn,
    updateColumn,
    removeColumn,
  } = useDiagram();

  // State for new column
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState<ColumnType>("varchar");
  const [isPrimaryKey, setIsPrimaryKey] = useState(false);
  const [isNullable, setIsNullable] = useState(true);

  // State for editing
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState(false);

  // Temporary state for table and column editing
  const [tempTableName, setTempTableName] = useState(table.name);
  const [tempColumnEdits, setTempColumnEdits] = useState<{
    [key: string]: IColumn;
  }>({});

  const [deleteTableConfirmation, setDeleteTableConfirmation] = useState(false);
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);

  // Check if the table name already exists
  const isTableNameDuplicate = (name: string) => {
    const duplicate = tables?.some(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );
    console.log({ name, tables, duplicate });
    return duplicate;
  };

  // Check if the column name already exists within the same table
  const isColumnNameDuplicate = (name: string) => {
    return table.columns.some(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleAddColumn = () => {
    if (newColumnName) {
      if (isColumnNameDuplicate(newColumnName)) {
        toast({
          title: "Column name already exists",
          description: `A column named ${newColumnName} already exists in table ${table.name}.`,
          variant: "destructive",
        });
        return;
      }
      addColumn(table.id, {
        name: newColumnName,
        type: newColumnType,
        isPrimaryKey,
        isNullable,
      });
      setNewColumnName("");
      setNewColumnType("varchar");
      setIsPrimaryKey(false);
      setIsNullable(true);
      toast({
        title: "Column Added",
        description: `Column ${newColumnName} has been added to table ${table.name}.`,
      });
    }
  };

  const handleUpdateTableName = () => {
    if (isTableNameDuplicate(tempTableName)) {
      toast({
        title: "Table name already exists",
        description: `A table named ${tempTableName} already exists.`,
        variant: "destructive",
      });
      return;
    }
    updateTable(table.id, { name: tempTableName });
    setEditingTable(false);
    toast({
      title: "Table Updated",
      description: `Table name changed to ${tempTableName}.`,
    });
  };

  const handleCancelTableNameEdit = () => {
    setTempTableName(table.name);
    setEditingTable(false);
  };

  const handleUpdateColumn = (columnId: string) => {
    const updatedColumn = tempColumnEdits[columnId];
    if (updatedColumn) {
      const { name, ...editedTempColumn } = updatedColumn; // Destructure and omit the 'name' property

      // Check if the column name is duplicate before updating
      if (isColumnNameDuplicate(updatedColumn.name)) {
        toast({
          title: "Column name already exists",
          description: `A column named ${updatedColumn.name} already exists in table ${table.name}.`,
          variant: "destructive",
        });
        return;
      }

      // Update the column with the modified data
      updateColumn(table.id, columnId, editedTempColumn);
      setEditingColumn(null);

      toast({
        title: "Column Updated",
        description: `Column ${updatedColumn.name} has been updated in table ${table.name}.`,
      });
    }
  };

  const handleCancelColumnEdit = (columnId: string) => {
    setEditingColumn(null);
    const tempColumnEditsCopy = { ...tempColumnEdits };
    delete tempColumnEditsCopy[columnId];
    setTempColumnEdits(tempColumnEditsCopy);
  };

  const handleRemoveColumn = (columnId: string, columnName: string) => {
    removeColumn(table.id, columnId); // Call the function to remove the column
    setDeleteColumnId(null); // Reset the state
    toast({
      title: "Column Removed",
      description: `Column ${columnName} has been removed from table ${table.name}.`,
      variant: "destructive",
    });
  };

  const handleRemoveTable = () => {
    removeTable(table.id);
    toast({
      title: "Table Removed",
      description: `Table ${table.name} has been removed.`,
      variant: "destructive",
    });
  };

  const updateTempColumnEdit = (
    columnId: string,
    updates: Partial<IColumn>
  ) => {
    setTempColumnEdits((prev) => ({
      ...prev,
      [columnId]: {
        ...(prev[columnId] || table.columns.find((c) => c.id === columnId)),
        ...updates,
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Table Name Section */}
      <div className="flex items-center space-x-2">
        {editingTable ? (
          <>
            <Input
              value={tempTableName}
              onChange={(e) => setTempTableName(e.target.value)}
              placeholder="Table name"
            />
            <Button
              onClick={handleUpdateTableName}
              variant="default"
              size="icon"
            >
              <Save size={20} />
            </Button>
            <Button
              onClick={handleCancelTableNameEdit}
              variant="outline"
              size="icon"
            >
              <X size={20} />
            </Button>
          </>
        ) : (
          <>
            <div className="flex-grow font-semibold">{table.name}</div>
            <Button
              onClick={() => setEditingTable(true)}
              variant="ghost"
              size="icon"
            >
              <Pencil size={20} />
            </Button>
            <AlertDialog
              open={deleteTableConfirmation}
              onOpenChange={setDeleteTableConfirmation}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash size={20} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the table {table.name} and all
                    its columns.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemoveTable}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {/* Columns Section */}
      <div className="space-y-2">
        {table.columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col space-y-2 bg-secondary/50 p-2 rounded-md mb-2"
          >
            {editingColumn === column.id ? (
              <>
                <Input
                  value={tempColumnEdits[column.id]?.name || column.name}
                  onChange={(e) =>
                    updateTempColumnEdit(column.id, { name: e.target.value })
                  }
                  placeholder="Column name"
                  className="w-full"
                />
                <div className="flex items-center space-x-2">
                  <Select
                    value={tempColumnEdits[column.id]?.type || column.type}
                    onValueChange={(value: ColumnType) =>
                      updateTempColumnEdit(column.id, { type: value })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="varchar">VARCHAR</SelectItem>
                      <SelectItem value="integer">INTEGER</SelectItem>
                      <SelectItem value="boolean">BOOLEAN</SelectItem>
                      <SelectItem value="date">DATE</SelectItem>
                      <SelectItem value="timestamp">TIMESTAMP</SelectItem>
                      <SelectItem value="float">FLOAT</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={
                        tempColumnEdits[column.id]?.isPrimaryKey ??
                        column.isPrimaryKey
                      }
                      onCheckedChange={(checked) =>
                        updateTempColumnEdit(column.id, {
                          isPrimaryKey: checked,
                        })
                      }
                      aria-label="Primary Key"
                    />
                    <Label>PK</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={
                        tempColumnEdits[column.id]?.isNullable ??
                        column.isNullable
                      }
                      onCheckedChange={(checked) =>
                        updateTempColumnEdit(column.id, { isNullable: checked })
                      }
                      aria-label="Nullable"
                    />
                    <Label>Null</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => handleUpdateColumn(column.id)}
                    size="sm"
                    variant="default"
                  >
                    <Save size={16} className="mr-2" /> Save
                  </Button>
                  <Button
                    onClick={() => handleCancelColumnEdit(column.id)}
                    size="sm"
                    variant="outline"
                  >
                    <X size={16} className="mr-2" /> Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{column.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {column.type}
                  </span>
                  {column.isPrimaryKey && (
                    <span className="text-primary text-sm">PK</span>
                  )}
                  {column.isNullable && (
                    <span className="text-muted-foreground text-sm">Null</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setEditingColumn(column.id)}
                    size="sm"
                    variant="ghost"
                  >
                    <Pencil size={16} />
                  </Button>
                  <AlertDialog
                    open={deleteColumnId === column.id}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setDeleteColumnId(null); // Reset deleteColumnId when dialog is closed
                      }
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={() => setDeleteColumnId(column.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Column</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the column
                          {column.name}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleRemoveColumn(column.id, column.name)
                          }
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Column Section */}
      <div className="flex flex-col space-y-2 bg-muted/50 p-2 rounded-md">
        <Input
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="New column name"
        />
        <div className="flex items-center space-x-2">
          <Select
            value={newColumnType}
            onValueChange={(value: ColumnType) => setNewColumnType(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Column type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="varchar">VARCHAR</SelectItem>
              <SelectItem value="integer">INTEGER</SelectItem>
              <SelectItem value="boolean">BOOLEAN</SelectItem>
              <SelectItem value="date">DATE</SelectItem>
              <SelectItem value="timestamp">TIMESTAMP</SelectItem>
              <SelectItem value="float">FLOAT</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              id="primary-key"
              checked={isPrimaryKey}
              onCheckedChange={setIsPrimaryKey}
            />
            <Label htmlFor="primary-key">PK</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="nullable"
              checked={isNullable}
              onCheckedChange={setIsNullable}
            />
            <Label htmlFor="nullable">Null</Label>
          </div>
        </div>
        <Button onClick={handleAddColumn} className="w-full">
          <Plus size={20} className="mr-2" /> Add Column
        </Button>
      </div>
    </div>
  );
};

export default TableActions;
