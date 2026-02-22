/**
 * Token resolution logic for google-drive-mcp
 * 
 * Priority order (lowest to highest):
 * 1. JSON file at GOOGLE_DRIVE_TOKEN_FILE or ./token.json
 * 2. Environment variable GOOGLE_DRIVE_TOKEN (JSON string)
 * 3. Direct tokens parameter passed to functions
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Tokens } from './types.js';

/**
 * Error thrown when no valid tokens are found
 */
export class TokenNotFoundError extends Error {
  constructor(message: string = 'No valid tokens found. Provide tokens via parameter, env var, or file.') {
    super(message);
    this.name = 'TokenNotFoundError';
  }
}

/**
 * Resolve tokens from multiple sources with priority
 * 
 * @param provided - Tokens passed directly to the function (highest priority)
 * @returns Resolved tokens or null if none found
 */
export function resolveTokens(provided?: Tokens): Tokens | null {
  // 1. Check direct param (highest priority)
  if (provided?.access_token) {
    return provided;
  }

  // 2. Check env var GOOGLE_DRIVE_TOKEN
  const envToken = process.env.GOOGLE_DRIVE_TOKEN;
  if (envToken) {
    try {
      const parsed = JSON.parse(envToken);
      if (parsed.access_token) {
        return parsed as Tokens;
      }
      console.error('GOOGLE_DRIVE_TOKEN env var does not contain valid access_token');
    } catch (error) {
      console.error('Failed to parse GOOGLE_DRIVE_TOKEN env var:', error);
    }
  }

  // 3. Check token file
  const tokenFilePath = process.env.GOOGLE_DRIVE_TOKEN_FILE || './token.json';
  const absolutePath = resolve(tokenFilePath);
  
  if (existsSync(absolutePath)) {
    try {
      const fileContent = readFileSync(absolutePath, 'utf-8');
      const parsed = JSON.parse(fileContent);
      if (parsed.access_token) {
        return parsed as Tokens;
      }
      console.error(`Token file at ${absolutePath} does not contain valid access_token`);
    } catch (error) {
      console.error(`Failed to read/parse token file at ${absolutePath}:`, error);
    }
  }

  return null;
}

/**
 * Resolve tokens or throw error if none found
 * 
 * @param provided - Tokens passed directly to the function
 * @returns Resolved tokens
 * @throws TokenNotFoundError if no valid tokens found
 */
export function requireTokens(provided?: Tokens): Tokens {
  const tokens = resolveTokens(provided);
  if (!tokens) {
    throw new TokenNotFoundError();
  }
  return tokens;
}
