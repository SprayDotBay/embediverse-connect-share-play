
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { parseGitHubUrl, fetchGitHubContent, downloadGitHubFile } from "@/utils/fileOperations";
import { FileItem } from "@/types/fileExplorer";

interface GitHubImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (files: Record<string, string>, fileItems: FileItem[]) => void;
}

export const GitHubImportDialog: React.FC<GitHubImportDialogProps> = ({
  open, 
  onOpenChange,
  onImportComplete
}) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const gitHubInfo = parseGitHubUrl(repoUrl);
      
      if (!gitHubInfo) {
        throw new Error("Invalid GitHub URL. Please use a URL in the format: https://github.com/username/repo");
      }
      
      const { owner, repo, branch, path } = gitHubInfo;
      const contents = await fetchGitHubContent(owner, repo, path, branch);
      
      // Process the fetched contents
      const fileContents: Record<string, string> = {};
      const fileItems: FileItem[] = [];
      
      // Process directory structure and file contents
      await processGitHubContents(contents, "", fileContents, fileItems);
      
      onImportComplete(fileContents, fileItems);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import from GitHub");
    } finally {
      setIsLoading(false);
    }
  };
  
  const processGitHubContents = async (
    contents: any | any[], 
    basePath: string, 
    fileContents: Record<string, string>,
    fileItems: FileItem[]
  ) => {
    // Handle both single item and array
    const items = Array.isArray(contents) ? contents : [contents];
    
    // Sort to process directories first
    const sortedItems = [...items].sort((a, b) => {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return 0;
    });
    
    // Process directories first to build structure
    for (const item of sortedItems) {
      const itemPath = basePath ? `${basePath}/${item.name}` : item.name;
      
      if (item.type === 'dir') {
        // Create directory item
        const dirItem: FileItem = {
          name: item.name,
          type: 'directory',
          path: itemPath,
          isExpanded: true,
          children: []
        };
        
        // Get contents of this directory
        const dirContents = await fetchGitHubContent(
          item.url.split('/repos/')[1].split('/contents/')[0].split('/'),
          item.path
        );
        
        // Process directory contents recursively
        await processGitHubContents(dirContents, itemPath, fileContents, dirItem.children || []);
        
        fileItems.push(dirItem);
      } else if (item.type === 'file') {
        // Download and store file content
        const content = await downloadGitHubFile(item.download_url);
        fileContents[itemPath] = content;
        
        // Create file item
        fileItems.push({
          name: item.name,
          type: 'file',
          path: itemPath,
          isActive: false
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import from GitHub</DialogTitle>
          <DialogDescription>
            Enter a GitHub repository URL to import files from.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Example: https://github.com/username/repo or https://github.com/username/repo/tree/branch/folder
            </p>
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
