/**
 * Google Drive client creation
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import type { Tokens, DriveClientOptions } from './types.js';
import { requireTokens } from './tokens.js';

/**
 * Create a Google Drive client with resolved tokens
 * 
 * @param options - Client options including tokens and OAuth client credentials
 * @returns Google Drive API client
 * @throws TokenNotFoundError if no valid tokens found
 */
export function createDriveClient(options: DriveClientOptions = {}) {
  const tokens = requireTokens(options.tokens);

  const auth = new OAuth2Client({
    clientId: options.clientId || process.env.GOOGLE_CLIENT_ID,
    clientSecret: options.clientSecret || process.env.GOOGLE_CLIENT_SECRET,
  });

  auth.setCredentials(tokens);

  return google.drive({ version: 'v3', auth });
}

/**
 * Create an OAuth2 client with resolved tokens
 * Useful for custom API calls or advanced use cases
 * 
 * @param options - Client options including tokens and OAuth client credentials
 * @returns OAuth2 client configured with tokens
 * @throws TokenNotFoundError if no valid tokens found
 */
export function createAuthClient(options: DriveClientOptions = {}): OAuth2Client {
  const tokens = requireTokens(options.tokens);

  const auth = new OAuth2Client({
    clientId: options.clientId || process.env.GOOGLE_CLIENT_ID,
    clientSecret: options.clientSecret || process.env.GOOGLE_CLIENT_SECRET,
  });

  auth.setCredentials(tokens);
  return auth;
}

/**
 * Get the raw googleapis instance for advanced usage
 */
export { google };
