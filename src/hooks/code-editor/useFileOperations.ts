
import { useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { useFileExplorer, FileItem } from "./useFileExplorer";
import { useCodeEditorState } from "./useCodeEditor";
import { useEditorUtils } from "./useEditorUtils";
import { useCodeEditorActions } from "./useCodeEditor";

export const useFileOperations = () => {
  const fileExplorerHooks = useFileExplorer();
  const { activeFile } = fileExplorerHooks;
  const editorHooks = useCodeEditorState({ activeFile });
  const editorUtils = useEditorUtils(activeFile);
  const editorActions = useCodeEditorActions();
  
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
    ...editorUtils,
    ...editorActions,
    handleSave
  };
};
