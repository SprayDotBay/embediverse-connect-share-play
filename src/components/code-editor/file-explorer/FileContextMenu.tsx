
import React, { useState } from "react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent
} from "@/components/ui/context-menu";
import { FileItem } from "@/types/fileExplorer";
import { Pencil, Copy, Trash2, Download, FileIcon, History, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { downloadFile } from "@/utils/fileOperations";
import { FileVersionHistory } from "./FileVersionHistory";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileContextMenuProps {
  item: FileItem;
  children: React.ReactNode;
  onRename: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onDuplicate: (file: FileItem) => void;
  fileContents?: Record<string, string>;
  onSaveVersion?: (file: FileItem) => void;
}

/**
 * Context menu component for file explorer items
 * Provides options like rename, delete, duplicate, save version, and view history
 */
export const FileContextMenu: React.FC<FileContextMenuProps> = ({
  item,
  children,
  onRename,
  onDelete,
  onDuplicate,
  fileContents = {},
  onSaveVersion
}) => {
  const isDirectory = item.type === "directory";
  
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [saveVersionDialogOpen, setSaveVersionDialogOpen] = useState(false);
  const [versionDescription, setVersionDescription] = useState("");
  
  const handleCopyPath = () => {
    navigator.clipboard.writeText(item.path);
    toast({
      title: "Path Copied",
      description: `${item.path} copied to clipboard`
    });
  };

  const handleDownload = () => {
    if (isDirectory) {
      toast({
        title: "Not Supported",
        description: "Downloading folders is not supported yet"
      });
      return;
    }
    
    const content = fileContents[item.path] || '';
    downloadFile(item.name, content);
    toast({
      title: "File Downloaded",
      description: `${item.name} downloaded successfully`
    });
  };

  const handleRename = () => {
    onRename(item);
  };

  const handleDelete = () => {
    onDelete(item);
  };
  
  const handleDuplicate = () => {
    onDuplicate(item);
  };
  
  const handleSaveVersionClick = () => {
    setSaveVersionDialogOpen(true);
  };
  
  const handleSaveVersionConfirm = () => {
    if (onSaveVersion) {
      onSaveVersion(item);
      setSaveVersionDialogOpen(false);
      setVersionDescription("");
    }
  };
  
  const handleViewHistory = () => {
    setVersionHistoryOpen(true);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={handleRename} className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            <span>Rename</span>
          </ContextMenuItem>
          
          {!isDirectory && (
            <ContextMenuItem onClick={handleDuplicate} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              <span>Duplicate</span>
            </ContextMenuItem>
          )}
          
          <ContextMenuItem onClick={handleDelete} className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          {!isDirectory && (
            <>
              <ContextMenuItem onClick={handleSaveVersionClick} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Save Version</span>
              </ContextMenuItem>
              
              <ContextMenuItem onClick={handleViewHistory} className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Version History</span>
              </ContextMenuItem>
              
              <ContextMenuSeparator />
            </>
          )}
          
          <ContextMenuItem onClick={handleCopyPath} className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            <span>Copy Path</span>
          </ContextMenuItem>
          
          {!isDirectory && (
            <ContextMenuItem onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
      
      {/* Version History Dialog */}
      <FileVersionHistory 
        filePath={item.path}
        isOpen={versionHistoryOpen}
        onClose={() => setVersionHistoryOpen(false)}
      />
      
      {/* Save Version Dialog */}
      <Dialog open={saveVersionDialogOpen} onOpenChange={setSaveVersionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Version</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="version-description">Version Description</Label>
            <Input
              id="version-description"
              value={versionDescription}
              onChange={(e) => setVersionDescription(e.target.value)}
              placeholder="Enter a description for this version"
              className="w-full mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveVersionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVersionConfirm}>
              Save Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
