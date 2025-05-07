
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useFileExplorer, FileItem } from "@/hooks/code-editor/useFileExplorer";
import { useCodeEditor } from "@/hooks/code-editor/useCodeEditor";
import { useSerialMonitor, SerialMessage } from "@/hooks/code-editor/useSerialMonitor";
import { useBleManager } from "@/hooks/code-editor/useBleManager";
import { useGpioControl } from "@/hooks/code-editor/useGpioControl";
import { useProjectTemplates } from "@/hooks/code-editor/useProjectTemplates";

interface CodeEditorContextType {
  // File explorer state
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  activeFile: string;
  setActiveFile: React.Dispatch<React.SetStateAction<string>>;
  
  // Code editor state
  fileContents: Record<string, string>;
  setFileContents: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  activeDeviceTab: string;
  setActiveDeviceTab: React.Dispatch<React.SetStateAction<string>>;
  
  // Serial communication state
  serialMessages: SerialMessage[];
  setSerialMessages: React.Dispatch<React.SetStateAction<SerialMessage[]>>;
  
  // Serial port hooks
  serialHooks: ReturnType<typeof import("@/hooks/useSerialPort").useSerialPort>;
  
  // BLE hooks
  bleHooks: ReturnType<typeof import("@/hooks/useBleDevice").useBleDevice>;
  
  // GPIO pins state
  gpioPinsHooks: ReturnType<typeof import("@/hooks/useGpioPins").useGpioPins>;
  
  // Editor actions
  handleFileSelect: (file: FileItem) => void;
  handleToggleFolder: (folder: FileItem) => void;
  handleCodeChange: (value: string | undefined) => void;
  handleVerify: () => void;
  handleFormat: () => void;
  handleUpload: () => void;
  handleSave: () => void;
  
  // Serial communication handlers
  handleSendSerialMessage: (message: string) => void;
  handleSerialConnect: (portPath: string) => Promise<void>;
  handleBleConnect: (deviceId: string) => Promise<void>;
  handleClearSerialMessages: () => void;
  handleExportSerialMessages: () => void;
  
  // GPIO pin handlers
  handleGpioPinChange: (pin: number, value: boolean) => void;
  
  // Project templates
  handleCreateEsp32Project: () => void;
  
  // Utilities
  getEditorLanguage: () => string;
}

const CodeEditorContext = createContext<CodeEditorContextType | null>(null);

export const CodeEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize hooks
  const fileExplorerHooks = useFileExplorer();
  const { activeFile, setActiveFile } = fileExplorerHooks;
  
  const editorHooks = useCodeEditor(activeFile, setActiveFile);
  const serialMonitorHooks = useSerialMonitor();
  const bleManagerHooks = useBleManager();
  const gpioControlHooks = useGpioControl(
    serialMonitorHooks.serialHooks,
    serialMonitorHooks.setSerialMessages
  );
  
  const projectTemplateHooks = useProjectTemplates({
    setFileContents: editorHooks.setFileContents,
    handleFileSelect: fileExplorerHooks.handleFileSelect,
  });

  // Process GPIO data from serial messages
  useEffect(() => {
    // Set up a watcher for serial messages to process GPIO data
    const processGpioData = (message: SerialMessage) => {
      if (message.type === 'received') {
        gpioControlHooks.gpioPinsHooks.processSerialData(message.content);
      }
    };

    // Process the last message if it exists
    const lastMessage = serialMonitorHooks.serialMessages[serialMonitorHooks.serialMessages.length - 1];
    if (lastMessage) {
      processGpioData(lastMessage);
    }
  }, [serialMonitorHooks.serialMessages, gpioControlHooks.gpioPinsHooks]);

  // Adapter function for upload that uses the serial connection status
  const handleUpload = () => {
    editorHooks.handleUpload(
      serialMonitorHooks.serialHooks.isConnected || bleManagerHooks.bleHooks.isConnected
    );
  };

  return (
    <CodeEditorContext.Provider
      value={{
        // File explorer
        ...fileExplorerHooks,
        
        // Code editor
        ...editorHooks,
        
        // Serial monitor
        ...serialMonitorHooks,
        
        // BLE manager
        ...bleManagerHooks,
        
        // GPIO control
        ...gpioControlHooks,
        
        // Project templates
        ...projectTemplateHooks,
        
        // Override upload to check connection status
        handleUpload
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  );
};

export const useCodeEditor = (): CodeEditorContextType => {
  const context = useContext(CodeEditorContext);
  if (!context) {
    throw new Error('useCodeEditor must be used within a CodeEditorProvider');
  }
  return context;
};
