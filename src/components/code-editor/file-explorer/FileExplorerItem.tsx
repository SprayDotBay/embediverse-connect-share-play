
import React, { useState } from "react";
import { ArrowDown, ArrowRight, FileCode, FolderIcon } from "lucide-react";
import { FileItem } from "@/types/fileExplorer";
import { FileContextMenu } from "./FileContextMenu";
import { useCodeEditor } from "@/contexts/CodeEditorContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileExplorerItemProps {
  item: FileItem;
  onFileSelect: (file: FileItem) => void;
  onToggleFolder: (folder: FileItem) => void;
}

/**
 * Component that renders a single file or folder item in the explorer
 * Supports context menu operations and integrates with version history
 */
export const FileExplorerItem: React.FC<FileExplorerItemProps> = ({ 
  item, 
  onFileSelect, 
  onToggleFolder 
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const { 
    handleRename, 
    handleDelete, 
    handleDuplicateFile, 
    fileContents,
    handleSaveVersion 
  } = useCodeEditor();

  const onRenameStart = (file: FileItem) => {
    setNewName(file.name);
    setIsRenaming(true);
  };

  const onRenameConfirm = () => {
    handleRename(item, newName);
    setIsRenaming(false);
  };

  const onDeleteConfirm = (file: FileItem) => {
    handleDelete(file);
  };
  
  const onDuplicateConfirm = (file: FileItem) => {
    handleDuplicateFile(file);
  };
  
  const onSaveVersion = (file: FileItem) => {
    const description = window.prompt("Enter a description for this version:", `${file.name} - version`);
    if (description) {
      handleSaveVersion(description);
    }
  };

  const renderFolderItem = () => (
    <FileContextMenu 
      item={item} 
      onRename={onRenameStart} 
      onDelete={onDeleteConfirm}
      onDuplicate={onDuplicateConfirm}
      fileContents={fileContents}
    >
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
    </FileContextMenu>
  );

  const renderFileItem = () => (
    <FileContextMenu 
      item={item} 
      onRename={onRenameStart} 
      onDelete={onDeleteConfirm}
      onDuplicate={onDuplicateConfirm}
      fileContents={fileContents}
      onSaveVersion={onSaveVersion}
    >
      <div
        className={`flex items-center gap-1 text-sm cursor-pointer hover:text-foreground transition-colors ${
          item.isActive ? 'text-primary' : 'text-muted-foreground'
        }`}
        onClick={() => onFileSelect(item)}
      >
        <FileCode className="h-4 w-4" />
        <span>{item.name}</span>
      </div>
    </FileContextMenu>
  );

  return (
    <>
      {item.type === "directory" ? renderFolderItem() : renderFileItem()}
      
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename {item.type === "directory" ? "Folder" : "File"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRenameConfirm();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenaming(false)}>
              Cancel
            </Button>
            <Button onClick={onRenameConfirm}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
