
import { useState, useCallback } from 'react';
import { FileItem } from '@/types/fileExplorer';
import { toast } from "@/hooks/use-toast";

export const useFileExplorer = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      name: "src",
      type: "directory",
      path: "src",
      isExpanded: true,
      children: [
        {
          name: "main.ino",
          type: "file",
          path: "src/main.ino",
          isActive: false
        },
        {
          name: "sensor.h",
          type: "file",
          path: "src/sensor.h",
          isActive: true
        },
        {
          name: "sensor.cpp",
          type: "file",
          path: "src/sensor.cpp",
          isActive: false
        }
      ]
    },
    {
      name: "lib",
      type: "directory",
      path: "lib",
      isExpanded: false,
      children: [
        {
          name: "GPIOViewer.h",
          type: "file",
          path: "lib/GPIOViewer.h",
          isActive: false
        },
        {
          name: "GPIOViewer.cpp",
          type: "file",
          path: "lib/GPIOViewer.cpp",
          isActive: false
        }
      ]
    }
  ]);

  const [activeFile, setActiveFile] = useState<string>("src/sensor.h");

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
  }, []);
  
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
  }, []);

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
    
    // Also create empty content for the file
    const newFilePath = `${parentPath}/${fileName}`;
    toast({
      title: "File Created",
      description: `Created ${fileName} successfully.`
    });
    
    return newFilePath;
  }, []);

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
  }, []);

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
  }, [activeFile, getFileParentPath]);

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
      const nextFile = findNextFile(files);
      if (nextFile) {
        setActiveFile(nextFile.path);
      }
    }
    
    toast({
      title: `${isDirectory ? 'Folder' : 'File'} Deleted`,
      description: `${file.name} has been deleted successfully.`
    });
  }, [activeFile, files, getFileParentPath]);

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

  return {
    files,
    setFiles,
    activeFile,
    setActiveFile,
    handleFileSelect,
    handleToggleFolder,
    handleCreateFile,
    handleCreateFolder,
    handleRename,
    handleDelete,
    findFileInTree,
    getFileParentPath,
    getFileName
  };
};
