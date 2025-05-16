
import React, { createContext, useContext } from 'react';
import { FileOperationsContextValue } from '@/types/fileExplorer';
import { useFileOperations } from "@/hooks/code-editor/useFileOperations";
import { useCodeEditorState } from "@/hooks/code-editor/useCodeEditor";
import { useProjectTemplates } from "@/hooks/code-editor/useProjectTemplates";

// Create the context
const CodeEditorContext = createContext<FileOperationsContextValue | undefined>(undefined);

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
  const projectTemplates = useProjectTemplates();

  // Define the context value
  const contextValue: FileOperationsContextValue = {
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
