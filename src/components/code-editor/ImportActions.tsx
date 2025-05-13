
import React from "react";
import { toast } from "@/hooks/use-toast";
import { openFileDialog } from "@/utils/fileOperations";

interface ImportActionsProps {
  processImportedFile: (file: File) => Promise<string | null>;
}

export const useImportActions = ({ processImportedFile }: ImportActionsProps) => {
  // Handle importing files from user's computer
  const handleImport = () => {
    openFileDialog(".cpp,.h,.ino,.py,.js,.json", async (files) => {
      if (files.length > 0) {
        await processImportedFile(files[0]);
      }
    });
  };
  
  return {
    handleImport
  };
};
