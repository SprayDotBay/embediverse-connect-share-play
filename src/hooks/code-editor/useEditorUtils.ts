
import { getLanguageFromFile } from "@/utils/codeTemplates";

export const useEditorUtils = (activeFile: string) => {
  // Get the appropriate language for Monaco Editor based on file extension
  const getEditorLanguage = (filePath: string): string => {
    return getLanguageFromFile(filePath);
  };

  // Get just the filename from a full path
  const getFileName = (filePath: string): string => {
    return filePath.split('/').pop() || '';
  };

  return {
    getEditorLanguage,
    getFileName
  };
};
