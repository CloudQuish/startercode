"use client";
import { PropsWithChildren } from "react";
import { DiagramProvider } from "./DiagramContext";
import { ThemeProvider } from "./ThemeProvider";

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DiagramProvider>{children}</DiagramProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
