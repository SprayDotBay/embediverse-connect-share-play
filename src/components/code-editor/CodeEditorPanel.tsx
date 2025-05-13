
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { EditorToolbar } from "@/components/code-editor/EditorToolbar";
import { useCodeEditor } from "@/contexts/CodeEditorContext";
import { downloadFile } from "@/utils/fileOperations";
import { toast } from "@/hooks/use-toast";
import { GitHubImportDialog } from "@/components/code-editor/GitHubImportDialog";
import { FileItem } from "@/types/fileExplorer";
import { EditorTabs } from "@/components/code-editor/EditorTabs";
import { useImportActions } from "@/components/code-editor/ImportActions";

export const CodeEditorPanel: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeFile, 
    fileContents, 
    handleCodeChange, 
    handleVerify, 
    handleFormat, 
    handleUpload, 
    handleSave,
    getEditorLanguage,
    setFileContents,
    setFiles,
    files,
    processImportedFile
  } = useCodeEditor();
  
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);
  
  const { handleImport } = useImportActions({ processImportedFile });
  
  // Handle downloading the current file
  const handleDownload = () => {
    if (activeFile) {
      const fileName = activeFile.split('/').pop() || 'code.txt';
      downloadFile(fileName, fileContents[activeFile] || '');
      toast({
        title: "File Downloaded",
        description: `${fileName} has been downloaded to your computer.`
      });
    }
  };
  
  // Handle importing from GitHub
  const handleGithubImport = () => {
    setGithubDialogOpen(true);
  };
  
  // Process imported GitHub files
  const handleGithubImportComplete = (importedContents: Record<string, string>, importedFiles: FileItem[]) => {
    // Update file contents
    setFileContents(prev => ({
      ...prev,
      ...importedContents
    }));
    
    // Update file explorer with new structure
    setFiles(importedFiles);
    
    toast({
      title: "GitHub Import Complete",
      description: `Successfully imported ${Object.keys(importedContents).length} files from GitHub.`
    });
  };
  
  return (
    <Card className="col-span-2 h-full overflow-hidden flex flex-col">
      <EditorToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onVerify={handleVerify}
        onFormat={handleFormat}
        onUpload={handleUpload}
        onSave={handleSave}
        onDownload={handleDownload}
        onImport={handleImport}
        onGithubImport={handleGithubImport}
        filename={activeFile.split('/').pop() || ''}
      />
      
      <EditorTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fileContents={fileContents}
        activeFile={activeFile}
        handleCodeChange={handleCodeChange}
        getEditorLanguage={getEditorLanguage}
      />
      
      {/* GitHub import dialog */}
      <GitHubImportDialog 
        open={githubDialogOpen} 
        onOpenChange={setGithubDialogOpen} 
        onImportComplete={handleGithubImportComplete}
      />
    </Card>
  );
};
