
import React from "react";
import { ArrowDown, ArrowRight, FileCode, FolderIcon } from "lucide-react";
import { FileItem } from "@/types/fileExplorer";

interface FileExplorerItemProps {
  item: FileItem;
  onFileSelect: (file: FileItem) => void;
  onToggleFolder: (folder: FileItem) => void;
}

export const FileExplorerItem: React.FC<FileExplorerItemProps> = ({ 
  item, 
  onFileSelect, 
  onToggleFolder 
}) => {
  if (item.type === "directory") {
    return (
      <div className="mb-2">
        <div 
          className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-primary transition-colors"
          onClick={() => onToggleFolder(item)}
        >
          {item.isExpanded ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          <FolderIcon className="h-4 w-4 text-muted-foreground" />
          <span>{item.name}</span>
        </div>
        
        {item.isExpanded && item.children && (
          <div className="pl-6 mt-1 space-y-1">
            {item.children.map(child => (
              <FileExplorerItem 
                key={child.path} 
                item={child} 
                onFileSelect={onFileSelect}
                onToggleFolder={onToggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div
        key={item.path}
        className={`flex items-center gap-1 text-sm cursor-pointer hover:text-foreground transition-colors ${
          item.isActive ? 'text-primary' : 'text-muted-foreground'
        }`}
        onClick={() => onFileSelect(item)}
      >
        <FileCode className="h-4 w-4" />
        <span>{item.name}</span>
      </div>
    );
  }
};
