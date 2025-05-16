
import { useCallback } from 'react';
import { FileItem } from '@/types/fileExplorer';
import { toast } from "@/hooks/use-toast";

export const useFileCreation = (
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
) => {
  // Create a new file
  const handleCreateFile = useCallback((parentPath: string, fileName: string) => {
    setFiles(prevFiles => {
      const createFileInTree = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.path === parentPath) {
            // This is the parent directory
            const newFilePath = `${parentPath}/${fileName}`;
            
            // Check if file already exists
            const fileExists = item.children?.some(child => child.path === newFilePath);
            
            if (fileExists) {
              toast({
                title: "File already exists",
                description: `${fileName} already exists in this directory.`,
                variant: "destructive"
              });
              return item;
            }
            
            return {
              ...item,
              isExpanded: true, // Expand the folder
              children: [
                ...(item.children || []),
                {
                  name: fileName,
                  type: "file",
                  path: newFilePath,
                  isActive: false
                }
              ]
            };
          } 
          else if (item.children) {
            return {
              ...item,
              children: createFileInTree(item.children)
            };
          }
          return item;
        });
      };
      
      return createFileInTree(prevFiles);
    });
    
    // Return the new file path
    const newFilePath = `${parentPath}/${fileName}`;
    toast({
      title: "File Created",
      description: `Created ${fileName} successfully.`
    });
    
    return newFilePath;
  }, [setFiles]);

  // Create a new folder
  const handleCreateFolder = useCallback((parentPath: string, folderName: string) => {
    setFiles(prevFiles => {
      const createFolderInTree = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.path === parentPath) {
            // This is the parent directory
            const newFolderPath = `${parentPath}/${folderName}`;
            
            // Check if folder already exists
            const folderExists = item.children?.some(child => child.path === newFolderPath);
            
            if (folderExists) {
              toast({
                title: "Folder already exists",
                description: `${folderName} already exists in this directory.`,
                variant: "destructive"
              });
              return item;
            }
            
            return {
              ...item,
              isExpanded: true, // Expand the folder
              children: [
                ...(item.children || []),
                {
                  name: folderName,
                  type: "directory",
                  path: newFolderPath,
                  isExpanded: true,
                  children: []
                }
              ]
            };
          } 
          else if (item.children) {
            return {
              ...item,
              children: createFolderInTree(item.children)
            };
          }
          return item;
        });
      };
      
      return createFolderInTree(prevFiles);
    });
    
    toast({
      title: "Folder Created",
      description: `Created folder ${folderName} successfully.`
    });
  }, [setFiles]);

  return {
    handleCreateFile,
    handleCreateFolder
  };
};
