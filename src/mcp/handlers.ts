/**
 * MCP Tool handlers
 */

import { z } from 'zod';
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { listFiles, uploadFile, getFile, downloadFile, createFolder, searchFiles, deleteFile } from '../operations/index.js';
import type { ToolName } from './tools.js';
import {
  listFilesSchema,
  uploadFileSchema,
  getFileSchema,
  downloadFileSchema,
  createFolderSchema,
  searchFilesSchema,
  deleteFileSchema,
} from './tools.js';

/**
 * Validation error result type
 */
function validationError(message: string): { content: Array<{ type: string; text: string }> } {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: `Validation error: ${message}` }, null, 2),
      },
    ],
  };
}

/**
 * Handle MCP tool calls
 */
export async function handleToolCall(request: CallToolRequest): Promise<{ content: Array<{ type: string; text: string }> }> {
  const toolName = request.params.name as ToolName;
  const args = request.params.arguments ?? {};

  try {
    let result: unknown;

    switch (toolName) {
      case 'googleDriveListFiles': {
        const parsed = listFilesSchema.safeParse(args);
        if (!parsed.success) {
          return validationError(parsed.error.message);
        }
        result = await listFiles({
          pageSize: parsed.data.pageSize,
          pageToken: parsed.data.pageToken,
          orderBy: parsed.data.orderBy,
          query: parsed.data.query,
        });
        break;
      }

      case 'googleDriveUploadFile': {
        const parsed = uploadFileSchema.safeParse(args);
        if (!parsed.success) {
          return validationError(parsed.error.message);
        }
        // Decode base64 content to Buffer
        const body = Buffer.from(parsed.data.content, 'base64');
        
        result = await uploadFile({
          name: parsed.data.name,
          mimeType: parsed.data.mimeType,
          parents: parsed.data.parents,
          body,
          description: parsed.data.description,
        });
        break;
      }

      case 'googleDriveGetFile': {
        const parsed = getFileSchema.safeParse(args);
        if (!parsed.success) {
          return validationError(parsed.error.message);
        }
        result = await getFile({
          fileId: parsed.data.fileId,
          fields: parsed.data.fields,
        });
        break;
      }

      case 'googleDriveDownloadFile': {
        const parsed = downloadFileSchema.safeParse(args);
        if (!parsed.success) {
          return validationError(parsed.error.message);
        }
        const downloadResult = await downloadFile({
          fileId: parsed.data.fileId,
        });
        // Encode content as base64 for MCP response
        result = {
          id: downloadResult.id,
          name: downloadResult.name,
          mimeType: downloadResult.mimeType,
          size: downloadResult.size,
          content: downloadResult.content.toString('base64'),
        };
        break;
      }

      case 'googleDriveCreateFolder': {
        const parsed = createFolderSchema.safeParse(args);
        if (!parsed.success) {
          return validationError(parsed.error.message);
        }
        result = await createFolder({
          name: parsed.data.name,
          parents: parsed.data.parents,
          description: parsed.data.description,
        });
        break;
      }

      case 'googleDriveSearchFiles': {
        const parsed = searchFilesSchema.safeParse(args);
        if (!parsed.success) {
          return validationError(parsed.error.message);
        }
        result = await searchFiles({
          query: parsed.data.query,
          pageSize: parsed.data.pageSize,
          pageToken: parsed.data.pageToken,
          orderBy: parsed.data.orderBy,
        });
        break;
      }

      case 'googleDriveDeleteFile': {
        const parsed = deleteFileSchema.safeParse(args);
        if (!parsed.success) {
          return validationError(parsed.error.message);
        }
        result = await deleteFile({
          fileId: parsed.data.fileId,
        });
        break;
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error in tool ${toolName}:`, errorMessage);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
    };
  }
}
