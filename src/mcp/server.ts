/**
 * MCP Server implementation
 */

import { z } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
  type ListToolsRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { toolDefinitions } from './tools.js';
import { handleToolCall } from './handlers.js';

/**
 * Create and configure the MCP server
 */
export function createMcpServer(): Server {
  const server = new Server(
    {
      name: 'google-drive-mcp-lib',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register list tools handler
  server.setRequestHandler(ListToolsRequestSchema, async (_request: ListToolsRequest) => {
    return {
      tools: toolDefinitions.map((tool) => {
        // Get the shape from the ZodObject
        const shape = tool.schema.shape;
        return {
          name: tool.name,
          description: tool.description,
          inputSchema: {
            type: 'object',
            properties: Object.fromEntries(
              Object.entries(shape).map(([key, value]) => [
                key,
                {
                  type: getZodType(value as z.ZodTypeAny),
                  description: (value as z.ZodTypeAny)._def.description,
                  ...((value as z.ZodTypeAny)._def.defaultValue !== undefined && { default: (value as z.ZodTypeAny)._def.defaultValue() }),
                },
              ])
            ),
            required: Object.entries(shape)
              .filter(([, value]) => !(value as z.ZodTypeAny).isOptional())
              .map(([key]) => key),
          },
        };
      }),
    };
  });

  // Register call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    return handleToolCall(request);
  });

  return server;
}

/**
 * Get JSON Schema type from Zod type
 */
function getZodType(zodType: z.ZodTypeAny): string {
  const typeName = zodType._def.typeName;
  
  switch (typeName) {
    case 'ZodString':
      return 'string';
    case 'ZodNumber':
      return 'number';
    case 'ZodBoolean':
      return 'boolean';
    case 'ZodArray':
      return 'array';
    case 'ZodObject':
      return 'object';
    case 'ZodOptional':
      return getZodType(zodType._def.innerType);
    case 'ZodDefault':
      return getZodType(zodType._def.innerType);
    default:
      return 'string';
  }
}

/**
 * Run the MCP server with stdio transport
 */
export async function runMcpServer(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error('Google Drive MCP server running on stdio');
}
