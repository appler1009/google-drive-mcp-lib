/**
 * Tests for token resolution
 */

import { jest } from '@jest/globals';
import { resolveTokens, requireTokens, TokenNotFoundError } from '../src/tokens.js';
import type { Tokens } from '../src/types.js';

describe('resolveTokens', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.GOOGLE_DRIVE_TOKEN;
    delete process.env.GOOGLE_DRIVE_TOKEN_FILE;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const validTokens: Tokens = {
    access_token: 'ya29.test-token',
    refresh_token: '1//test-refresh',
    token_type: 'Bearer',
    expiry_date: Date.now() + 3600000,
  };

  describe('direct parameter (highest priority)', () => {
    it('should return tokens from direct parameter', () => {
      const result = resolveTokens(validTokens);
      expect(result).toEqual(validTokens);
    });

    it('should return tokens from direct parameter even when env var is set', () => {
      process.env.GOOGLE_DRIVE_TOKEN = JSON.stringify({ access_token: 'env-token' });
      const result = resolveTokens(validTokens);
      expect(result).toEqual(validTokens);
    });

    it('should return null if access_token is missing', () => {
      const result = resolveTokens({ access_token: '', refresh_token: 'test' });
      expect(result).toBeNull();
    });
  });

  describe('environment variable (medium priority)', () => {
    it('should return tokens from GOOGLE_DRIVE_TOKEN env var', () => {
      process.env.GOOGLE_DRIVE_TOKEN = JSON.stringify(validTokens);
      const result = resolveTokens();
      expect(result).toEqual(validTokens);
    });

    it('should return null if env var has invalid JSON', () => {
      process.env.GOOGLE_DRIVE_TOKEN = 'not-valid-json';
      const result = resolveTokens();
      expect(result).toBeNull();
    });

    it('should return null if env var JSON lacks access_token', () => {
      process.env.GOOGLE_DRIVE_TOKEN = JSON.stringify({ refresh_token: 'test' });
      const result = resolveTokens();
      expect(result).toBeNull();
    });
  });

  describe('file (lowest priority)', () => {
    it('should return null when no token file exists', () => {
      // No token file exists by default in test environment
      const result = resolveTokens();
      expect(result).toBeNull();
    });
  });
});

describe('requireTokens', () => {
  it('should return tokens when available', () => {
    const tokens: Tokens = { access_token: 'test-token' };
    const result = requireTokens(tokens);
    expect(result).toEqual(tokens);
  });

  it('should throw TokenNotFoundError when no tokens available', () => {
    expect(() => requireTokens()).toThrow(TokenNotFoundError);
  });

  it('should throw with default message', () => {
    try {
      requireTokens();
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(TokenNotFoundError);
      expect((error as Error).message).toBe('No valid tokens found. Provide tokens via parameter, env var, or file.');
    }
  });
});
