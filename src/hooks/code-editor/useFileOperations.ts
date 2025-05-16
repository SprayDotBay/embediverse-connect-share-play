
import { useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { useFileExplorer } from "./useFileExplorer";
import { useCodeEditorState } from "./useCodeEditor";
import { useEditorUtils } from "./useEditorUtils";
import { useCodeEditorActions } from "./useCodeEditor";
import { useFileVersionHistory } from "./useFileVersionHistory";
import { FileItem } from '@/types/fileExplorer';

/**
 * Main hook for file operations in the code editor
 * Combines functionality from multiple specialized hooks to provide a complete
 * file management system with version history
 */
export const useFileOperations = () => {
  // Get file explorer hooks for basic file operations
  const fileExplorerHooks = useFileExplorer();
  const { activeFile, fileContents, setFileContents } = fileExplorerHooks;
  
  // Get editor state, utilities, and actions
  const editorHooks = useCodeEditorState({ activeFile });
  const editorUtils = useEditorUtils(activeFile);
  const editorActions = useCodeEditorActions();
  
  // Initialize version history management
  const versionHooks = useFileVersionHistory(activeFile, fileContents, setFileContents);
  
  // Handle saving files with optional version creation
  const handleSave = useCallback((createVersion = false, versionDescription = '') => {
    // If createVersion is true, also save a version
    if (createVersion) {
      versionHooks.handleSaveVersion(versionDescription);
    }
    
    toast({
      title: "File Saved",
      description: `${activeFile.split('/').pop() || ''} saved successfully.`,
    });
  }, [activeFile, versionHooks]);
  
  // Handle duplicating a file
  const handleDuplicateFile = useCallback((file: FileItem) => {
    const { handleCreateFile, getFileParentPath } = fileExplorerHooks;
    
    if (file.type === 'directory') {
      toast({
        title: "Not Supported",
        description: "Duplicating folders is not supported yet",
        variant: "destructive"
      });
      return;
    }
    
    const parentPath = getFileParentPath(file.path);
    const fileName = file.name;
    const fileExtension = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
    const fileBaseName = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
    const newFileName = `${fileBaseName}_copy${fileExtension}`;
    
    // Create the new file
    const newFilePath = handleCreateFile(parentPath, newFileName);
    
    // Copy the content if available
    if (fileContents[file.path]) {
      setFileContents(prev => ({
        ...prev,
        [newFilePath]: fileContents[file.path]
      }));
    }
    
    toast({
      title: "File Duplicated",
      description: `${fileName} duplicated as ${newFileName}.`
    });
  }, [fileExplorerHooks, fileContents, setFileContents]);
  
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
    ...versionHooks,
    handleSave,
    handleDuplicateFile,
    processImportedFile
  };
};
