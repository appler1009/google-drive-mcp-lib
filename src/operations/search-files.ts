/**
 * Search files operation
 */

import { createDriveClient } from '../client.js';
import type { SearchFilesOperationOptions, ListFilesResult, Tokens } from '../types.js';

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
 * Converts a simple search query into Google Drive API query syntax
 *
 * @param query - Simple search string (e.g., "quantum computing")
 * @returns Formatted Google Drive query (e.g., "fullText contains 'quantum' and fullText contains 'computing'")
 */
function formatSearchQuery(query: string): string {
  // If query already contains Google Drive query syntax, return as-is
  if (query.includes(' contains ') || query.includes('=') || query.includes('>') || query.includes('<')) {
    return query;
  }

  // Split by spaces and create fullText contains for each term
  const terms = query.trim().split(/\s+/).filter(term => term.length > 0);

  if (terms.length === 0) {
    return query;
  }

  // Escape single quotes and build the query
  const formattedTerms = terms.map(term => {
    const escaped = term.replace(/'/g, "\\'");
    return `fullText contains '${escaped}'`;
  });

  return formattedTerms.join(' and ');
}

/**
 * Search for files in Google Drive
 * 
 * @param options - Search options including query string
 * @param tokensOrOptions - Tokens or combined options object
 * @returns List of matching files and optional next page token
 */
export async function searchFiles(
  options: SearchFilesOperationOptions,
): Promise<ListFilesResult>;
export async function searchFiles(
  options: Omit<SearchFilesOperationOptions, 'tokens'>,
  tokens?: Tokens,
): Promise<ListFilesResult>;
export async function searchFiles(
  options: SearchFilesOperationOptions,
  tokens?: Tokens,
): Promise<ListFilesResult> {
  // Handle both calling conventions
  const resolvedTokens = tokens ?? options.tokens;
  const drive = createDriveClient({ tokens: resolvedTokens });

  const { query, pageSize = 10, pageToken, orderBy, fields = DEFAULT_FIELDS } = options;

  // Format the query into proper Google Drive API syntax
  const formattedQuery = formatSearchQuery(query);

  const response = await drive.files.list({
    q: formattedQuery,
    pageSize,
    pageToken,
    orderBy,
    fields: `nextPageToken,files(${fields.join(',')})`,
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
