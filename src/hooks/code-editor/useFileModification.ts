
import { useCallback } from 'react';
import { FileItem } from '@/types/fileExplorer';
import { toast } from "@/hooks/use-toast";

export const useFileModification = (
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  activeFile: string,
  setActiveFile: React.Dispatch<React.SetStateAction<string>>,
  findNextFile: (items: FileItem[]) => FileItem | null,
  getFileParentPath: (filePath: string) => string,
  updateChildPaths: (children: FileItem[], oldParentPath: string, newParentPath: string) => FileItem[]
) => {
  // Rename a file or folder
  const handleRename = useCallback((file: FileItem, newName: string) => {
    const isDirectory = file.type === 'directory';
    const parentPath = getFileParentPath(file.path);
    const oldPath = file.path;
    const newPath = `${parentPath}/${newName}`;
    
    // Update file path in the tree
    setFiles(prevFiles => {
      const renameInTree = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          // If this is the item to rename
          if (item.path === oldPath) {
            return {
              ...item,
              name: newName,
              path: newPath,
              // If it's a directory, update paths of all children
              children: item.children ? updateChildPaths(item.children, oldPath, newPath) : undefined
            };
          } 
          // Check children
          else if (item.children) {
            return {
              ...item,
              children: renameInTree(item.children)
            };
          }
          return item;
        });
      };
      
      return renameInTree(prevFiles);
    });
    
    // Update active file if needed
    if (activeFile === oldPath) {
      setActiveFile(newPath);
    }
    
    toast({
      title: `${isDirectory ? 'Folder' : 'File'} Renamed`,
      description: `Renamed to ${newName} successfully.`
    });
  }, [activeFile, getFileParentPath, setActiveFile, setFiles, updateChildPaths]);

  // Delete a file or folder
  const handleDelete = useCallback((file: FileItem) => {
    const isDirectory = file.type === 'directory';
    const pathToDelete = file.path;
    const parentPath = getFileParentPath(pathToDelete);
    
    // Remove from the file tree
    setFiles(prevFiles => {
      const deleteFromTree = (items: FileItem[]): FileItem[] => {
        // Filter out the item to delete at this level
        const filteredItems = items.filter(item => item.path !== pathToDelete);
        
        // If we didn't find the item at this level, look in children
        if (filteredItems.length === items.length) {
          return items.map(item => {
            if (item.children) {
              return {
                ...item,
                children: deleteFromTree(item.children)
              };
            }
            return item;
          });
        }
        
        return filteredItems;
      };
      
      return deleteFromTree(prevFiles);
    });
    
    // If we deleted the active file, set a new active file
    if (activeFile === pathToDelete || activeFile.startsWith(pathToDelete + '/')) {
      // Find another file to make active
      setFiles(prevFiles => {
        const nextFile = findNextFile(prevFiles);
        if (nextFile) {
          setActiveFile(nextFile.path);
        }
        return prevFiles;
      });
    }
    
    toast({
      title: `${isDirectory ? 'Folder' : 'File'} Deleted`,
      description: `${file.name} has been deleted successfully.`
    });
  }, [activeFile, findNextFile, getFileParentPath, setActiveFile, setFiles]);

  return {
    handleRename,
    handleDelete
  };
};
