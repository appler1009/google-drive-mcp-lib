/**
 * Download file operation
 */

import { createDriveClient } from '../client.js';
import type { DownloadFileOperationOptions, DownloadFileResult, Tokens } from '../types.js';

/**
 * Download a file from Google Drive
 * 
 * @param options - Options including file ID
 * @param tokensOrOptions - Tokens or combined options object
 * @returns File content and metadata
 */
export async function downloadFile(
  options: DownloadFileOperationOptions,
): Promise<DownloadFileResult>;
export async function downloadFile(
  options: Omit<DownloadFileOperationOptions, 'tokens'>,
  tokens?: Tokens,
): Promise<DownloadFileResult>;
export async function downloadFile(
  options: DownloadFileOperationOptions,
  tokens?: Tokens,
): Promise<DownloadFileResult> {
  // Handle both calling conventions
  const resolvedTokens = tokens ?? options.tokens;
  const drive = createDriveClient({ tokens: resolvedTokens });

  const { fileId } = options;

  // Get file metadata first
  const metadataResponse = await drive.files.get({
    fileId,
    fields: 'id,name,mimeType,size',
  });

  const metadata = metadataResponse.data;
  if (!metadata.id || !metadata.name || !metadata.mimeType) {
    throw new Error('Download failed: incomplete metadata from Google Drive API');
  }

  // Download file content
  const contentResponse = await drive.files.get(
    {
      fileId,
      alt: 'media',
    },
    {
      responseType: 'arraybuffer',
    },
  );

  const content = Buffer.from(contentResponse.data as ArrayBuffer);
  const size = metadata.size != null ? parseInt(String(metadata.size), 10) : content.length;

  return {
    id: metadata.id,
    name: metadata.name,
    mimeType: metadata.mimeType,
    content,
    size,
  };
}
