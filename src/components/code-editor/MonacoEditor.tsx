
import React from "react";
import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  code: string;
  language: string;
  theme?: string;
  onChange: (value: string | undefined) => void;
  height?: string;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  code,
  language,
  theme = "vs-dark",
  onChange,
  height = "100%"
}) => {
  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        language={language}
        theme={theme}
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};
