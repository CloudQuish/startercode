import { CSSProperties } from "react";

export interface IWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties | undefined;
  maxWidth?: number;
}
