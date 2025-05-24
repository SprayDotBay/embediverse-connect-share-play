
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
import React, { createContext, useContext } from 'react';
import { FileOperationsContextValue, CodeEditorState, ProjectTemplateActions, DeviceControlFeatures } from '@/types/fileExplorer';
import { useFileOperations } from "@/hooks/code-editor/useFileOperations";
import { useCodeEditorState } from "@/hooks/code-editor/useCodeEditor";
import { useProjectTemplates } from "@/hooks/code-editor/useProjectTemplates";

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
  // Initialize our hooks
  const fileOps = useFileOperations();
  const editorState = useCodeEditorState({
    activeFile: fileOps.activeFile
  });
  const projectTemplates = useProjectTemplates({
    setFileContents: fileOps.setFileContents,
    handleFileSelect: fileOps.handleFileSelect
  });

  // Define the context value by combining all hooks
  const contextValue: CombinedContextValue = {
    ...fileOps,
    ...editorState,
    ...projectTemplates
  };

  return (
    <CodeEditorContext.Provider value={contextValue}>
      {children}
    </CodeEditorContext.Provider>
  );
};
