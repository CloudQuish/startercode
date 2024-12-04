"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TableActions from "./TableActions";
import { useDiagram } from "../../../providers/DiagramContext";

const TableList = () => {
  const { tables, selectedTable } = useDiagram();
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Update openItems when selectedTable changes
  useEffect(() => {
    if (selectedTable && !openItems.includes(selectedTable)) {
      setOpenItems((prev) => [...prev, selectedTable]); // Ensure the selected table is open
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable]);

  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={(newOpenItems) => setOpenItems(newOpenItems)}
      className="w-full"
    >
      {tables.map((table) => (
        <AccordionItem key={table.id} value={table.id}>
          <AccordionTrigger>{table.name}</AccordionTrigger>
          <AccordionContent>
            <TableActions table={table} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TableList;
