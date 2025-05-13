
/**
 * File operation utilities for the code editor
 */

/**
 * Download a file to the user's computer
 * @param filename The name of the file to download
 * @param content The content of the file
 */
export const downloadFile = (filename: string, content: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Read a file uploaded by the user
 * @returns Promise that resolves with the file content
 */
export const readUploadedFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsText(file);
  });
};

/**
 * Create a file input element and trigger it to open file dialog
 * @param accept File types to accept
 * @param callback Function to call with the selected file(s)
 */
export const openFileDialog = (accept: string, callback: (files: FileList) => void) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.style.display = 'none';
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      callback(target.files);
    }
    document.body.removeChild(input);
  };
  document.body.appendChild(input);
  input.click();
};

/**
 * Creates a file input element for directory selection
 * @param callback Function to call with the selected files
 */
export const openDirectoryDialog = (callback: (files: FileList) => void) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true;
  input.style.display = 'none';
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      callback(target.files);
    }
    document.body.removeChild(input);
  };
  document.body.appendChild(input);
  input.click();
};

/**
 * Parse GitHub repository URL to get owner, repo, and optional path
 * @param url GitHub repository URL
 */
export const parseGitHubUrl = (url: string) => {
  // Format: https://github.com/{owner}/{repo}[/tree/{branch}/{path}]
  const gitHubRegex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+)(?:\/(.*))?)?/;
  const match = url.match(gitHubRegex);
  
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2],
    branch: match[3] || 'main',
    path: match[4] || ''
  };
};

/**
 * Fetch content from GitHub repository
 * @param owner Repository owner
 * @param repo Repository name
 * @param path File path within repository
 * @param branch Branch name
 */
export const fetchGitHubContent = async (
  owner: string, 
  repo: string, 
  path: string = '', 
  branch: string = 'main'
): Promise<any> => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Download file content from GitHub
 * @param url Raw content URL
 */
export const downloadGitHubFile = async (url: string): Promise<string> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status}`);
  }
  
  return response.text();
};
