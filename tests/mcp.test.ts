/**
 * Tests for MCP server
 */

import { toolDefinitions } from '../src/mcp/tools.js';
import { createMcpServer } from '../src/mcp/server.js';
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';

describe('MCP Tools', () => {
  describe('Tool Definitions', () => {
    it('should have all required tools', () => {
      const toolNames = toolDefinitions.map((t) => t.name);
      expect(toolNames).toContain('googleDriveListFiles');
      expect(toolNames).toContain('googleDriveUploadFile');
      expect(toolNames).toContain('googleDriveGetFile');
      expect(toolNames).toContain('googleDriveDownloadFile');
      expect(toolNames).toContain('googleDriveCreateFolder');
      expect(toolNames).toContain('googleDriveSearchFiles');
      expect(toolNames).toContain('googleDriveDeleteFile');
    });

    it('should have descriptions for all tools', () => {
      for (const tool of toolDefinitions) {
        expect(tool.description).toBeTruthy();
        expect(typeof tool.description).toBe('string');
      }
    });

    it('should have schemas for all tools', () => {
      for (const tool of toolDefinitions) {
        expect(tool.schema).toBeDefined();
        expect(typeof tool.schema).toBe('object');
      }
    });

    it('should have correct tool count', () => {
      expect(toolDefinitions).toHaveLength(7);
    });
  });

  describe('Tool Schemas', () => {
    it('googleDriveListFiles should have correct schema', () => {
      const tool = toolDefinitions.find((t) => t.name === 'googleDriveListFiles');
      expect(tool).toBeDefined();
      expect(tool!.schema.shape).toHaveProperty('pageSize');
      expect(tool!.schema.shape).toHaveProperty('pageToken');
      expect(tool!.schema.shape).toHaveProperty('orderBy');
      expect(tool!.schema.shape).toHaveProperty('query');
    });

    it('googleDriveUploadFile should have correct schema', () => {
      const tool = toolDefinitions.find((t) => t.name === 'googleDriveUploadFile');
      expect(tool).toBeDefined();
      expect(tool!.schema.shape).toHaveProperty('name');
      expect(tool!.schema.shape).toHaveProperty('mimeType');
      expect(tool!.schema.shape).toHaveProperty('parents');
      expect(tool!.schema.shape).toHaveProperty('content');
      expect(tool!.schema.shape).toHaveProperty('description');
    });

    it('googleDriveGetFile should have correct schema', () => {
      const tool = toolDefinitions.find((t) => t.name === 'googleDriveGetFile');
      expect(tool).toBeDefined();
      expect(tool!.schema.shape).toHaveProperty('fileId');
      expect(tool!.schema.shape).toHaveProperty('fields');
    });

    it('googleDriveDownloadFile should have correct schema', () => {
      const tool = toolDefinitions.find((t) => t.name === 'googleDriveDownloadFile');
      expect(tool).toBeDefined();
      expect(tool!.schema.shape).toHaveProperty('fileId');
    });

    it('googleDriveCreateFolder should have correct schema', () => {
      const tool = toolDefinitions.find((t) => t.name === 'googleDriveCreateFolder');
      expect(tool).toBeDefined();
      expect(tool!.schema.shape).toHaveProperty('name');
      expect(tool!.schema.shape).toHaveProperty('parents');
      expect(tool!.schema.shape).toHaveProperty('description');
    });

    it('googleDriveSearchFiles should have correct schema', () => {
      const tool = toolDefinitions.find((t) => t.name === 'googleDriveSearchFiles');
      expect(tool).toBeDefined();
      expect(tool!.schema.shape).toHaveProperty('query');
      expect(tool!.schema.shape).toHaveProperty('pageSize');
      expect(tool!.schema.shape).toHaveProperty('pageToken');
      expect(tool!.schema.shape).toHaveProperty('orderBy');
    });

    it('googleDriveDeleteFile should have correct schema', () => {
      const tool = toolDefinitions.find((t) => t.name === 'googleDriveDeleteFile');
      expect(tool).toBeDefined();
      expect(tool!.schema.shape).toHaveProperty('fileId');
    });
  });

  describe('MCP Server', () => {
    it('should create MCP server instance', () => {
      const server = createMcpServer();
      expect(server).toBeDefined();
    });
  });
});
