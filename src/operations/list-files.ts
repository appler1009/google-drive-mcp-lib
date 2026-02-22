/**
 * List files operation
 */

import { createDriveClient } from '../client.js';
import type { ListFilesOperationOptions, ListFilesResult, Tokens } from '../types.js';

/**
 * Default fields to retrieve for files
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
];

/**
 * List files in Google Drive
 * 
 * @param options - List options including pagination and sorting
 * @param tokensOrOptions - Tokens or combined options object
 * @returns List of files and optional next page token
 */
export async function listFiles(
  options?: ListFilesOperationOptions,
): Promise<ListFilesResult>;
export async function listFiles(
  options?: Omit<ListFilesOperationOptions, 'tokens'>,
  tokens?: Tokens,
): Promise<ListFilesResult>;
export async function listFiles(
  options: ListFilesOperationOptions = {},
  tokens?: Tokens,
): Promise<ListFilesResult> {
  // Handle both calling conventions
  const resolvedTokens = tokens ?? options.tokens;
  const drive = createDriveClient({ tokens: resolvedTokens });

  const pageSize = options.pageSize ?? 10;
  const fields = options.fields ?? DEFAULT_FIELDS;

  const response = await drive.files.list({
    pageSize,
    pageToken: options.pageToken,
    orderBy: options.orderBy,
    q: options.query,
    fields: `nextPageToken, files(${fields.join(',')})`,
  });

  const files = (response.data.files ?? [])
    .filter((file): file is { id: string; name: string; mimeType: string } & Record<string, unknown> => 
      file.id != null && file.name != null && file.mimeType != null)
    .map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size != null ? parseInt(String(file.size), 10) : undefined,
      createdTime: typeof file.createdTime === 'string' ? file.createdTime : undefined,
      modifiedTime: typeof file.modifiedTime === 'string' ? file.modifiedTime : undefined,
      parents: Array.isArray(file.parents) ? file.parents as string[] : undefined,
      webViewLink: typeof file.webViewLink === 'string' ? file.webViewLink : undefined,
    }));

  return {
    files,
    nextPageToken: response.data.nextPageToken ?? undefined,
  };
}
