/**
 * Core types and interfaces for google-drive-mcp
 */

import type { Readable } from 'node:stream';

/**
 * Token structure for Google Drive OAuth2
 */
export interface Tokens {
  access_token: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

/**
 * Options for creating Drive client
 */
export interface DriveClientOptions {
  tokens?: Tokens;
  clientId?: string;
  clientSecret?: string;
}

/**
 * File metadata interface
 */
export interface FileMetadata {
  id?: string;
  name?: string;
  mimeType?: string;
  parents?: string[];
  size?: number;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  description?: string;
  owners?: Array<{
    displayName?: string;
    emailAddress?: string;
  }>;
  [key: string]: unknown;
}

/**
 * Options for listing files
 */
export interface ListFilesOptions {
  pageSize?: number;
  pageToken?: string;
  orderBy?: string;
  fields?: string[];
  query?: string;
}

/**
 * Result of listing files
 */
export interface ListFilesResult {
  files: Array<{
    id: string;
    name: string;
    mimeType: string;
    size?: number;
    createdTime?: string;
    modifiedTime?: string;
    parents?: string[];
    webViewLink?: string;
  }>;
  nextPageToken?: string;
}

/**
 * Options for uploading a file
 */
export interface UploadFileOptions {
  name: string;
  mimeType?: string;
  parents?: string[];
  body: Readable | Buffer | string;
  description?: string;
}

/**
 * Result of uploading a file
 */
export interface UploadFileResult {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  webViewLink?: string;
  createdTime?: string;
}

/**
 * Options for searching files
 */
export interface SearchFilesOptions {
  query: string;
  pageSize?: number;
  pageToken?: string;
  orderBy?: string;
  fields?: string[];
}

/**
 * Options for creating a folder
 */
export interface CreateFolderOptions {
  name: string;
  parents?: string[];
  description?: string;
}

/**
 * Result of creating a folder
 */
export interface CreateFolderResult {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  webViewLink?: string;
}

/**
 * Result of downloading a file
 */
export interface DownloadFileResult {
  id: string;
  name: string;
  mimeType: string;
  content: Buffer;
  size: number;
}

/**
 * Options for getting a file
 */
export interface GetFileOptions {
  fileId: string;
  fields?: string[];
}

/**
 * Base options for operations that accept tokens
 */
export interface OperationOptions {
  tokens?: Tokens;
}

/**
 * Combined options for list files operation
 */
export interface ListFilesOperationOptions extends ListFilesOptions, OperationOptions {}

/**
 * Combined options for upload file operation
 */
export interface UploadFileOperationOptions extends UploadFileOptions, OperationOptions {}

/**
 * Combined options for search files operation
 */
export interface SearchFilesOperationOptions extends SearchFilesOptions, OperationOptions {}

/**
 * Combined options for create folder operation
 */
export interface CreateFolderOperationOptions extends CreateFolderOptions, OperationOptions {}

/**
 * Combined options for get file operation
 */
export interface GetFileOperationOptions extends GetFileOptions, OperationOptions {}

/**
 * Combined options for download file operation
 */
export interface DownloadFileOperationOptions extends OperationOptions {
  fileId: string;
}

/**
 * Combined options for delete file operation
 */
export interface DeleteFileOperationOptions extends OperationOptions {
  fileId: string;
}
