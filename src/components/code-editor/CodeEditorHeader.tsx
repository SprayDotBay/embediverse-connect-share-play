
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Save, FolderOpen, Plus, Download } from "lucide-react";
import { useCodeEditor } from "@/contexts/CodeEditorContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { openFileDialog, openDirectoryDialog } from "@/utils/fileOperations";

export const CodeEditorHeader: React.FC = () => {
  const { handleSave, handleCreateEsp32Project } = useCodeEditor();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">Code Editor</h1>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCreateEsp32Project}>
              ESP32 Project
            </DropdownMenuItem>
            <DropdownMenuItem>
              Arduino Project
            </DropdownMenuItem>
            <DropdownMenuItem>
              Empty Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline">
          <FolderOpen className="mr-2 h-4 w-4" />
          Open Project
        </Button>
        
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload to Device
        </Button>
        
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Project
        </Button>
        
        <Button variant="secondary">
          <Download className="mr-2 h-4 w-4" />
          Download Project
        </Button>
      </div>
    </div>
  );
};
