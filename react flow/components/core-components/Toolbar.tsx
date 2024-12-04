import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Save, Upload, Undo, Redo, Menu, Download } from "lucide-react";
import ModeToggle from "./ModeToggle";
import { useDiagram } from "../../providers/DiagramContext";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

type ToolbarProps = {
  toggleSidebar: () => void;
};

const Toolbar = ({ toggleSidebar }: ToolbarProps) => {
  const { loadDiagram, undo, redo, canUndo, canRedo, tables, relationships } =
    useDiagram();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isValidDiagramData = (data: any): boolean => {
    if (!data || typeof data !== "object") {
      toast({
        title: "Invalid File",
        description: "The uploaded file is not a valid JSON object.",
        variant: "destructive",
      });
      return false;
    }

    // Validate tables array
    if (!data.tables || !Array.isArray(data.tables)) {
      toast({
        title: "Invalid Data",
        description: "The diagram data must contain a valid 'tables' array.",
        variant: "destructive",
      });
      return false;
    }

    // Validate each table structure
    const isValidTable = (table: any) => {
      return (
        table &&
        typeof table === "object" &&
        typeof table.name === "string" &&
        table.name.trim() !== "" &&
        Array.isArray(table.columns)
      );
    };

    // Check if all tables are valid
    if (!data.tables.every(isValidTable)) {
      toast({
        title: "Invalid Tables",
        description: "One or more tables have an invalid structure.",
        variant: "destructive",
      });
      return false;
    }

    // Optional: Validate relationships if present
    if (data.relationships && !Array.isArray(data.relationships)) {
      toast({
        title: "Invalid Relationships",
        description: "The relationships must be an array.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a JSON file to import.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = await JSON.parse(event.target?.result as string);

        if (isValidDiagramData(jsonData)) {
          console.log(jsonData);
          await loadDiagram(jsonData);

          // Show success toast
          toast({
            title: "Import Successful",
            description: "Your diagram has been imported successfully.",
            variant: "default",
          });

          // Close the modal
          setIsImportModalOpen(false);
          // Reset selected file
          setSelectedFile(null);
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description:
            "Failed to parse the JSON file. Please check the data structure.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleExport = () => {
    const data = JSON.stringify({ tables, relationships }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "database_diagram.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show export success toast
    toast({
      title: "Export Successful",
      description: "Your diagram has been exported as JSON.",
      variant: "default",
    });
  };

  return (
    <TooltipProvider>
      <div className="bg-background border-b px-2 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Sidebar</TooltipContent>
          </Tooltip>

          <div className="hidden sm:flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  className="gap-1.5 ml-12"
                >
                  <Undo size={18} />
                  <span className="hidden md:inline">Undo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo Last Action</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  className="gap-1.5"
                >
                  <Redo size={18} />
                  <span className="hidden md:inline">Redo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo Last Action</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex sm:hidden">
            <div className="flex border rounded-md">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={undo}
                    disabled={!canUndo}
                    className="rounded-r-none border-r"
                  >
                    <Undo size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={redo}
                    disabled={!canRedo}
                    className="rounded-l-none"
                  >
                    <Redo size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsImportModalOpen(true)}
                className="gap-1.5 hidden"
              >
                <Upload size={18} />
                <span className="hidden md:inline">Import</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="gap-1.5"
              >
                <Download size={18} />
                <span className="hidden md:inline">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export as JSON</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>

        {/* Import Modal */}
        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Diagram</DialogTitle>
              <DialogDescription>
                Upload a JSON file containing your database diagram.
              </DialogDescription>
            </DialogHeader>

            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="import-file">JSON File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsImportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="hidden"
                onClick={handleImport}
                disabled={!selectedFile}
              >
                Import
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
