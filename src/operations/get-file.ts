/**
 * Get file operation
 */

import { createDriveClient } from '../client.js';
import type { GetFileOperationOptions, FileMetadata, Tokens } from '../types.js';

/**
 * Default fields to retrieve for a file
 */
const DEFAULT_FIELDS = [
  'id',
  'name',
  'mimeType',
  'size',
  'createdTime',
  'modifiedTime',
  'parents',
  'webViewLink',
  'thumbnailLink',
  'description',
  'owners',
];

/**
 * Get file metadata from Google Drive
 * 
 * @param options - Options including file ID and fields to retrieve
 * @param tokensOrOptions - Tokens or combined options object
 * @returns File metadata
 */
export async function getFile(
  options: GetFileOperationOptions,
): Promise<FileMetadata>;
export async function getFile(
  options: Omit<GetFileOperationOptions, 'tokens'>,
  tokens?: Tokens,
): Promise<FileMetadata>;
export async function getFile(
  options: GetFileOperationOptions,
  tokens?: Tokens,
): Promise<FileMetadata> {
  // Handle both calling conventions
  const resolvedTokens = tokens ?? options.tokens;
  const drive = createDriveClient({ tokens: resolvedTokens });

  const { fileId, fields = DEFAULT_FIELDS } = options;

  const response = await drive.files.get({
    fileId,
    fields: fields.join(','),
  });

  const file = response.data;

  return {
    id: file.id ?? undefined,
    name: file.name ?? undefined,
    mimeType: file.mimeType ?? undefined,
    parents: Array.isArray(file.parents) ? file.parents as string[] : undefined,
    size: file.size != null ? parseInt(String(file.size), 10) : undefined,
    createdTime: typeof file.createdTime === 'string' ? file.createdTime : undefined,
    modifiedTime: typeof file.modifiedTime === 'string' ? file.modifiedTime : undefined,
    webViewLink: typeof file.webViewLink === 'string' ? file.webViewLink : undefined,
    thumbnailLink: typeof file.thumbnailLink === 'string' ? file.thumbnailLink : undefined,
    description: typeof file.description === 'string' ? file.description : undefined,
    owners: Array.isArray(file.owners) 
      ? file.owners.map((owner) => ({
          displayName: typeof owner.displayName === 'string' ? owner.displayName : undefined,
          emailAddress: typeof owner.emailAddress === 'string' ? owner.emailAddress : undefined,
        }))
      : undefined,
  };
}
