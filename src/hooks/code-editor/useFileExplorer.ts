
import { useState } from 'react';

export interface FileItem {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileItem[];
  isExpanded?: boolean;
  isActive?: boolean;
}

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
  const handleFileSelect = (file: FileItem) => {
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
  };
  
  // Handle folder toggle
  const handleToggleFolder = (folder: FileItem) => {
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
  };

  return {
    files,
    setFiles,
    activeFile,
    setActiveFile,
    handleFileSelect,
    handleToggleFolder
  };
};
