/**
 * Create folder operation
 */

import { createDriveClient } from '../client.js';
import type { CreateFolderOperationOptions, CreateFolderResult, Tokens } from '../types.js';

/**
 * Create a folder in Google Drive
 * 
 * @param options - Options including folder name and parent folder
 * @param tokensOrOptions - Tokens or combined options object
 * @returns Created folder metadata
 */
export async function createFolder(
  options: CreateFolderOperationOptions,
): Promise<CreateFolderResult>;
export async function createFolder(
  options: Omit<CreateFolderOperationOptions, 'tokens'>,
  tokens?: Tokens,
): Promise<CreateFolderResult>;
export async function createFolder(
  options: CreateFolderOperationOptions,
  tokens?: Tokens,
): Promise<CreateFolderResult> {
  // Handle both calling conventions
  const resolvedTokens = tokens ?? options.tokens;
  const drive = createDriveClient({ tokens: resolvedTokens });

  const { name, parents, description } = options;

  const response = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents,
      description,
    },
    fields: 'id,name,mimeType,parents,webViewLink',
  });

  const data = response.data;
  if (!data.id || !data.name || !data.mimeType) {
    throw new Error('Create folder failed: incomplete response from Google Drive API');
  }

  return {
    id: data.id,
    name: data.name,
    mimeType: data.mimeType,
    parents: Array.isArray(data.parents) ? data.parents as string[] : undefined,
    webViewLink: typeof data.webViewLink === 'string' ? data.webViewLink : undefined,
  };
}
