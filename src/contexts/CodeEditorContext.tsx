
/**
 * CodeEditorContext: Main context provider for the code editor functionality
 * 
 * This file sets up the context API for the entire code editor, combining:
 * - File explorer operations
 * - Code editing features
 * - Device control functionality
 * - Project templates
 * - Version history management
 */
import React, { createContext, useContext, useState } from 'react';
import { FileOperationsContextValue, CodeEditorState, ProjectTemplateActions, DeviceControlFeatures } from '@/types/fileExplorer';
import { useFileOperations } from "@/hooks/code-editor/useFileOperations";
import { useCodeEditorState } from "@/hooks/code-editor/useCodeEditor";
import { useProjectTemplates } from "@/hooks/code-editor/useProjectTemplates";
import { useSerialPort } from "@/hooks/useSerialPort";
import { useBleDevice } from "@/hooks/useBleDevice";
import { useGpioPins } from "@/hooks/useGpioPins";
import { useBleManager } from "@/hooks/code-editor/useBleManager";

// Create the context with all required properties from the combined types
type CombinedContextValue = FileOperationsContextValue & 
                           Partial<CodeEditorState> & 
                           Partial<ProjectTemplateActions> & 
                           Partial<DeviceControlFeatures>;

// Create the context with undefined as default value
const CodeEditorContext = createContext<CombinedContextValue | undefined>(undefined);

// Custom hook to use the code editor context
export const useCodeEditor = () => {
  const context = useContext(CodeEditorContext);
  if (!context) {
    throw new Error("useCodeEditor must be used within a CodeEditorProvider");
  }
  return context;
};

export const CodeEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Device control state
  const [activeDeviceTab, setActiveDeviceTab] = useState("serial");
  const [serialMessages, setSerialMessages] = useState<Array<{ timestamp: string; message: string; type: 'sent' | 'received' }>>([]);

  // Initialize our hooks
  const fileOps = useFileOperations();
  const editorState = useCodeEditorState({
    activeFile: fileOps.activeFile
  });
  const projectTemplates = useProjectTemplates({
    setFileContents: fileOps.setFileContents,
    handleFileSelect: fileOps.handleFileSelect
  });

  // Initialize device control hooks
  const serialHooks = useSerialPort();
  const bleDevice = useBleDevice();
  const gpioPinsHooks = useGpioPins();
  const { bleHooks, handleBleConnect } = useBleManager();

  // Device control handlers
  const handleSerialConnect = (port: string) => {
    console.log("Connecting to serial port:", port);
    // Implementation would depend on the serial hook
  };

  const handleGpioPinChange = (pin: number, value: boolean) => {
    console.log("GPIO pin change:", pin, value);
    if (gpioPinsHooks.updatePinValue) {
      gpioPinsHooks.updatePinValue(pin, value);
    }
  };

  const handleSendSerialMessage = (message: string) => {
    const timestamp = new Date().toISOString();
    setSerialMessages(prev => [...prev, { timestamp, message, type: 'sent' }]);
    
    if (serialHooks.writeData) {
      serialHooks.writeData(message);
    }
  };

  const handleClearSerialMessages = () => {
    setSerialMessages([]);
  };

  const handleExportSerialMessages = () => {
    const dataStr = JSON.stringify(serialMessages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'serial_messages.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Define the context value by combining all hooks
  const contextValue: CombinedContextValue = {
    // File operations
    ...fileOps,
    // Editor state
    ...editorState,
    // Project templates
    ...projectTemplates,
    // Device control state
    activeDeviceTab,
    setActiveDeviceTab,
    serialMessages,
    // Device hooks
    serialHooks,
    bleHooks,
    gpioPinsHooks,
    // Device handlers - wrapped to match expected signatures
    handleSerialConnect: () => handleSerialConnect(''),
    handleBleConnect: () => handleBleConnect(''),
    handleGpioPinChange,
    handleSendSerialMessage,
    handleClearSerialMessages,
    handleExportSerialMessages,
    // Ensure handleUpload has correct signature
    handleUpload: (isConnected: boolean) => {
      if (fileOps.handleUpload) {
        fileOps.handleUpload(isConnected);
      }
    }
  };

  return (
    <CodeEditorContext.Provider value={contextValue}>
      {children}
    </CodeEditorContext.Provider>
  );
};
