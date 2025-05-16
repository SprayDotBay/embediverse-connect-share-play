
export interface FileItem {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileItem[];
  isExpanded?: boolean;
  isActive?: boolean;
}

export interface FileOperationsContextValue {
  // File explorer state
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  activeFile: string;
  setActiveFile: React.Dispatch<React.SetStateAction<string>>;
  fileContents: Record<string, string>;
  setFileContents: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  
  // File operations
  handleFileSelect: (file: FileItem) => void;
  handleToggleFolder: (folder: FileItem) => void;
  handleRename: (file: FileItem, newName: string) => void;
  handleDelete: (file: FileItem) => void;
  handleCreateFile: (parentPath: string, fileName: string) => void;
  handleCreateFolder: (parentPath: string, folderName: string) => void;
  handleDuplicateFile: (file: FileItem) => void;
  handleSave: () => void;
  processImportedFile: (file: File) => Promise<string | null>;
  
  // Utils
  findFileInTree: (fileTree: FileItem[], path: string) => FileItem | null;
  getFileParentPath: (filePath: string) => string;
  getFileName: (filePath: string) => string;
}
