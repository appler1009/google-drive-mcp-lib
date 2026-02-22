# google-drive-mcp

A TypeScript npm package providing Google Drive access via the official SDK. This package offers dual mode functionality: a standalone MCP stdio server and a library for easy integration into Node.js/TypeScript projects with typed exported functions.

## Summary

`google-drive-mcp` enables seamless integration with Google Drive through two modes:

1. **Library Mode**: Import typed functions directly into your Node.js/TypeScript project
2. **MCP Server Mode**: Run as a Model Context Protocol (MCP) stdio server for AI assistants

The package handles token resolution with a clear priority system and does not auto-refresh or persist tokens - external systems are responsible for token lifecycle management.

## Features

- **Dual Mode**: Use as a library or MCP stdio server
- **TypeScript First**: Full type definitions for all operations
- **7 Drive Operations**:
  - `listFiles` - List files with pagination and filtering
  - `uploadFile` - Upload files to Drive
  - `getFile` - Get file metadata
  - `downloadFile` - Download file content
  - `createFolder` - Create new folders
  - `searchFiles` - Search files with query strings
  - `deleteFile` - Delete files from Drive
- **MCP Tools**: All operations available as MCP tools prefixed with `googleDrive`
- **Flexible Token Resolution**: Multiple ways to provide authentication

## Installation

```bash
npm install google-drive-mcp
```

## Token Handling

Tokens are resolved with the following priority (lowest to highest):

1. **JSON File** (`GOOGLE_DRIVE_TOKEN_FILE` or `./token.json`)
   ```bash
   export GOOGLE_DRIVE_TOKEN_FILE=/path/to/token.json
   ```

2. **Environment Variable** (`GOOGLE_DRIVE_TOKEN` as JSON string)
   ```bash
   export GOOGLE_DRIVE_TOKEN='{"access_token":"ya29...","refresh_token":"1//..."}'
   ```

3. **Direct Parameter** (highest priority)
   ```typescript
   const files = await listFiles({ tokens: myTokens });
   ```

> **Important**: The default token file path `./token.json` is resolved relative to the **current working directory** where the process is running, not the project root. For MCP server mode, this is typically the directory from which you run the `npx google-drive-mcp` command. For reliability, use an absolute path via `GOOGLE_DRIVE_TOKEN_FILE` environment variable.

### Token Structure

```typescript
interface Tokens {
  access_token: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}
```

> **Note**: This package does not auto-refresh tokens or persist them. External systems are responsible for token rotation and lifecycle management.

## Usage

### Library Mode

```typescript
import {
  createDriveClient,
  listFiles,
  uploadFile,
  getFile,
  downloadFile,
  createFolder,
  searchFiles,
  deleteFile,
  resolveTokens,
} from 'google-drive-mcp';

// Option 1: Create a client and use it directly
const drive = createDriveClient({ tokens: myTokens });

// Option 2: Use operations directly (tokens resolved automatically)
const files = await listFiles({ pageSize: 20 });
```

#### List Files

```typescript
const result = await listFiles({
  pageSize: 20,
  orderBy: 'createdTime desc',
  query: "mimeType != 'application/vnd.google-apps.folder'",
});

console.log(result.files);
// { files: [...], nextPageToken: '...' }
```

#### Upload File

```typescript
import { readFileSync } from 'fs';

const content = readFileSync('./document.pdf');
const result = await uploadFile({
  name: 'document.pdf',
  mimeType: 'application/pdf',
  parents: ['folder-id'],
  body: content,
});

console.log(result.id, result.webViewLink);
```

#### Get File Metadata

```typescript
const file = await getFile({
  fileId: 'file-id',
  fields: ['id', 'name', 'size', 'webViewLink'],
});

console.log(file);
```

#### Download File

```typescript
const result = await downloadFile({
  fileId: 'file-id',
});

console.log(result.name, result.size);
// result.content is a Buffer
fs.writeFileSync(result.name, result.content);
```

#### Create Folder

```typescript
const folder = await createFolder({
  name: 'New Folder',
  parents: ['parent-folder-id'],
  description: 'Optional description',
});

console.log(folder.id, folder.webViewLink);
```

#### Search Files

```typescript
const result = await searchFiles({
  query: "name contains 'report' and mimeType = 'application/pdf'",
  pageSize: 10,
});

console.log(result.files);
```

#### Delete File

```typescript
await deleteFile({
  fileId: 'file-id',
});
```

### MCP Server Mode

Run as an MCP stdio server:

```bash
# Using npx
npx google-drive-mcp

# Or with token file
GOOGLE_DRIVE_TOKEN_FILE=/path/to/token.json npx google-drive-mcp

# Or with env var
GOOGLE_DRIVE_TOKEN='{"access_token":"..."}' npx google-drive-mcp
```

#### Available MCP Tools

| Tool Name | Description |
|-----------|-------------|
| `googleDriveListFiles` | List files in Google Drive |
| `googleDriveUploadFile` | Upload a file to Google Drive |
| `googleDriveGetFile` | Get file metadata |
| `googleDriveDownloadFile` | Download file content |
| `googleDriveCreateFolder` | Create a new folder |
| `googleDriveSearchFiles` | Search files with query |
| `googleDriveDeleteFile` | Delete a file |

## API Reference

### Types

```typescript
// Token structure
export interface Tokens {
  access_token: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

// Client options
export interface DriveClientOptions {
  tokens?: Tokens;
  clientId?: string;
  clientSecret?: string;
}

// List files result
export interface ListFilesResult {
  files: Array<{
    id: string;
    name: string;
    mimeType: string;
    size?: number;
    createdTime?: string;
    modifiedTime?: string;
    parents?: string[];
    webViewLink?: string;
  }>;
  nextPageToken?: string;
}

// Upload file result
export interface UploadFileResult {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  webViewLink?: string;
  createdTime?: string;
}

// Download file result
export interface DownloadFileResult {
  id: string;
  name: string;
  mimeType: string;
  content: Buffer;
  size: number;
}

// Create folder result
export interface CreateFolderResult {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  webViewLink?: string;
}
```

### Functions

#### `createDriveClient(options?: DriveClientOptions)`

Create a Google Drive client instance.

#### `resolveTokens(provided?: Tokens): Tokens | null`

Resolve tokens from available sources.

#### `requireTokens(provided?: Tokens): Tokens`

Resolve tokens or throw `TokenNotFoundError`.

#### `listFiles(options?: ListFilesOperationOptions): Promise<ListFilesResult>`

List files in Google Drive.

#### `uploadFile(options: UploadFileOperationOptions): Promise<UploadFileResult>`

Upload a file to Google Drive.

#### `getFile(options: GetFileOperationOptions): Promise<FileMetadata>`

Get file metadata.

#### `downloadFile(options: DownloadFileOperationOptions): Promise<DownloadFileResult>`

Download file content.

#### `createFolder(options: CreateFolderOperationOptions): Promise<CreateFolderResult>`

Create a new folder.

#### `searchFiles(options: SearchFilesOperationOptions): Promise<ListFilesResult>`

Search files with query.

#### `deleteFile(options: DeleteFileOperationOptions): Promise<boolean>`

Delete a file.

## Building and Testing

### Prerequisites

- Node.js 18+
- npm

### Build

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build
```

### Test

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Development

```bash
# Build in watch mode
tsc --watch
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
