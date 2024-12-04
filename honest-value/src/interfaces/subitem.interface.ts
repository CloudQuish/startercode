export interface ISubItem {
  id: string | number;
  label: string;
}

export interface ISubItemTabsProps {
  subItems: ISubItem[];
  activeStep: number;
  setActiveStep: (step: number) => void;
}
