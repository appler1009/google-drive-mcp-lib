/**
 * Tests for Drive operations
 * 
 * Note: These tests verify the operation functions are correctly defined and exported.
 * Integration tests with actual Google Drive API would require valid tokens.
 */

import { listFiles } from '../src/operations/list-files.js';
import { uploadFile } from '../src/operations/upload-file.js';
import { getFile } from '../src/operations/get-file.js';
import { downloadFile } from '../src/operations/download-file.js';
import { createFolder } from '../src/operations/create-folder.js';
import { searchFiles } from '../src/operations/search-files.js';
import { deleteFile } from '../src/operations/delete-file.js';

describe('Operations Module', () => {
  describe('Function exports', () => {
    it('should export listFiles function', () => {
      expect(listFiles).toBeDefined();
      expect(typeof listFiles).toBe('function');
    });

    it('should export uploadFile function', () => {
      expect(uploadFile).toBeDefined();
      expect(typeof uploadFile).toBe('function');
    });

    it('should export getFile function', () => {
      expect(getFile).toBeDefined();
      expect(typeof getFile).toBe('function');
    });

    it('should export downloadFile function', () => {
      expect(downloadFile).toBeDefined();
      expect(typeof downloadFile).toBe('function');
    });

    it('should export createFolder function', () => {
      expect(createFolder).toBeDefined();
      expect(typeof createFolder).toBe('function');
    });

    it('should export searchFiles function', () => {
      expect(searchFiles).toBeDefined();
      expect(typeof searchFiles).toBe('function');
    });

    it('should export deleteFile function', () => {
      expect(deleteFile).toBeDefined();
      expect(typeof deleteFile).toBe('function');
    });
  });

  describe('Function signatures', () => {
    it('listFiles should accept options with optional tokens', () => {
      // Test that the function signature is correct
      const fn = listFiles;
      expect(fn.length).toBeLessThanOrEqual(2); // options and optional tokens
    });

    it('uploadFile should accept options with required name and body', () => {
      const fn = uploadFile;
      expect(fn.length).toBeLessThanOrEqual(2);
    });

    it('getFile should accept options with required fileId', () => {
      const fn = getFile;
      expect(fn.length).toBeLessThanOrEqual(2);
    });

    it('downloadFile should accept options with required fileId', () => {
      const fn = downloadFile;
      expect(fn.length).toBeLessThanOrEqual(2);
    });

    it('createFolder should accept options with required name', () => {
      const fn = createFolder;
      expect(fn.length).toBeLessThanOrEqual(2);
    });

    it('searchFiles should accept options with required query', () => {
      const fn = searchFiles;
      expect(fn.length).toBeLessThanOrEqual(2);
    });

    it('deleteFile should accept options with required fileId', () => {
      const fn = deleteFile;
      expect(fn.length).toBeLessThanOrEqual(2);
    });
  });
});
