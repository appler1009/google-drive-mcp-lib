/**
 * Delete file operation
 */

import { createDriveClient } from '../client.js';
import type { DeleteFileOperationOptions, Tokens } from '../types.js';

/**
 * Delete a file from Google Drive
 * 
 * @param options - Options including file ID
 * @param tokensOrOptions - Tokens or combined options object
 * @returns true if deletion was successful
 */
export async function deleteFile(
  options: DeleteFileOperationOptions,
): Promise<boolean>;
export async function deleteFile(
  options: Omit<DeleteFileOperationOptions, 'tokens'>,
  tokens?: Tokens,
): Promise<boolean>;
export async function deleteFile(
  options: DeleteFileOperationOptions,
  tokens?: Tokens,
): Promise<boolean> {
  // Handle both calling conventions
  const resolvedTokens = tokens ?? options.tokens;
  const drive = createDriveClient({ tokens: resolvedTokens });

  const { fileId } = options;

  await drive.files.delete({ fileId });

  return true;
}
