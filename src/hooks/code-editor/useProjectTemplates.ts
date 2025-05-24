
import { toast } from "@/hooks/use-toast";
import { esp32Template } from "@/utils/codeTemplates";
import { FileItem } from "@/types/fileExplorer";

type UseProjectTemplatesProps = {
  setFileContents?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleFileSelect?: (file: FileItem) => void;
};

export const useProjectTemplates = ({ setFileContents, handleFileSelect }: UseProjectTemplatesProps = {}) => {
  // Create new ESP32 project with GPIO monitoring
  const handleCreateEsp32Project = () => {
    if (setFileContents) {
      setFileContents(prev => ({
        ...prev,
        "src/main.ino": esp32Template
      }));
    }
    
    if (handleFileSelect) {
      const mainInoFile = {
        name: "main.ino",
        type: "file" as const,
        path: "src/main.ino",
      };
      
      handleFileSelect(mainInoFile);
    }
    
    toast({
      title: "ESP32 Project Created",
      description: "New ESP32 project with GPIO monitoring has been created.",
    });
  };

  return {
    handleCreateEsp32Project
  };
};
