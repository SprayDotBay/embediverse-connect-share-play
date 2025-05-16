
import React from "react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { FileItem } from "@/types/fileExplorer";
import { Pencil, Copy, Trash2, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { downloadFile } from "@/utils/fileOperations";

interface FileContextMenuProps {
  item: FileItem;
  children: React.ReactNode;
  onRename: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  fileContents?: Record<string, string>;
}

export const FileContextMenu: React.FC<FileContextMenuProps> = ({
  item,
  children,
  onRename,
  onDelete,
  fileContents = {}
}) => {
  const isDirectory = item.type === "directory";
  
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

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleRename} className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
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
  );
};
