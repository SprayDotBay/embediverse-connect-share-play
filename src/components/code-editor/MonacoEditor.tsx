
import React, { useRef, useEffect } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";

interface MonacoEditorProps {
  code: string;
  language: string;
  theme?: string;
  onChange: (value: string | undefined) => void;
  height?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  code,
  language,
  theme = "vs-dark",
  onChange,
  height = "100%",
  options = {}
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Setup editor
    setupEditor(monaco);
    
    // Focus the editor
    editor.focus();
  };
  
  // Configure Monaco editor features
  const setupEditor = (monaco: Monaco) => {
    // Configure editor features for embedded development
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      lib: ["es2020"]
    });
    
    // Add Arduino code snippets
    monaco.languages.registerCompletionItemProvider('cpp', {
      provideCompletionItems: () => {
        return {
          suggestions: [
            {
              label: 'setup',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'void setup() {\n\t${1}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Arduino setup function'
            },
            {
              label: 'loop',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'void loop() {\n\t${1}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Arduino loop function'
            },
            {
              label: 'digitalWrite',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'digitalWrite(${1:pin}, ${2:value});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Set a digital pin to HIGH or LOW'
            },
            {
              label: 'digitalRead',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'digitalRead(${1:pin});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Read a digital pin value'
            },
            {
              label: 'analogRead',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'analogRead(${1:pin});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Read an analog pin value'
            },
            {
              label: 'analogWrite',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'analogWrite(${1:pin}, ${2:value});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Write an analog value to a pin'
            },
            {
              label: 'delay',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'delay(${1:ms});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Delay execution for a number of milliseconds'
            }
          ]
        };
      }
    });
  };
  
  // Update code when language changes to ensure syntax highlighting is correct
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        // To ensure proper language is set when switching files
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        language={language}
        theme={theme}
        value={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          fontLigatures: true,
          ...options
        }}
      />
    </div>
  );
};
