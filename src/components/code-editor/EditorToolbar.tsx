
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Upload } from "lucide-react";

interface EditorToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onVerify: () => void;
  onFormat: () => void;
  onUpload: () => void;
  onSave: () => void;
  filename: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeTab,
  onTabChange,
  onVerify,
  onFormat,
  onUpload,
  onSave,
  filename
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="split">Split View</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex gap-2 items-center">
        <span className="text-xs bg-muted px-2 py-1 rounded-md">{filename}</span>
        <Button variant="ghost" size="sm" onClick={onVerify}>Verify</Button>
        <Button variant="ghost" size="sm" onClick={onFormat}>Format</Button>
        <Button size="sm" onClick={onUpload}>Upload to Device</Button>
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
};
