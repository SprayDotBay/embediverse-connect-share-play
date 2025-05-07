
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Save } from "lucide-react";
import { useCodeEditor } from "@/contexts/CodeEditorContext";

export const CodeEditorHeader: React.FC = () => {
  const { handleSave, handleUpload, handleCreateEsp32Project } = useCodeEditor();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">Code Editor</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleCreateEsp32Project}>
          Create ESP32 Project
        </Button>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
};
