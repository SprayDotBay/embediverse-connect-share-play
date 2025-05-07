
import { useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { getLanguageFromFile } from "@/utils/codeTemplates";
import { useFileExplorer, FileItem } from "./useFileExplorer";
import { useCodeEditorState } from "./useCodeEditor";

export const useFileOperations = () => {
  const fileExplorerHooks = useFileExplorer();
  const { activeFile } = fileExplorerHooks;
  const editorHooks = useCodeEditorState(activeFile);
  
  // Get the current active file language for the editor
  const getEditorLanguage = useCallback(() => {
    return getLanguageFromFile(activeFile);
  }, [activeFile]);
  
  // Handle saving files
  const handleSave = useCallback(() => {
    toast({
      title: "File Saved",
      description: `${activeFile.split('/').pop() || ''} saved successfully.`,
    });
  }, [activeFile]);
  
  return {
    ...fileExplorerHooks,
    ...editorHooks,
    getEditorLanguage,
    handleSave
  };
};
