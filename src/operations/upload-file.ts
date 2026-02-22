/**
 * Upload file operation
 */

import { createDriveClient } from '../client.js';
import type { UploadFileOperationOptions, UploadFileResult, Tokens } from '../types.js';

/**
 * Upload a file to Google Drive
 * 
 * @param options - Upload options including file name, content, and parent folder
 * @param tokensOrOptions - Tokens or combined options object
 * @returns Uploaded file metadata
 */
export async function uploadFile(
  options: UploadFileOperationOptions,
): Promise<UploadFileResult>;
export async function uploadFile(
  options: Omit<UploadFileOperationOptions, 'tokens'>,
  tokens?: Tokens,
): Promise<UploadFileResult>;
export async function uploadFile(
  options: UploadFileOperationOptions,
  tokens?: Tokens,
): Promise<UploadFileResult> {
  // Handle both calling conventions
  const resolvedTokens = tokens ?? options.tokens;
  const drive = createDriveClient({ tokens: resolvedTokens });

  const { name, mimeType, parents, body, description } = options;

  const response = await drive.files.create({
    requestBody: {
      name,
      mimeType,
      parents,
      description,
    },
    media: {
      mimeType: mimeType || 'application/octet-stream',
      body,
    },
    fields: 'id,name,mimeType,size,webViewLink,createdTime',
  });

  const data = response.data;
  if (!data.id || !data.name || !data.mimeType) {
    throw new Error('Upload failed: incomplete response from Google Drive API');
  }

  return {
    id: data.id,
    name: data.name,
    mimeType: data.mimeType,
    size: data.size != null ? parseInt(String(data.size), 10) : undefined,
    webViewLink: typeof data.webViewLink === 'string' ? data.webViewLink : undefined,
    createdTime: typeof data.createdTime === 'string' ? data.createdTime : undefined,
  };
}
