/**
 * google-drive-mcp
 * 
 * Google Drive MCP server and library for Node.js/TypeScript
 * Dual mode package providing typed functions and MCP stdio server
 */

// Types
export type {
  Tokens,
  DriveClientOptions,
  FileMetadata,
  ListFilesOptions,
  ListFilesResult,
  UploadFileOptions,
  UploadFileResult,
  SearchFilesOptions,
  CreateFolderOptions,
  CreateFolderResult,
  DownloadFileResult,
  GetFileOptions,
  OperationOptions,
  ListFilesOperationOptions,
  UploadFileOperationOptions,
  SearchFilesOperationOptions,
  CreateFolderOperationOptions,
  GetFileOperationOptions,
  DownloadFileOperationOptions,
  DeleteFileOperationOptions,
} from './types.js';

// Token resolution
export { resolveTokens, requireTokens, TokenNotFoundError } from './tokens.js';

// Client creation
export { createDriveClient, createAuthClient, google } from './client.js';

// Operations
export {
  listFiles,
  uploadFile,
  getFile,
  downloadFile,
  createFolder,
  searchFiles,
  deleteFile,
} from './operations/index.js';

// MCP Server (for programmatic use)
export { createMcpServer, runMcpServer } from './mcp/server.js';
export { toolDefinitions } from './mcp/tools.js';
export type { ToolName } from './mcp/tools.js';
