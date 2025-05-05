
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowRight, FileCode } from "lucide-react";

interface FileItem {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileItem[];
  isExpanded?: boolean;
  isActive?: boolean;
}

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  onToggleFolder: (folder: FileItem) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  onFileSelect, 
  onToggleFolder 
}) => {
  const renderFileItem = (file: FileItem) => {
    if (file.type === "directory") {
      return (
        <div key={file.path} className="mb-2">
          <div 
            className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-primary transition-colors"
            onClick={() => onToggleFolder(file)}
          >
            {file.isExpanded ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>{file.name}</span>
          </div>
          
          {file.isExpanded && file.children && (
            <div className="pl-6 mt-1 space-y-1">
              {file.children.map(child => renderFileItem(child))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={file.path}
          className={`flex items-center gap-1 text-sm cursor-pointer hover:text-foreground transition-colors ${
            file.isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => onFileSelect(file)}
        >
          <FileCode className="h-4 w-4" />
          <span>{file.name}</span>
        </div>
      );
    }
  };

  return (
    <Card className="col-span-1 h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Project Files</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="p-4">
          {files.map(file => renderFileItem(file))}
        </div>
      </CardContent>
    </Card>
  );
};
