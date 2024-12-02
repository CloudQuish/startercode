import { DiagramProvider } from "@/providers/DiagramProvider";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <DiagramProvider>
        <div>{children}</div>
      </DiagramProvider>
    </div>
  );
}
