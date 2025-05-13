
import React from "react";
import { toast } from "@/hooks/use-toast";
import { FileItem } from "@/hooks/code-editor/useFileExplorer";
import { openFileDialog, readUploadedFile } from "@/utils/fileOperations";

interface ImportActionsProps {
  setFileContents: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  files: FileItem[];
}

export const useImportActions = ({ 
  setFileContents, 
  setFiles, 
  files 
}: ImportActionsProps) => {
  // Process imported files and update the file explorer
  const processImportedFile = async (file: File) => {
    try {
      const content = await readUploadedFile(file);
      
      // Create a new file path based on current directory structure
      const fileName = file.name;
      const filePath = `src/${fileName}`;
      
      // Update file contents
      setFileContents(prev => ({
        ...prev,
        [filePath]: content
      }));
      
      // Add file to explorer if it doesn't exist
      const fileExists = findFileInTree(files, filePath);
      
      if (!fileExists) {
        // Add new file to src directory
        setFiles(prevFiles => {
          const updatedFiles = [...prevFiles];
          
          // Find src directory
          const srcDir = updatedFiles.find(item => item.name === 'src');
          
          if (srcDir && srcDir.children) {
            srcDir.children.push({
              name: fileName,
              type: 'file',
              path: filePath,
              isActive: false
            });
          }
          
          return updatedFiles;
        });
      }
      
      toast({
        title: "File Imported",
        description: `${fileName} has been imported successfully.`
      });

      return filePath;
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import the file. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Handle importing files from user's computer
  const handleImport = () => {
    openFileDialog(".cpp,.h,.ino,.py,.js,.json", async (files) => {
      if (files.length > 0) {
        await processImportedFile(files[0]);
      }
    });
  };
  
  // Helper to find a file in the file tree
  const findFileInTree = (fileTree: FileItem[], path: string): boolean => {
    for (const item of fileTree) {
      if (item.path === path) return true;
      if (item.children) {
        const found = findFileInTree(item.children, path);
        if (found) return true;
      }
    }
    return false;
  };

  return {
    handleImport,
    processImportedFile,
    findFileInTree
  };
};
