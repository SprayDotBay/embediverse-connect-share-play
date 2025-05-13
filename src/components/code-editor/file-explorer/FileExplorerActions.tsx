
import React, { useState } from "react";
import { Plus, FolderPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCodeEditor } from "@/contexts/CodeEditorContext";

export const FileExplorerActions: React.FC = () => {
  const { 
    activeFile, 
    handleCreateFile, 
    handleCreateFolder,
    getFileParentPath 
  } = useCodeEditor();
  const [isCreating, setIsCreating] = useState(false);

  const currentDirectory = activeFile ? getFileParentPath(activeFile) : "src";

  const handleNewFile = () => {
    const fileName = window.prompt("Enter file name:", "newFile.cpp");
    if (fileName) {
      handleCreateFile(currentDirectory, fileName);
    }
  };

  const handleNewFolder = () => {
    const folderName = window.prompt("Enter folder name:", "newFolder");
    if (folderName) {
      handleCreateFolder(currentDirectory, folderName);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 px-4">
      <h3 className="text-sm font-medium">Files</h3>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleNewFile}>
            <FileText className="mr-2 h-4 w-4" />
            <span>New File</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleNewFolder}>
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>New Folder</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
