
import { useState, useCallback } from 'react';
import { FileItem } from '@/types/fileExplorer';
import { toast } from "@/hooks/use-toast";

export const useFileTreeOperations = (
  files: FileItem[],
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  activeFile: string,
  setActiveFile: React.Dispatch<React.SetStateAction<string>>
) => {
  // Find a file in the file tree by path
  const findFileInTree = useCallback((fileTree: FileItem[], path: string): FileItem | null => {
    for (const item of fileTree) {
      if (item.path === path) return item;
      if (item.children) {
        const found = findFileInTree(item.children, path);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Get parent path of a file
  const getFileParentPath = useCallback((filePath: string): string => {
    const parts = filePath.split('/');
    parts.pop(); // Remove file name
    return parts.join('/');
  }, []);

  // Get just the filename from a path
  const getFileName = useCallback((filePath: string): string => {
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((file: FileItem) => {
    if (file.type === 'file') {
      // Update active file in the files array
      setFiles(prevFiles => {
        const updateFileActive = (items: FileItem[]): FileItem[] => {
          return items.map(item => {
            if (item.children) {
              return {
                ...item,
                children: updateFileActive(item.children)
              };
            }
            return {
              ...item,
              isActive: item.path === file.path
            };
          });
        };
        
        return updateFileActive(prevFiles);
      });
      
      setActiveFile(file.path);
    }
  }, [setFiles, setActiveFile]);
  
  // Handle folder toggle
  const handleToggleFolder = useCallback((folder: FileItem) => {
    setFiles(prevFiles => {
      const updateFolder = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.path === folder.path) {
            return {
              ...item,
              isExpanded: !item.isExpanded
            };
          } else if (item.children) {
            return {
              ...item,
              children: updateFolder(item.children)
            };
          }
          return item;
        });
      };
      
      return updateFolder(prevFiles);
    });
  }, [setFiles]);

  // Helper function to find another file to make active
  const findNextFile = useCallback((items: FileItem[]): FileItem | null => {
    for (const item of items) {
      if (item.type === 'file') return item;
      if (item.children) {
        const found = findNextFile(item.children);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Helper function to update paths of all children when a directory is renamed
  const updateChildPaths = useCallback((children: FileItem[], oldParentPath: string, newParentPath: string): FileItem[] => {
    return children.map(child => {
      const newPath = child.path.replace(oldParentPath, newParentPath);
      return {
        ...child,
        path: newPath,
        children: child.children ? updateChildPaths(child.children, child.path, newPath) : undefined
      };
    });
  }, []);

  return {
    findFileInTree,
    getFileParentPath,
    getFileName,
    handleFileSelect,
    handleToggleFolder,
    findNextFile,
    updateChildPaths
  };
};
