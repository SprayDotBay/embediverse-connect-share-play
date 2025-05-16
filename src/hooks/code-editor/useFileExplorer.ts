
import { useState } from 'react';
import { FileItem } from '@/types/fileExplorer';
import { useFileTreeOperations } from './useFileTreeOperations';
import { useFileCreation } from './useFileCreation';
import { useFileModification } from './useFileModification';

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
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  // Import operations from separate hooks
  const treeOperations = useFileTreeOperations(files, setFiles, activeFile, setActiveFile);
  
  const fileCreation = useFileCreation(setFiles);
  
  const fileModification = useFileModification(
    setFiles,
    activeFile,
    setActiveFile,
    treeOperations.findNextFile,
    treeOperations.getFileParentPath,
    treeOperations.updateChildPaths
  );

  return {
    // State
    files,
    setFiles,
    activeFile,
    setActiveFile,
    fileContents,
    setFileContents,
    
    // File tree operations
    handleFileSelect: treeOperations.handleFileSelect,
    handleToggleFolder: treeOperations.handleToggleFolder,
    findFileInTree: treeOperations.findFileInTree,
    getFileParentPath: treeOperations.getFileParentPath,
    getFileName: treeOperations.getFileName,
    
    // File creation operations
    handleCreateFile: fileCreation.handleCreateFile,
    handleCreateFolder: fileCreation.handleCreateFolder,
    
    // File modification operations
    handleRename: fileModification.handleRename,
    handleDelete: fileModification.handleDelete
  };
};
