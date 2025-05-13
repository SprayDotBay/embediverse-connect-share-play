
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MonacoEditor } from "@/components/code-editor/MonacoEditor";
import { EditorToolbar } from "@/components/code-editor/EditorToolbar";
import { useCodeEditor } from "@/contexts/CodeEditorContext";
import { downloadFile, openFileDialog, readUploadedFile } from "@/utils/fileOperations";
import { toast } from "@/hooks/use-toast";
import { GitHubImportDialog } from "@/components/code-editor/GitHubImportDialog";
import { FileItem } from "@/hooks/code-editor/useFileExplorer";

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
    files
  } = useCodeEditor();
  
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);
  
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
  
  // Handle importing files from user's computer
  const handleImport = () => {
    openFileDialog(".cpp,.h,.ino,.py,.js,.json", async (files) => {
      try {
        if (files.length > 0) {
          const file = files[0];
          const content = await readUploadedFile(file);
          
          // Create a new file path based on current directory structure
          const fileName = file.name;
          const filePath = `src/${fileName}`;
          
          // Update file contents
          setFileContents(prev => ({
            ...prev,
            [filePath]: content
          }));
          
          // Add file to explorer if it doesn't exist
          const fileExists = findFileInTree(files, filePath);
          
          if (!fileExists) {
            // Add new file to src directory
            setFiles(prevFiles => {
              const updatedFiles = [...prevFiles];
              
              // Find src directory
              const srcDir = updatedFiles.find(item => item.name === 'src');
              
              if (srcDir && srcDir.children) {
                srcDir.children.push({
                  name: fileName,
                  type: 'file',
                  path: filePath,
                  isActive: false
                });
              }
              
              return updatedFiles;
            });
          }
          
          toast({
            title: "File Imported",
            description: `${fileName} has been imported successfully.`
          });
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import the file. Please try again.",
          variant: "destructive"
        });
      }
    });
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
  
  // Helper to find a file in the file tree
  const findFileInTree = (fileTree: FileItem[], path: string): boolean => {
    for (const item of fileTree) {
      if (item.path === path) return true;
      if (item.children) {
        const found = findFileInTree(item.children, path);
        if (found) return true;
      }
    }
    return false;
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsContent value="code" className="flex-1 overflow-hidden m-0 p-0">
          <MonacoEditor
            code={fileContents[activeFile] || ''}
            language={getEditorLanguage()}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              tabSize: 2,
              fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              fontLigatures: true
            }}
          />
        </TabsContent>

        <TabsContent value="visual" className="flex-1 overflow-hidden m-0 p-0">
          <div className="h-full p-6 flex items-center justify-center bg-muted">
            <div className="text-center">
              <div className="inline-block p-10 bg-card rounded-lg mb-4 circuit-pattern">
                <div className="w-24 h-24 bg-blue-medium/10 rounded-lg flex items-center justify-center">
                  <div className="animate-spin-slow">
                    <div className="w-16 h-16 rounded-lg border-4 border-dashed border-primary"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Visual Editor</h3>
              <p className="text-muted-foreground max-w-md">
                The visual editor allows you to build your circuit and code using a drag-and-drop interface. Select components from the panel on the right.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="split" className="flex-1 overflow-hidden m-0 p-0">
          <div className="h-full flex">
            <div className="w-1/2 border-r">
              <MonacoEditor
                code={fileContents[activeFile] || ''}
                language={getEditorLanguage()}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  tabSize: 2,
                  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                  fontLigatures: true
                }}
              />
            </div>
            <div className="w-1/2 p-6 flex items-center justify-center bg-muted">
              <div className="text-center">
                <div className="inline-block p-8 bg-card rounded-lg mb-4 circuit-pattern">
                  <div className="w-16 h-16 bg-blue-medium/10 rounded-lg flex items-center justify-center">
                    <div className="animate-float">
                      <div className="w-10 h-10 rounded-lg border-2 border-dashed border-primary"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-medium mb-1">Visual Preview</h3>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Circuit visualization based on your code
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* GitHub import dialog */}
      <GitHubImportDialog 
        open={githubDialogOpen} 
        onOpenChange={setGithubDialogOpen} 
        onImportComplete={handleGithubImportComplete}
      />
    </Card>
  );
};
