/**
 * MCP Tool definitions with Zod schemas
 */

import { z } from 'zod';

/**
 * Schema for googleDriveListFiles tool
 */
export const listFilesSchema = z.object({
  pageSize: z.number().min(1).max(100).optional().default(10).describe('Number of files to return per page'),
  pageToken: z.string().optional().describe('Token for pagination'),
  orderBy: z.string().optional().describe('Field to sort by (e.g., "name", "createdTime desc")'),
  query: z.string().optional().describe('Google Drive query string for filtering files'),
});

/**
 * Schema for googleDriveUploadFile tool
 */
export const uploadFileSchema = z.object({
  name: z.string().min(1).describe('Name of the file to upload'),
  mimeType: z.string().optional().describe('MIME type of the file'),
  parents: z.array(z.string()).optional().describe('Array of parent folder IDs'),
  content: z.string().describe('Base64 encoded file content'),
  description: z.string().optional().describe('Description of the file'),
});

/**
 * Schema for googleDriveGetFile tool
 */
export const getFileSchema = z.object({
  fileId: z.string().min(1).describe('ID of the file to retrieve'),
  fields: z.array(z.string()).optional().describe('Fields to include in the response'),
});

/**
 * Schema for googleDriveDownloadFile tool
 */
export const downloadFileSchema = z.object({
  fileId: z.string().min(1).describe('ID of the file to download'),
});

/**
 * Schema for googleDriveCreateFolder tool
 */
export const createFolderSchema = z.object({
  name: z.string().min(1).describe('Name of the folder to create'),
  parents: z.array(z.string()).optional().describe('Array of parent folder IDs'),
  description: z.string().optional().describe('Description of the folder'),
});

/**
 * Schema for googleDriveSearchFiles tool
 */
export const searchFilesSchema = z.object({
  query: z.string().min(1).describe('Google Drive query string (e.g., "name contains \'test\'")'),
  pageSize: z.number().min(1).max(100).optional().default(10).describe('Number of files to return per page'),
  pageToken: z.string().optional().describe('Token for pagination'),
  orderBy: z.string().optional().describe('Field to sort by'),
});

/**
 * Schema for googleDriveDeleteFile tool
 */
export const deleteFileSchema = z.object({
  fileId: z.string().min(1).describe('ID of the file to delete'),
});

/**
 * Tool definitions for MCP server
 */
export const toolDefinitions = [
  {
    name: 'googleDriveListFiles',
    description: 'List files in Google Drive with optional filtering and pagination',
    schema: listFilesSchema,
  },
  {
    name: 'googleDriveUploadFile',
    description: 'Upload a file to Google Drive',
    schema: uploadFileSchema,
  },
  {
    name: 'googleDriveGetFile',
    description: 'Get metadata for a specific file in Google Drive',
    schema: getFileSchema,
  },
  {
    name: 'googleDriveDownloadFile',
    description: 'Download a file from Google Drive',
    schema: downloadFileSchema,
  },
  {
    name: 'googleDriveCreateFolder',
    description: 'Create a new folder in Google Drive',
    schema: createFolderSchema,
  },
  {
    name: 'googleDriveSearchFiles',
    description: 'Search for files in Google Drive using a query string',
    schema: searchFilesSchema,
  },
  {
    name: 'googleDriveDeleteFile',
    description: 'Delete a file from Google Drive',
    schema: deleteFileSchema,
  },
] as const;

/**
 * Tool names type
 */
export type ToolName = typeof toolDefinitions[number]['name'];
