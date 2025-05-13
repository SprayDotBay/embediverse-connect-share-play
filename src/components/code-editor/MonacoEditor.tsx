
import React, { useRef, useEffect } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import * as monaco from "monaco-editor";

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
  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    
    // Setup editor
    setupEditor(monacoInstance);
    
    // Focus the editor
    editor.focus();
  };
  
  // Configure Monaco editor features
  const setupEditor = (monacoInstance: Monaco) => {
    // Configure editor features for embedded development
    monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monacoInstance.languages.typescript.ModuleKind.CommonJS,
      lib: ["es2020"]
    });
    
    // Add Arduino code snippets
    monacoInstance.languages.registerCompletionItemProvider('cpp', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };
        
        return {
          suggestions: [
            {
              label: 'setup',
              kind: monacoInstance.languages.CompletionItemKind.Snippet,
              insertText: 'void setup() {\n\t${1}\n}',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Arduino setup function',
              range: range
            },
            {
              label: 'loop',
              kind: monacoInstance.languages.CompletionItemKind.Snippet,
              insertText: 'void loop() {\n\t${1}\n}',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Arduino loop function',
              range: range
            },
            {
              label: 'digitalWrite',
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertText: 'digitalWrite(${1:pin}, ${2:value});',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Set a digital pin to HIGH or LOW',
              range: range
            },
            {
              label: 'digitalRead',
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertText: 'digitalRead(${1:pin});',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Read a digital pin value',
              range: range
            },
            {
              label: 'analogRead',
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertText: 'analogRead(${1:pin});',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Read an analog pin value',
              range: range
            },
            {
              label: 'analogWrite',
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertText: 'analogWrite(${1:pin}, ${2:value});',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Write an analog value to a pin',
              range: range
            },
            {
              label: 'delay',
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertText: 'delay(${1:ms});',
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Delay execution for a number of milliseconds',
              range: range
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
        editorRef.current.getModel()?.getLanguageId() !== language && 
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
