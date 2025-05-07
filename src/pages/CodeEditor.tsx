
import React from "react";
import { CodeEditorProvider } from "@/contexts/CodeEditorContext";
import { CodeEditorHeader } from "@/components/code-editor/CodeEditorHeader";
import { FileExplorer } from "@/components/code-editor/FileExplorer";
import { CodeEditorPanel } from "@/components/code-editor/CodeEditorPanel";
import { DeviceControlPanel } from "@/components/code-editor/DeviceControlPanel";
import { useCodeEditor } from "@/contexts/CodeEditorContext";

const CodeEditorContent: React.FC = () => {
  const { files, handleFileSelect, handleToggleFolder } = useCodeEditor();
  
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 h-[calc(100vh-12rem)]">
        <CodeEditorHeader />

        <div className="grid gap-6 grid-cols-5 h-full">
          {/* File Explorer */}
          <div className="col-span-1">
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onToggleFolder={handleToggleFolder}
            />
          </div>

          {/* Code Editor Panel */}
          <CodeEditorPanel />

          {/* Device Connection and Serial Monitor */}
          <DeviceControlPanel />
        </div>
      </div>
    </div>
  );
};

const CodeEditor: React.FC = () => {
  return (
    <CodeEditorProvider>
      <CodeEditorContent />
    </CodeEditorProvider>
  );
};

export default CodeEditor;
