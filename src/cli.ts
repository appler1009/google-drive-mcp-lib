#!/usr/bin/env node
/**
 * CLI entry point for MCP stdio server
 */

import { runMcpServer } from './mcp/server.js';

async function main(): Promise<void> {
  try {
    await runMcpServer();
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

main();
