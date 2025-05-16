
/**
 * Hook to manage file version history
 * Provides functionality to track, save, and restore different versions of files
 */
import { useState, useCallback } from 'react';
import { FileVersion } from '@/types/fileExplorer';
import { toast } from "@/hooks/use-toast";

export const useFileVersionHistory = (
  activeFile: string, 
  fileContents: Record<string, string>,
  setFileContents: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  // Store version history for each file
  const [fileVersions, setFileVersions] = useState<Record<string, FileVersion[]>>({});

  // Save a new version of the current file
  const handleSaveVersion = useCallback((description: string) => {
    if (!activeFile || !fileContents[activeFile]) {
      toast({
        title: "No File Selected",
        description: "Please select a file to save a version",
        variant: "destructive"
      });
      return;
    }

    setFileVersions(prevVersions => {
      const currentVersions = prevVersions[activeFile] || [];
      
      // Create new version object
      const newVersion: FileVersion = {
        timestamp: Date.now(),
        content: fileContents[activeFile],
        description: description || `Version ${currentVersions.length + 1}`
      };
      
      return {
        ...prevVersions,
        [activeFile]: [newVersion, ...currentVersions]
      };
    });
    
    toast({
      title: "Version Saved",
      description: `Version saved: ${description || 'No description'}`
    });
  }, [activeFile, fileContents]);

  // Restore file to a previous version
  const handleRestoreVersion = useCallback((filePath: string, versionIndex: number) => {
    const versions = fileVersions[filePath];
    if (!versions || !versions[versionIndex]) {
      toast({
        title: "Version Not Found",
        description: "The requested version could not be found",
        variant: "destructive"
      });
      return;
    }
    
    // Update the file content with the selected version
    setFileContents(prevContents => ({
      ...prevContents,
      [filePath]: versions[versionIndex].content
    }));
    
    toast({
      title: "Version Restored",
      description: `Restored to: ${versions[versionIndex].description}`
    });
  }, [fileVersions, setFileContents]);

  // Export versions as JSON file
  const exportVersionHistory = useCallback((filePath: string) => {
    const versions = fileVersions[filePath];
    if (!versions || versions.length === 0) {
      toast({
        title: "No Versions",
        description: "No version history to export",
        variant: "destructive"
      });
      return;
    }
    
    const fileData = JSON.stringify(versions, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filePath.split('/').pop()}_history.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "History Exported",
      description: `Version history exported for ${filePath.split('/').pop()}`
    });
  }, [fileVersions]);
  
  // Format date from timestamp
  const formatDate = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  }, []);

  return {
    fileVersions,
    setFileVersions,
    handleSaveVersion,
    handleRestoreVersion,
    exportVersionHistory,
    formatDate
  };
};
