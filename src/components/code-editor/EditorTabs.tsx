
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MonacoEditor } from "@/components/code-editor/MonacoEditor";

interface EditorTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  fileContents: Record<string, string>;
  activeFile: string;
  handleCodeChange: (value: string | undefined) => void;
  getEditorLanguage: (filePath: string) => string;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  activeTab,
  setActiveTab,
  fileContents,
  activeFile,
  handleCodeChange,
  getEditorLanguage
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
      <TabsContent value="code" className="flex-1 overflow-hidden m-0 p-0">
        <MonacoEditor
          code={fileContents[activeFile] || ''}
          language={getEditorLanguage(activeFile)}
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
              language={getEditorLanguage(activeFile)}
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
  );
};
