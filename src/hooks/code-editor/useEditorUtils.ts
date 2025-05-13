
import { useCallback } from 'react';
import { getLanguageFromFile } from "@/utils/codeTemplates";

// Utility functions for code editor
export const useEditorUtils = (activeFile: string) => {
  // Get the current active file language for the editor
  const getEditorLanguage = useCallback(() => {
    return getLanguageFromFile(activeFile);
  }, [activeFile]);

  return {
    getEditorLanguage
  };
};
