import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDiagram } from "../../../providers/DiagramContext";
import { DatabaseIcon, KeyIcon, LinkIcon } from "lucide-react";

const TableListView = () => {
  const { tables, relationships } = useDiagram();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <DatabaseIcon className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">
          Database Schema
        </h2>
      </div>
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-1/4 flex items-center space-x-2">
                <span>Table Name</span>
              </TableHead>
              <TableHead className="w-2/5">Columns</TableHead>
              <TableHead className="w-1/3">Relationships</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow
                key={table.id}
                className="group hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <KeyIcon className="w-4 h-4 text-primary/70" />
                    <span className="group-hover:text-primary transition-colors">
                      {table.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-2">
                    {table.columns.map((column) => (
                      <div
                        key={column.id}
                        className="flex items-center space-x-2"
                      >
                        <span className="text-sm text-muted-foreground">
                          {column.name}
                        </span>
                        <div className="flex space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {column.type}
                          </Badge>
                          {column.isPrimaryKey && (
                            <Badge variant="default" className="text-xs">
                              PK
                            </Badge>
                          )}
                          {column.isNullable && (
                            <Badge variant="secondary" className="text-xs">
                              Null
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-2">
                    {relationships
                      .filter(
                        (rel) =>
                          rel.sourceTableId === table.id ||
                          rel.targetTableId === table.id
                      )
                      .map((rel) => {
                        const isSourceTable = rel.sourceTableId === table.id;
                        const relatedTable = tables.find(
                          (t) =>
                            t.id ===
                            (isSourceTable
                              ? rel.targetTableId
                              : rel.sourceTableId)
                        );

                        return (
                          <div
                            key={rel.id}
                            className="flex items-center space-x-2 text-sm text-muted-foreground"
                          >
                            <LinkIcon className="w-4 h-4 text-primary/50" />
                            <span>{isSourceTable ? "To" : "From"}</span>
                            <span className="font-medium">
                              {relatedTable?.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {rel.type}
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableListView;
