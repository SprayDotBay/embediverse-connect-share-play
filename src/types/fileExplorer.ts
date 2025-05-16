
export interface FileItem {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileItem[];
  isExpanded?: boolean;
  isActive?: boolean;
}

export interface FileVersion {
  timestamp: number;
  content: string;
  description: string;
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
  handleCreateFile: (parentPath: string, fileName: string) => string;
  handleCreateFolder: (parentPath: string, folderName: string) => void;
  handleDuplicateFile: (file: FileItem) => void;
  handleSave: () => void;
  processImportedFile: (file: File) => Promise<string | null>;
  
  // Version history operations
  fileVersions: Record<string, FileVersion[]>;
  setFileVersions: React.Dispatch<React.SetStateAction<Record<string, FileVersion[]>>>;
  handleSaveVersion: (description: string) => void;
  handleRestoreVersion: (filePath: string, versionIndex: number) => void;
  
  // Utils
  findFileInTree: (fileTree: FileItem[], path: string) => FileItem | null;
  getFileParentPath: (filePath: string) => string;
  getFileName: (filePath: string) => string;
}

// Type for the editor state and code editor features
export interface CodeEditorState {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  activeDeviceTab: string;
  setActiveDeviceTab: React.Dispatch<React.SetStateAction<string>>;
  handleCodeChange: (value: string | undefined) => void;
  handleVerify: () => void;
  handleFormat: () => void;
  handleUpload: () => void;
  getEditorLanguage: (filePath: string) => string;
  activeFile: string;
}

// Type for project templates
export interface ProjectTemplateActions {
  handleCreateEsp32Project: () => void;
  handleCreateArduinoProject: () => void;
  handleCreateEmptyProject: () => void;
}

// Type for device control features
export interface DeviceControlFeatures {
  serialHooks: any;
  bleHooks: any;
  gpioPinsHooks: any;
  handleSerialConnect: () => void;
  handleBleConnect: () => void;
  handleGpioPinChange: (pin: number, value: boolean) => void;
  handleSendSerialMessage: (message: string) => void;
  handleClearSerialMessages: () => void;
  handleExportSerialMessages: () => void;
  serialMessages: any[];
}
