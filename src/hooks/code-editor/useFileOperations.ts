
import { useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { useFileExplorer } from "./useFileExplorer";
import { useCodeEditorState } from "./useCodeEditor";
import { useEditorUtils } from "./useEditorUtils";
import { useCodeEditorActions } from "./useCodeEditor";
import { FileItem } from '@/types/fileExplorer';

export const useFileOperations = () => {
  const fileExplorerHooks = useFileExplorer();
  const { activeFile, fileContents, setFileContents } = fileExplorerHooks;
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
  
  // Process a file uploaded by the user
  const processImportedFile = useCallback(async (file: File): Promise<string | null> => {
    const { setFileContents, handleCreateFile, getFileParentPath } = fileExplorerHooks;
    
    try {
      const reader = new FileReader();
      const content = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        reader.readAsText(file);
      });
      
      // Create a new file path based on current directory structure
      const fileName = file.name;
      const filePath = `src/${fileName}`;
      
      // Update file contents
      setFileContents(prev => ({
        ...prev,
        [filePath]: content
      }));
      
      // Create file in explorer if it doesn't exist
      const parentPath = getFileParentPath(filePath) || 'src';
      const newFilePath = handleCreateFile(parentPath, fileName);
      
      toast({
        title: "File Imported",
        description: `${fileName} has been imported successfully.`
      });

      return filePath;
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import the file. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [fileExplorerHooks]);

  return {
    ...fileExplorerHooks,
    ...editorHooks,
    ...editorUtils,
    ...editorActions,
    handleSave,
    processImportedFile,
    fileContents,
    setFileContents
  };
};
