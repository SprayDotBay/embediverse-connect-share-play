
import React from "react";
import { useCodeEditor } from "@/contexts/CodeEditorContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Clock, RotateCcw, Download, FileText } from "lucide-react";

interface FileVersionHistoryProps {
  filePath: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Component to display and manage version history for a file
 * Allows users to view, restore, and export previous versions
 */
export const FileVersionHistory: React.FC<FileVersionHistoryProps> = ({
  filePath,
  isOpen,
  onClose
}) => {
  const { 
    fileVersions, 
    handleRestoreVersion,
    exportVersionHistory,
    formatDate,
    getFileName
  } = useCodeEditor();

  const versions = fileVersions?.[filePath] || [];
  const fileName = getFileName ? getFileName(filePath) : filePath.split('/').pop() || 'Unknown';

  // Fallback format date function
  const formatVersionDate = (timestamp: number): string => {
    if (formatDate) {
      return formatDate(timestamp);
    }
    return new Date(timestamp).toLocaleString();
  };

  // Handle restore with safety check
  const handleRestore = (index: number) => {
    if (handleRestoreVersion) {
      handleRestoreVersion(filePath, index);
    }
  };

  // Handle export with safety check
  const handleExport = () => {
    if (exportVersionHistory) {
      exportVersionHistory(filePath);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Version History
          </DialogTitle>
          <DialogDescription>
            {fileName} - {versions.length} version{versions.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>
        
        {versions.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 opacity-50 mb-2" />
            <p>No version history available</p>
            <p className="text-sm">Save versions to track changes over time</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] rounded-md border">
            <div className="p-4 space-y-4">
              {versions.map((version, index) => (
                <div
                  key={version.timestamp}
                  className="flex flex-col space-y-1 border-b pb-3 last:border-0"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{version.description}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatVersionDate(version.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(index)}
                      className="h-8"
                      disabled={!handleRestoreVersion}
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Restore
                    </Button>
                    
                    {index === 0 && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                        Latest
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={versions.length === 0 || !exportVersionHistory}
          >
            <Download className="h-4 w-4 mr-2" />
            Export History
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
