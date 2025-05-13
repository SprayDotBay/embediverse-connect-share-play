
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileExplorerItem } from "./FileExplorerItem";
import { FileExplorerActions } from "./FileExplorerActions";
import { FileItem } from "@/types/fileExplorer";
import { useCodeEditor } from "@/contexts/CodeEditorContext";

export const FileExplorer: React.FC = () => {
  const { files, handleFileSelect, handleToggleFolder } = useCodeEditor();

  return (
    <Card className="col-span-1 h-full overflow-hidden flex flex-col">
      <CardHeader className="p-0 border-b">
        <FileExplorerActions />
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="p-4">
          {files.map(file => (
            <FileExplorerItem 
              key={file.path}
              item={file} 
              onFileSelect={handleFileSelect} 
              onToggleFolder={handleToggleFolder} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
